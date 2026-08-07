#!/usr/bin/env python3
# ============================================================
#  字体子集化脚本：从全站文案提取用到的字符 → 裁剪字体 → assets/fonts/
#  用法：python subset-fonts.py
#
#  为什么要子集化：Noto Serif SC 完整版 25MB，全站实际只用到约 1800 个汉字，
#  裁剪后每个字重仅几十 KB。玩家在中国大陆访问不到 Google Fonts，
#  所以字体必须随站点自托管，体积就成了硬约束。
#
#  新增剧情文案后请重跑本脚本，否则新字会缺字（回退到系统宋体）。
#  源字体放在 gitignored 的 fonts-src/（见 README 顶部注释），不进仓库。
# ============================================================
import sys
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# Windows 控制台默认 GBK，直接 print 中文/符号会 UnicodeEncodeError
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent
SRC = ROOT / 'fonts-src'
OUT = ROOT / 'assets' / 'fonts'

# 扫描这些文件提取字符：静态结构 + 全部文案 + 运行时拼接的字符串（队名/状态词等）
SCAN_GLOBS = ['index.html', '*Content.js', 'src/*.js']

# (源文件, 输出名前缀, 是否只要拉丁, 需要的字重)
#
# 中文只出 400：一个字重的中文子集就要约 500KB，而主界面真正需要粗体中文的
# 只有「上一轮比赛结果 / 红鸟的不满 / 预算的『万欧元』」三处，为此再背一个
# 500KB 不划算 —— 这三处已在 style.css 里显式改回 400（同时也和名片本身
# 全用 400 的设计一致），因此不会触发浏览器的伪粗体。
# 拉丁两个字重都要：数字/英文标题有加粗需求，而拉丁子集每个仅约 40KB。
FONTS = [
    ('CormorantGaramond-var.ttf', 'CormorantGaramond', True,  [400, 700]),
    ('NotoSerifSC-var.ttf',       'NotoSerifSC',       False, [400]),
]

# 拉丁字体不需要汉字，但需要覆盖 ASCII + 常用西文标点/符号
LATIN_EXTRA = (
    ''.join(chr(c) for c in range(0x20, 0x7F))      # ASCII 可见字符
    + '·×÷—–…‘’“”€£¥©®°±≤≥≠→←↑↓'
    + ' '                                       # 不换行空格
)

# 中文字体额外需要的全角标点（正则只抓汉字，标点要单独补）
CJK_PUNCT = '　，。、；：？！“”‘’（）《》〈〉【】〔〕—…·～￥「」『』﹁﹂'


def collect_chars() -> set:
    """扫描源文件，收集所有出现过的字符。"""
    chars = set()
    files = []
    for pattern in SCAN_GLOBS:
        files.extend(sorted(ROOT.glob(pattern)))
    if not files:
        sys.exit('[subset] 没扫到任何源文件，检查 SCAN_GLOBS')
    for f in files:
        chars |= set(f.read_text(encoding='utf-8', errors='ignore'))
    return chars


def build_subset(src_name: str, out_prefix: str, latin_only: bool,
                 weights: list, text: str):
    src_path = SRC / src_name
    if not src_path.exists():
        sys.exit(
            f'[subset] 缺少源字体 {src_path}\n'
            f'         请先下载到 fonts-src/（见脚本顶部注释）'
        )

    for weight in weights:
        font = TTFont(src_path)
        # 可变字体 → 抽出指定字重的静态实例（两款源字体都是 [wght] 可变字体）
        if 'fvar' in font:
            font = instancer.instantiateVariableFont(font, {'wght': weight})

        options = subset.Options()
        options.flavor = 'woff2'          # 需要 brotli；比 TTF 小约 40%
        options.notdef_outline = True
        options.hinting = False           # 丢掉 hinting 指令，现代浏览器不需要
        # 只额外保留数字变体特性，供 CSS 的 font-variant-numeric 使用。
        # 切勿改成 ['*']：那会把 Cormorant 的小型大写/花饰等全部备选字形一并保留，
        # 实测会让两款字体从 ~180KB 膨胀到 ~1.8MB。
        options.layout_features += ['tnum', 'lnum']

        subsetter = subset.Subsetter(options=options)
        subsetter.populate(text=text)
        subsetter.subset(font)

        out_path = OUT / f'{out_prefix}-{weight}.woff2'
        font.flavorData = None
        font.save(out_path)
        font.close()

        kb = out_path.stat().st_size / 1024
        scope = '拉丁' if latin_only else '中文+拉丁'
        print(f'[subset] {out_path.name:<28} {kb:6.1f} KB  ({scope}, wght={weight})')


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    chars = collect_chars()
    cjk = {c for c in chars if '一' <= c <= '鿿'}
    latin_text = ''.join(sorted(set(LATIN_EXTRA)))
    cjk_text = latin_text + ''.join(sorted(cjk | set(CJK_PUNCT)))

    print(f'[subset] 扫描到唯一字符 {len(chars)} 个，其中汉字 {len(cjk)} 个')

    for src_name, out_prefix, latin_only, weights in FONTS:
        build_subset(src_name, out_prefix, latin_only, weights,
                     latin_text if latin_only else cjk_text)

    total = sum(p.stat().st_size for p in OUT.glob('*.woff2')) / 1024
    print(f'[subset] 完成，assets/fonts/ 合计 {total:.0f} KB')


if __name__ == '__main__':
    main()
