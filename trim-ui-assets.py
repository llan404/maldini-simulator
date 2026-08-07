#!/usr/bin/env python3
# ============================================================
#  主界面 UI 素材裁边脚本：Picture_Main/*.png → assets/ui/*.png
#  用法：python trim-ui-assets.py
#
#  为什么需要：源素材导出时四周带了大片透明留白（例如「扣子.png」画布
#  1480x2100、实际图形只有 183x495），直接拿来做背景/定位会算不准位置，
#  体积也白白浪费。本脚本按 alpha 通道裁到实际内容边界，输出到 assets/ui/。
#
#  **原图不动**：Picture_Main/ 仍是你的源文件，重新导出后重跑本脚本即可。
#  主要示意图.JPG 是设计稿、不是游戏素材，不参与裁剪也不进产物。
# ============================================================
import sys
from pathlib import Path

from PIL import Image

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = Path(__file__).parent
SRC = ROOT / 'Picture_Main'
OUT = ROOT / 'assets' / 'ui'

# 源文件名（中文）→ 输出名（英文，避免 URL 里出现中文百分号编码）
RENAME = {
    '文件夾.png': 'folder.png',
    '報紙.png':   'newspaper.png',
    '手機.png':   'phone.png',
    '門票.png':   'ticket.png',
    '照片框.png': 'photoframe.png',
    '回形針.png': 'paperclip.png',
    '扣子.png':   'clasp.png',
}

# 照片类素材：本身没有透明边可裁，按原样拷贝（转 PNG 只会让照片变大）
COPY = {
    '迪亚斯1.JPG': 'photo-brahim.jpg',
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    total_before = total_after = 0

    for src_name, out_name in RENAME.items():
        src = SRC / src_name
        if not src.exists():
            print(f'[trim] 跳过（找不到）：{src_name}')
            continue

        im = Image.open(src).convert('RGBA')
        bbox = im.getchannel('A').getbbox()
        cropped = im.crop(bbox) if bbox else im

        dst = OUT / out_name
        cropped.save(dst, optimize=True)

        before = src.stat().st_size
        after = dst.stat().st_size
        total_before += before
        total_after += after
        print(f'[trim] {src_name:<12} {im.size[0]}x{im.size[1]} → '
              f'{cropped.size[0]}x{cropped.size[1]}  '
              f'{before/1024:6.0f}KB → {after/1024:6.0f}KB  ({out_name})')

    for src_name, out_name in COPY.items():
        src = SRC / src_name
        if not src.exists():
            print(f'[trim] 跳过（找不到）：{src_name}')
            continue
        dst = OUT / out_name
        dst.write_bytes(src.read_bytes())
        print(f'[trim] {src_name:<12} 原样拷贝 {src.stat().st_size/1024:6.0f}KB  ({out_name})')

    print(f'[trim] 裁边合计 {total_before/1024:.0f}KB → {total_after/1024:.0f}KB')


if __name__ == '__main__':
    main()
