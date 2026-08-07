// ===== 球队消息（总监终端·手机界面：邮件/私信/论坛/球员四个分区）=====
// 图标用 currentColor，主屏图标容器设白色、底部标签按激活态着色
const terminalIcons = {
    email:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    dm:      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-5 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>',
    forum:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><line x1="12" y1="5" x2="12" y2="19"/><circle cx="12" cy="12" r="2.6"/><path d="M3 9h2.4v6H3M21 9h-2.4v6H21"/></svg>',
    players: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z"/></svg>'
};
// 邮件全部读完时，底部「邮件」标签改用打开的信封图标
const TAB_ICON_EMAIL_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9l6.2 4.65a3 3 0 0 0 3.6 0L20 9"/><path d="M3 9.18a2 2 0 0 1 1.03-1.75l7-3.89a2 2 0 0 1 1.94 0l7 3.89A2 2 0 0 1 21 9.18V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
// 分区结构（标签/标题/配色/空态）在此；文字内容（messages）来自 terminalContent.js 的 TERMINAL_CONTENT。
// 注意：terminalContent.js 须在 index.html 中先于本文件引入。
const terminalSections = {
    email:   { tab: '邮件', app: '总监邮箱',   accent: '#c62828', empty: '暂无邮件',   messages: TERMINAL_CONTENT.email },
    dm:      { tab: '私信', app: '社媒私信',   accent: '#1c1c1c', empty: '暂无私信',   get messages() { return (gameStats.dynamicDMs && gameStats.dynamicDMs.length) ? TERMINAL_CONTENT.dm.concat(gameStats.dynamicDMs) : TERMINAL_CONTENT.dm; } },
    forum:   { tab: '论坛', app: '球迷论坛',   accent: '#8B0000', empty: '论坛暂无新帖', get messages() { return gameStats.forumPosts || []; } },
    players: { tab: '球员', app: '球员档案',   accent: '#3a2a52', isPlayers: true }
};
const TERMINAL_ORDER = ['email', 'dm', 'forum', 'players'];
// 触发型邮件（带 trigger）未送达前不显示、不计未读；无 trigger 的消息始终可见
const isMsgDelivered = m => !m.trigger || !!(gameStats.deliveredEmails && gameStats.deliveredEmails[m.trigger]);
const terminalUnread = sec => (sec.messages || []).filter(m => m.unread && isMsgDelivered(m)).length;
// 触发型邮件送达收件箱（trigger 对应 terminalContent.js 中邮件的 trigger 字段；幂等）
function deliverEmail(trigger) {
    if (!gameStats.deliveredEmails) gameStats.deliveredEmails = {};
    // 记录送达时的赛季与回合，供收件箱显示时间与排序；幂等（保留首次送达的回合）
    if (!gameStats.deliveredEmails[trigger]) gameStats.deliveredEmails[trigger] = { s: gameStats.season, r: gameStats.round, budget: gameStats.budget };
    updateTeamNewsDot(); // 新邮件 → 刷新主按钮红点
}

// ===== 终端分区通知开关（邮件/私信/论坛/球员各自独立）=====
// 通知开启且该分区有未读 → 主界面「球队消息」按钮亮红点；关闭则该分区未读不计入红点
const notifyOn = key => !gameStats.notifyPrefs || gameStats.notifyPrefs[key] !== false; // 默认开启
const BELL_ON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>';
const BELL_OFF_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/><line x1="3.2" y1="3.2" x2="20.8" y2="20.8"/></svg>';
// 分区主屏头部：标题 + 右上角通知铃铛（不突兀的开关；亮=开，划掉=关）
function tmSecHead(key) {
    const on = notifyOn(key);
    return `<div class="tm-sec-head">
        <div class="tm-sec-title">${terminalSections[key].app}</div>
        <button class="tm-notify${on ? ' on' : ''}" data-key="${key}" aria-label="通知开关" title="${on ? '通知已开启' : '通知已关闭'}">${on ? BELL_ON_SVG : BELL_OFF_SVG}</button>
    </div>`;
}
function wireNotifyToggle(screen) {
    const b = screen.querySelector('.tm-notify');
    if (b) b.addEventListener('click', () => toggleNotify(b.dataset.key));
}
function toggleNotify(key) {
    if (!gameStats.notifyPrefs) gameStats.notifyPrefs = {};
    gameStats.notifyPrefs[key] = !notifyOn(key);
    renderTerminalSection(key); // 重渲染当前分区以更新铃铛图标
    updateTeamNewsDot();
}
// 主界面「球队消息」红点：任一「通知开启」分区有未读即显示
function updateTeamNewsDot() {
    const btn = document.getElementById('show-team-news-btn');
    const dot = btn && btn.querySelector('.tn-dot');
    if (!dot) return;
    const has = TERMINAL_ORDER.some(key => notifyOn(key) && terminalUnread(terminalSections[key]) > 0);
    dot.classList.toggle('hidden', !has);
}

// 状态栏左侧显示当前真实时间（24 小时制，分钟补零）
function setTerminalClock() {
    const t = new Date();
    const el = document.getElementById('ts-time');
    if (el) el.textContent = `${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`;
}

// 底部标签栏：邮件/私信/论坛/球员，带未读角标；选中项淡红
function buildTerminalTabbar(activeKey) {
    const bar = document.getElementById('terminal-tabbar');
    const screenEl = document.getElementById('terminal-screen');
    if (screenEl) screenEl.dataset.sec = activeKey; // 分区字体切换：邮件=等线、私信=黑体（见 style.css）
    bar.innerHTML = '';
    TERMINAL_ORDER.forEach(key => {
        const sec = terminalSections[key];
        const unread = sec.isPlayers ? 0 : terminalUnread(sec);
        // 邮件全部读完 → 标签图标换成打开的信封
        const icon = (key === 'email' && unread === 0) ? TAB_ICON_EMAIL_OPEN : terminalIcons[key];
        const tab = document.createElement('button');
        tab.className = 'terminal-tab' + (activeKey === key ? ' active' : '');
        tab.innerHTML = `<span class="tt-icon">${icon}${unread ? `<span class="tt-badge">${unread}</span>` : ''}</span><span class="tt-label">${sec.tab}</span>`;
        tab.addEventListener('click', () => renderTerminalSection(key));
        bar.appendChild(tab);
    });
}

function deliverSoldPlayerDM(p) {
    if (!p) return;
    if (!gameStats.dynamicDMs) gameStats.dynamicDMs = [];
    const tpl = TERMINAL_CONTENT.dmTemplates && TERMINAL_CONTENT.dmTemplates.soldPlayer;
    const key = `soldPlayer_${p.id}_${gameStats.season}_${gameStats.round}`;
    gameStats.dynamicDMs.push({
        from: p.name,
        unread: true,
        trigger: key,
        bubbles: (tpl && tpl.bubbles ? tpl.bubbles : []).slice()
    });
    deliverEmail(key);
}

// 「出售」球员（AAA球探求购·回复「我会考虑的」后可用）：按报价套现、撤销签约加成、移出阵容且不再回转会窗
function sellScoutPlayer(id) {
    if (!gameStats.signedPlayers.includes(id)) return;
    const p = transferBuyPlayers.find(b => b.id === id);
    const paid = (gameStats.purchasePrice && gameStats.purchasePrice[id] != null) ? gameStats.purchasePrice[id] : (p ? p.cost : 0);
    const price = roundUpOfferPrice(paid * 1.1);
    gameStats.signedPlayers = gameStats.signedPlayers.filter(x => x !== id);
    if (!gameStats.soldPlayers) gameStats.soldPlayers = [];
    if (!gameStats.soldPlayers.includes(id)) gameStats.soldPlayers.push(id);
    gameStats.scoutSellable = (gameStats.scoutSellable || []).filter(x => x !== id);
    const rev = {};
    if (p && p.effects) Object.entries(p.effects).forEach(([k, v]) => { rev[k] = -v; updateStat(k, -v); }); // 撤销签约加成
    updateBudget(price);
    if (p) choiceHistory.push({ round: gameStats.round, eventName: '球员交易', optionText: `出售${p.name}（套现 €${price}万）`, effects: Object.assign({ budget: price }, rev), kind: 'special' });
    deliverSoldPlayerDM(p);
    renderTerminalSection('players'); // 刷新球员档案
}

function renderTerminalPlayers() {
    const signed = (gameStats.signedPlayers || []).map(id => transferBuyPlayers.find(p => p.id === id)).filter(Boolean);
    if (signed.length === 0) return '<div class="tm-empty">暂无已签约球员<br>转会窗签下球员后在此查看其状态与成长</div>';
    return '<div class="tm-player-list">' + signed.map(p => {
        const tags = []; // 仅显示「欧冠」「首发」两类标签；都没有则不显示标签
        if (p.uclTag) tags.push('<span class="tm-tag tm-tag-ucl">欧冠</span>');
        if ((gameStats.starterPromise || []).includes(p.id)) tags.push('<span class="tm-tag tm-tag-starter">首发</span>'); // 谈判许诺首发且已签下
        const tagsHtml = tags.length ? `<span class="tm-tags">${tags.join('')}</span>` : '';
        const g = playerGrowthOf(p.id);
        const paid = (gameStats.purchasePrice && gameStats.purchasePrice[p.id] != null) ? gameStats.purchasePrice[p.id] : p.cost;
        const sellBtn = (gameStats.scoutSellable || []).includes(p.id)
            ? `<button class="tm-sell-btn" data-sell="${p.id}">出售 €${roundUpOfferPrice(paid * 1.1)}万</button>` : '';
        return `<div class="tm-player-row">
            <div class="tm-player-line"><button class="tm-detail-btn" data-detail="${p.id}">详情</button><span class="tm-player-name">${p.name}${tagsHtml}</span>${sellBtn}</div>
            <div class="tm-growth">
                <span class="tm-growth-label">成长值 ${g}/10</span>
                <div class="tm-growth-bar">${growthBarHtml(g)}</div>
            </div>
        </div>`;
    }).join('') + '</div>';
}

// 球员原型名（详情页展示；无对应原型的球员显示原代号名）。丹尼尔·马尔蒂尼卡片本身即真名，无需映射。
// 注：10 克罗地亚铁腰原型=布罗佐维奇，但按设定「详情页不显示原型」，故不入此表（原型仅记录在 SeasonEvent.md）
const PLAYER_PROTO_NAME = {
    lb_winger: '特奥·埃尔南德斯', winger_pt: '拉斐尔·莱奥', striker_fr: '奥利维尔·吉鲁',
    cb_eng: '亚历山德罗·弗洛伦齐', gk_talent: '迈克·麦尼昂', maestro: '兹拉坦·伊布拉希莫维奇',
    cm_youth_it: '桑德罗·托纳利', belgian_star: '夏尔·德凯特拉雷', mid_bel: '布拉欣·迪亚斯',
    cb_den: '西蒙·克亚尔', cb_eng_loan: '菲卡约·托莫里', cb_fr_young: '皮埃尔·卡卢卢',
    striker_vet: '卢卡·莫德里奇', winger_usa: '克里斯蒂安·普利希奇', cm_bel: '亚历克西斯·萨勒马克尔斯'
};

// 球员详情：终端内展示球员卡（放大易读版：原型名为主标题、代号作副标，介绍/数值/身价左对齐；身价=实际成交价快照）
function openPlayerDetail(id) {
    const p = transferBuyPlayers.find(x => x.id === id);
    if (!p) return;
    const paid = (gameStats.purchasePrice && gameStats.purchasePrice[p.id] != null) ? gameStats.purchasePrice[p.id] : p.cost;
    const proto = PLAYER_PROTO_NAME[p.id];
    const tags = [`<span class="tm-tag ${TM_TAG_CLASS[p.tagColor]}">${p.tag}</span>`];
    if (p.uclTag) tags.push('<span class="tm-tag tm-tag-ucl">欧冠</span>');
    const screen = document.getElementById('terminal-screen');
    screen.innerHTML =
        `<div class="mail-detail-head"><button class="mail-back" aria-label="返回球员"><span class="mail-back-arrow">‹</span>球员</button></div>
        <div class="tm-detail-wrap">
            <div class="tm-detail-card">
                <div class="tm-detail-top"><span class="tm-detail-name">${proto || p.name}</span><span class="tm-tags">${tags.join('')}</span></div>
                ${proto ? `<div class="tm-detail-code">${p.name}</div>` : ''}
                <div class="tm-detail-desc">${p.desc}</div>
                <div class="tm-detail-stats">${tmStatsHtml(p, paid)}</div>
            </div>
        </div>`;
    screen.scrollTop = 0;
    screen.querySelector('.mail-back').addEventListener('click', () => renderTerminalSection('players'));
    buildTerminalTabbar('players');
}

// 成长值方格进度条：10 格，填充至当前成长值
function growthBarHtml(g) {
    let cells = '';
    for (let i = 1; i <= 10; i++) cells += `<span class="tm-growth-cell${i <= g ? ' on' : ''}"></span>`;
    return cells;
}

// 管理层邮件：Gmail 式收件箱（未读=信封闭合图标，已读=打开图标；读完全部后角标消失）
const MAIL_CLOSED_SRC = 'SVG/Handy/email-svgrepo-com.svg';
const MAIL_OPEN_SRC = 'SVG/Handy/email-open-svgrepo-com.svg';
const mailSnippet = body => (body || '').replace(/\s+/g, ' ').trim();
// 私信缩略图只取第一个气泡（首段）的内容
const dmSnippet = body => ((body || '').split(/\n{2,}/)[0] || '').replace(/\s+/g, ' ').trim();
// 正文按空行分段，每段首行缩进两格；称呼（首段，或以「：」「，」结尾）与末尾签名（最后一段）顶头不缩进
const mailBodyHtml = body => {
    const paras = (body || '').split(/\n{2,}/);
    return paras.map((p, idx) => {
        const flush = idx === 0 || idx === paras.length - 1 || /[：:，,]\s*$/.test(p.trim());
        return `<p class="mail-para${flush ? ' mail-greeting' : ''}">${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
};

// 邮件送达点（赛季,回合）：触发型取 deliverEmail 记录；序幕邮件（无 trigger）回合记 0、赛季取 season(默认1)
function emailMeta(m) {
    let season = m.season || 1, round = 0;
    if (m.trigger) {
        const rec = gameStats.deliveredEmails && gameStats.deliveredEmails[m.trigger];
        if (rec && typeof rec === 'object') { season = rec.s; round = rec.r; }
    }
    return { season, round };
}
// 右上角时间标签：回合 0（赛季序幕）显示「第一轮」，其余按送达回合
const emailTimeLabel = m => {
    const { season, round } = emailMeta(m);
    return `第${toChineseNum(season)}赛季·第${round <= 0 ? 1 : round}轮`;
};
// 邮件正文动态占位符：{budget} → 送达时记录的预算快照（缺失则取当前预算），如邮件19「夏窗预算」
function resolveEmailBody(m) {
    let body = m.body || '';
    if (body.indexOf('{budget}') !== -1) {
        const rec = gameStats.deliveredEmails && gameStats.deliveredEmails[m.trigger];
        const b = (rec && typeof rec === 'object' && rec.budget != null) ? rec.budget : gameStats.budget;
        body = body.replace(/\{budget\}/g, b);
    }
    return body;
}

function renderEmailInbox() {
    const sec = terminalSections.email;
    const screen = document.getElementById('terminal-screen');
    // 仅显示已送达邮件；最后送达的排最上（赛季↓、回合↓、标号↓），同回合标号大者更晚发送、更靠上
    const visible = (sec.messages || [])
        .map((m, i) => ({ m, i, meta: emailMeta(m) }))
        .filter(x => isMsgDelivered(x.m))
        .sort((a, b) => (b.meta.season - a.meta.season) || (b.meta.round - a.meta.round) || (b.i - a.i));
    const rows = visible.map(({ m, i }) => {
        const ico = m.unread
            ? `<img class="mail-ico" src="${MAIL_CLOSED_SRC}" alt="未读">`
            : `<img class="mail-ico mail-ico-read" src="${MAIL_OPEN_SRC}" alt="已读">`;
        return `<button class="mail-row${m.unread ? ' mail-unread' : ''}" data-i="${i}">
            ${ico}
            <span class="mail-row-main">
                <span class="mail-row-top">
                    <span class="mail-row-from">${m.from}</span>
                    <span class="mail-row-time">${emailTimeLabel(m)}</span>
                </span>
                <span class="mail-row-line2"><span class="mail-row-subject">${m.subject || '(无主题)'}</span><span class="mail-row-snippet"> — ${mailSnippet(resolveEmailBody(m))}</span></span>
            </span>
        </button>`;
    }).join('');
    const footer = visible.length ? '<div class="mail-end">暂无更多邮件</div>' : '';
    screen.innerHTML =
        `${tmSecHead('email')}
        <div class="tm-home-rule"></div>
        <div class="mail-list">${rows || `<div class="tm-empty">${sec.empty}</div>`}</div>
        ${footer}`;
    screen.scrollTop = 0;
    screen.querySelectorAll('.mail-row').forEach(b => b.addEventListener('click', () => openEmail(+b.dataset.i)));
    wireNotifyToggle(screen);
    buildTerminalTabbar('email');
}

function openEmail(i) {
    const sec = terminalSections.email;
    const m = sec.messages[i];
    if (!m) return;
    m.unread = false; // 标记已读 → 底部角标随未读数减少，读完全部即消失
    const screen = document.getElementById('terminal-screen');
    screen.innerHTML =
        `<div class="mail-detail-head"><button class="mail-back" aria-label="返回收件箱"><span class="mail-back-arrow">‹</span>收件箱</button></div>
        <div class="mail-detail-fields">
            <div class="mail-field"><span class="mail-field-label">发件人：</span>${m.from}</div>
            <div class="mail-field"><span class="mail-field-label">收件人：</span>${m.to || '保罗·马尔蒂尼'}</div>
            <div class="mail-field"><span class="mail-field-label">抄送：</span>${m.cc || '—'}</div>
            <div class="mail-field"><span class="mail-field-label">主题：</span>${m.subject || '(无主题)'}</div>
        </div>
        <div class="mail-detail-rule"></div>
        <div class="mail-detail-body">${mailBodyHtml(resolveEmailBody(m))}</div>`;
    screen.scrollTop = 0;
    screen.querySelector('.mail-back').addEventListener('click', renderEmailInbox);
    buildTerminalTabbar('email');
    updateTeamNewsDot(); // 读邮件 → 未读减少，刷新红点
}

// 社媒私信：列表带头像、可点开；二级界面以对话框（聊天气泡）展示
// 默认头像：统一的小人头剪影（不按名字取字）
const DM_AVATAR_SVG = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 19.5c0-4 3.4-6.2 7.5-6.2s7.5 2.2 7.5 6.2z"/></svg>';
// 俱乐部→队徽文件映射（发件人命中即以真实队徽替换默认小人头；文件在 SVG/ 目录）
const CLUB_CRESTS = {
    'AC米兰': 'SVG/SA/ACM.svg',
    '国际米兰': 'SVG/SA/inter-milan-2021.svg',
    '皇家马德里': 'SVG/E/Real-Madrid-CF-v2002.svg',
    '利物浦': 'SVG/E/Liverpool-Football-Club-v2024-minor.svg',
    '亚特兰大': 'SVG/SA/Atalanta-BC-v1993.svg',
    '尤文图斯': 'SVG/SA/juventus-4.svg',
};
function dmAvatar(from) {
    const src = CLUB_CRESTS[from];
    if (src) return `<span class="dm-avatar dm-avatar-club"><img class="dm-crest" src="${src}" alt="${from}"></span>`;
    return `<span class="dm-avatar">${DM_AVATAR_SVG}</span>`;
}

// 私信按「发件人」聚合为对话串：每人一行；串内按送达先后、收件箱按各人最后送达时间排序
let dmThreadGroups = [];
function dmGroups() {
    const sec = terminalSections.dm;
    const byFrom = new Map();
    (sec.messages || [])
        .map((m, i) => ({ m, i, meta: emailMeta(m) }))
        .filter(x => isMsgDelivered(x.m)) // 带 trigger 的私信未送达前不计入
        .forEach(x => { if (!byFrom.has(x.m.from)) byFrom.set(x.m.from, []); byFrom.get(x.m.from).push(x); });
    const groups = [];
    byFrom.forEach((arr, from) => {
        arr.sort((a, b) => (a.meta.season - b.meta.season) || (a.meta.round - b.meta.round) || (a.i - b.i)); // 串内：先送达在前
        groups.push({ from, items: arr, latest: arr[arr.length - 1], anyUnread: arr.some(x => x.m.unread) });
    });
    groups.sort((a, b) => (b.latest.meta.season - a.latest.meta.season) || (b.latest.meta.round - a.latest.meta.round) || (b.latest.i - a.latest.i)); // 最后送达的人在最上
    return groups;
}

function renderDMInbox() {
    const sec = terminalSections.dm;
    const screen = document.getElementById('terminal-screen');
    screen.classList.remove('dm-thread-view', 'dm-cg', 'dm-cg-enter'); // 退出对话视图 → 恢复屏幕整体滚动，并卸掉 CG 暗色皮
    dmThreadGroups = dmGroups();
    const rows = dmThreadGroups.map((g, gi) => {
        const last = g.latest.m;
        return `<button class="mail-row${g.anyUnread ? ' mail-unread' : ''}" data-i="${gi}">
            ${dmAvatar(g.from)}
            <span class="mail-row-main">
                <span class="mail-row-from">${g.from}${g.anyUnread ? '<span class="dm-dot"></span>' : ''}</span>
                <span class="mail-row-line2"><span class="mail-row-snippet">${dmThreadSnippet(last)}</span></span>
            </span>
        </button>`;
    }).join('');
    screen.innerHTML =
        `${tmSecHead('dm')}
        <div class="tm-home-rule"></div>
        <div class="mail-list">${rows || `<div class="tm-empty">${sec.empty}</div>`}</div>`;
    screen.scrollTop = 0;
    screen.querySelectorAll('.mail-row').forEach(b => b.addEventListener('click', () => openDM(+b.dataset.i)));
    wireNotifyToggle(screen);
    buildTerminalTabbar('dm');
}

// 聊天气泡：对方(左·dm-in) / 玩家(右·dm-out) / 「正在输入」指示器
const dmBubbleIn = t => `<div class="dm-bubble dm-in">${t.replace(/\n/g, '<br>')}</div>`;
const dmBubbleOut = t => `<div class="dm-bubble dm-out">${t.replace(/\n/g, '<br>')}</div>`;
// 玩家气泡 + 尾部红色感叹号（发送后显示，示意「未被对方接收」，如消息48：回复国米后红!）
const dmBubbleOutFail = t => `<div class="dm-out-fail"><span class="dm-fail-mark" aria-label="发送失败">!</span>${dmBubbleOut(t)}</div>`;
const dmTypingHTML = '<div class="dm-bubble dm-in dm-typing"><span></span><span></span><span></span></div>';
// answer 归一化为数组（字符串→单条；数组→多条；空→无回复）
const dmAnswerList = answer => Array.isArray(answer) ? answer : (answer ? [answer] : []);
// 收件箱缩略：未回复 → 对方第一句；已回复 → 对话中最后一句（对方最后的回应，无回应则玩家自己的回复）
function dmThreadSnippet(m) {
    if (m.replies && m.repliedIndex !== undefined && m.replies[m.repliedIndex]) {
        const r = m.replies[m.repliedIndex];
        const answers = dmAnswerList(r.answer).filter(a => typeof a === 'string');
        return dmSnippet(answers.length ? answers[answers.length - 1] : (r.text || ''));
    }
    const first = m.body || (m.bubbles && m.bubbles.find(b => typeof b === 'string')) || '';
    return dmSnippet(first);
}
// 一条消息的对方气泡（bubbles 优先，否则旧格式 body 拆段）
const dmIncoming = m => m.bubbles || (m.body || '').split(/\n{2,}/).filter(Boolean);

// 私信内嵌的球员转会窗卡片（球探引荐用，见消息64）
function dmScoutCardHTML(p) {
    const labels = { player: '球员状态', fans: '球迷', trust: '信任', media: '媒体' };
    const chips = Object.entries(p.effects).map(([k, v]) =>
        `<span class="dm-sc-chip">${labels[k] || k} <span class="${v > 0 ? 'tm-stat-pos' : 'tm-stat-neg'}">${v > 0 ? '+' : ''}${v}</span></span>`).join('');
    return `<div class="dm-scout-card">
        <div class="dm-sc-eyebrow">球探报告</div>
        <div class="dm-sc-top"><span class="dm-sc-name">${p.name}</span><span class="tm-tag ${TM_TAG_CLASS[p.tagColor]}">${p.tag}</span></div>
        <div class="dm-sc-desc">${p.desc}</div>
        <div class="dm-sc-chips">${chips}<span class="dm-sc-chip dm-sc-price">€${p.cost}万</span></div>
    </div>`;
}
// 单条气泡渲染：字符串 → 文字气泡；{card:id} → 球员卡片
function dmBubbleHTML(b) {
    if (b && typeof b === 'object' && b.card) {
        const p = transferBuyPlayers.find(x => x.id === b.card);
        return p ? dmScoutCardHTML(p) : '';
    }
    return dmBubbleIn(b);
}

function openDM(gi) {
    const group = dmThreadGroups[gi];
    if (!group) return;
    group.items.forEach(x => x.m.unread = false); // 整串标记已读
    const screen = document.getElementById('terminal-screen');
    // 结构固定：屏幕本身不滚（dm-thread-view），顶部（返回/头像/名称）为固定块+底缘长横线，
    // 对话串在横线以下的 #dm-chat 独立滚动容器内滚动，物理上不会穿过横线以上区域
    screen.classList.add('dm-thread-view');
    screen.innerHTML =
        `<div class="dm-thread-top">
            <div class="mail-detail-head"><button class="mail-back" aria-label="返回私信"><span class="mail-back-arrow">‹</span>私信</button></div>
            <div class="dm-chat-head">${dmAvatar(group.from)}<span class="dm-chat-name">${group.from}</span></div>
        </div>
        <div class="dm-chat" id="dm-chat"></div>`;
    screen.querySelector('.mail-back').addEventListener('click', renderDMInbox);
    applyDmThreadBg(screen, group.from, false); // 已解锁 CG 的对话串：重开时直接带背景，不重放淡入
    renderDMThread(screen, group);
    dmScrollBottom(); // 打开时锁定到最后一条消息（最下）
    buildTerminalTabbar('dm');
    updateTeamNewsDot(); // 读私信 → 未读减少，刷新红点
}

// 对话串 CG 背景：某些回复（reply.dmBg）会给整条对话串永久换上一张立绘做底
// （目前只有消息29「你怎么知道？」→「你心属于我」）。解锁状态存在 gameStats.dmThreadBg[发件人]，
// 图片本身走 CSS 变量 --dm-cg，暗色可读性由 style.css 的 .dm-cg 一族规则接管。
// animate=true 时加一次性淡入（仅解锁那一刻），重开对话不再重放。
function applyDmThreadBg(screen, from, animate) {
    const src = gameStats.dmThreadBg && gameStats.dmThreadBg[from];
    screen.classList.remove('dm-cg', 'dm-cg-enter');
    if (!src) { screen.style.removeProperty('--dm-cg'); return; }
    screen.style.setProperty('--dm-cg', `url("${src}")`);
    screen.classList.add('dm-cg');
    if (!animate) return;
    // .dm-cg-enter 只是「本次是新解锁」的一次性标记：底图淡入 + 暗色皮同步渐变都挂在它上面。
    // 淡入结束后必须摘掉，否则那条 1.8s 的过渡会一直压着按钮 hover 的 0.14s。
    screen.classList.add('dm-cg-enter');
    setTimeout(() => screen.classList.remove('dm-cg-enter'), 2000);
}

// 对话区滚到最下（对话串滚动发生在 #dm-chat 内，屏幕本身在对话视图不滚动）
function dmScrollBottom() {
    const chat = document.getElementById('dm-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
}

// 渲染对话串：同一个人的多条消息，按送达先后从上到下（最后送达在最下），每条消息一个 block、block 间灰线分隔；每条独立回复
function renderDMThread(screen, group) {
    const chat = screen.querySelector('#dm-chat');
    chat.innerHTML = '';
    const items = group.items.slice(); // 按送达先后：先收到的在最上，最后送达在最下
    items.forEach((item, idx) => {
        const m = item.m;
        const block = document.createElement('div');
        block.className = 'dm-msg-block';
        dmIncoming(m).forEach(b => block.insertAdjacentHTML('beforeend', dmBubbleHTML(b)));
        if (m.replies) {
            if (m.repliedIndex !== undefined) {
                // 已回复：玩家气泡 + 对方回应（重开直接展示完整对话）
                const r = m.replies[m.repliedIndex];
                block.insertAdjacentHTML('beforeend', r.redMark ? dmBubbleOutFail(r.text) : dmBubbleOut(r.text));
                dmAnswerList(r.answer).forEach(a => block.insertAdjacentHTML('beforeend', dmBubbleIn(a)));
            } else {
                // 未回复：本条消息内联出选项（各条消息独立回复）
                const rb = document.createElement('div');
                rb.className = 'dm-reply';
                rb.innerHTML = m.replies.map((r, ix) => {
                    // 选项可带 cost{label,value}：主文案下方灰色小字标签 + 红色数值（数值只在按钮上提示，不进玩家气泡）
                    const cost = r.cost ? `<span class="dm-reply-cost">${r.cost.label} <b>${r.cost.value}</b></span>` : '';
                    return `<button class="dm-reply-btn" type="button" data-idx="${ix}"><span class="dm-reply-act">${r.text}</span>${cost}</button>`;
                }).join('');
                rb.querySelectorAll('.dm-reply-btn').forEach(btn =>
                    btn.addEventListener('click', () => dmAnswerReply(m, +btn.dataset.idx, block, rb)));
                block.appendChild(rb);
            }
        }
        chat.appendChild(block);
        if (idx < items.length - 1) chat.insertAdjacentHTML('beforeend', '<div class="dm-msg-sep"></div>');
    });
}

// 选择回复：移除选项 → 玩家气泡 → 对方逐条「正在输入」1.4s 后揭示（保留打字动画）
function dmAnswerReply(m, idx, block, rb) {
    m.repliedIndex = idx; // 记录选择
    rb.remove();
    const r = m.replies[idx];
    // 回复球员本人的私信 → 该球员成长值 +1（上限10；未签下也预置，签下时 initPlayerGrowth 不覆盖）
    const growthId = DM_SENDER_PLAYER[m.from];
    if (growthId) {
        if (!gameStats.playerGrowth) gameStats.playerGrowth = {};
        gameStats.playerGrowth[growthId] = Math.min(10, playerGrowthOf(growthId) + 1);
    }
    // 球探引荐(消息64)且该球员已在转会窗签下 → 交涉作废：不扣数值、不推进；除「还是算了吧」外球探统一恭贺，随后放行下一位
    const scoutSigned = m.from === '球探团队' && m.playerId && gameStats.signedPlayers.includes(m.playerId);
    let answer = r.answer;
    if (scoutSigned) {
        if (gameStats.scout64ActiveId === m.playerId) gameStats.scout64ActiveId = null;
        if (gameStats.scout64Pending && gameStats.scout64Pending.playerId === m.playerId) gameStats.scout64Pending = null;
        if (!r.pass) answer = '很高兴看到他加入米兰。'; // 「还是算了吧」(pass)按正常逻辑回复「好的，总监。」
    } else {
        // 回复副作用（声明式，随存档持久；与 repliedIndex 同存档周期，无重复结算）：
        if (r.effects) Object.entries(r.effects).forEach(([k, v]) => updateStat(k, v)); // 扣数值
        if (r.grantIntel && m.playerId) {                                               // 解锁签约「情报加持」+ 保证下窗出现
            if (!gameStats.transferIntel) gameStats.transferIntel = [];
            if (!gameStats.transferIntel.includes(m.playerId)) gameStats.transferIntel.push(m.playerId);
            if (!gameStats.forceWindowPlayers) gameStats.forceWindowPlayers = [];
            if (!gameStats.forceWindowPlayers.includes(m.playerId)) gameStats.forceWindowPlayers.push(m.playerId);
        }
        if (r.interest && m.playerId) gameStats.scout64Pending = { playerId: m.playerId, round: gameStats.round }; // 触发下一阶段
        if (r.scoutDone) gameStats.scout64ActiveId = null; // 本次交涉结束 → 球探可引荐下一位
    }
    // AAA专业球探求购：回复「我会考虑的」(sellable) → 该球员在终端球员档案出现「出售」按钮（按报价套现并永久移出）
    if (m.from === 'AAA专业球探' && r.sellable && m.playerId) {
        if (!gameStats.scoutSellable) gameStats.scoutSellable = [];
        if (!gameStats.scoutSellable.includes(m.playerId) && gameStats.signedPlayers.includes(m.playerId)) gameStats.scoutSellable.push(m.playerId);
    }
    // 解锁对话串 CG 背景（reply.dmBg）：立刻记账 + 预解码，等对方把话说完再显示（见 reveal 末尾）
    if (r.dmBg) {
        if (!gameStats.dmThreadBg) gameStats.dmThreadBg = {};
        gameStats.dmThreadBg[m.from] = r.dmBg;
        const pre = new Image();
        pre.src = r.dmBg;
    }
    block.insertAdjacentHTML('beforeend', r.redMark ? dmBubbleOutFail(r.text) : dmBubbleOut(r.text));
    const answers = dmAnswerList(answer);
    dmScrollBottom();
    const reveal = j => {
        if (j >= answers.length) {
            // 最后一句回应已出现 → 换上 CG 背景（带一次性淡入）
            const sc = document.getElementById('terminal-screen');
            if (r.dmBg && block.isConnected && sc && sc.classList.contains('dm-thread-view'))
                applyDmThreadBg(sc, m.from, true);
            return;
        }
        if (!block.isConnected) return;
        block.insertAdjacentHTML('beforeend', dmTypingHTML);
        dmScrollBottom();
        setTimeout(() => {
            const t = block.querySelector('.dm-typing');
            if (!t || !block.isConnected) return;
            t.remove();
            block.insertAdjacentHTML('beforeend', dmBubbleIn(answers[j]));
            dmScrollBottom();
            reveal(j + 1);
        }, 1400);
    };
    reveal(0);
}

// 球迷论坛：每帖右上角点赞/点踩（初始随机数，玩家可点；互斥、可再点取消）
const THUMB_UP_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M7 22V10l5-8a2 2 0 0 1 2 2v5h4.5a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 17 22H7z"/><path d="M7 10H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>';
const THUMB_DOWN_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M17 2v12l-5 8a2 2 0 0 1-2-2v-5H5.5a2 2 0 0 1-2-2.4l1.4-7A2 2 0 0 1 7 2h10z"/><path d="M17 14h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-3"/></svg>';

function ensureForumVotes(m) {
    if (m.likes === undefined) m.likes = 20 + Math.floor(Math.random() * 220);   // 初始随机点赞 20–239
    if (m.dislikes === undefined) m.dislikes = Math.floor(Math.random() * 40);     // 初始随机点踩 0–39
    if (m.vote === undefined) m.vote = null;
}

function forumVote(i, kind) {
    const m = terminalSections.forum.messages[i];
    if (!m) return;
    m.vote = (m.vote === kind) ? null : kind; // 再点同一项取消；点另一项切换
    renderForum();
}

// 从数组随机取 2 条不重复（不足 2 条则原样返回）
function pickTwo(arr) {
    if (!arr || arr.length <= 1) return (arr || []).slice();
    const i = Math.floor(Math.random() * arr.length);
    let j = Math.floor(Math.random() * (arr.length - 1));
    if (j >= i) j++;
    return [arr[i], arr[j]];
}
let weekForumReplies = []; // 本周（两场临近比赛）已用的回复原文，避免两场抽到同一句；每周开赛重置
// 占位符上下文：{score}=米兰X：Y对手、{goals}=米兰进球、{opp}=对手名；extra 可带 hasNext 等条件
function forumCtx(oppName, score, extra) {
    const [og, tg] = score.split(':').map(Number);
    return Object.assign({ score: `米兰${og}：${tg}${oppName}`, goals: og, opp: oppName, line: `${og}:${tg}` }, extra || {});
}
// 压入一条赛果帖（播报 + 随机2条回复）；回复支持 minGoals / needNext 条件，并对本周去重
function pushForumThread(cat, ctx, opts) {
    if (!cat) return;
    const fill = s => s.replace(/\{score\}/g, ctx.score).replace(/\{goals\}/g, ctx.goals).replace(/\{opp\}/g, ctx.opp);
    const rawText = r => typeof r === 'string' ? r : r.text;
    const ok = r => typeof r === 'string'
        || ((r.minGoals == null || ctx.goals >= r.minGoals) && (!r.needNext || ctx.hasNext) && (r.forScore == null || r.forScore === ctx.line));
    let eligible = cat.replies.filter(r => ok(r) && !weekForumReplies.includes(rawText(r)));
    if (eligible.length < 2) eligible = cat.replies.filter(ok); // 去重后不足2条则放开
    const picked = pickTwo(eligible);
    picked.forEach(r => weekForumReplies.push(rawText(r))); // 记入本周已用，供同周另一场去重
    if (!gameStats.forumPosts) gameStats.forumPosts = [];
    gameStats.forumPosts.unshift({ // 新帖在最上
        from: (opts && opts.from) || TERMINAL_CONTENT.forumPool.broadcaster,
        broadcast: fill(cat.broadcast),
        replies: picked.map(r => fill(rawText(r))),
        round: gameStats.round,
        ucl: !!(opts && opts.ucl), // 欧冠赛果帖 → 论坛卡片淡蓝色
        unread: true
    });
    updateTeamNewsDot(); // 新赛果帖 → 刷新主按钮红点
}
// 联赛赛果帖：胜/平/负 × 强弱；对手=国际米兰走德比专用池
function addMatchForumThread(opponent, result, score) {
    const pool = TERMINAL_CONTENT.forumPool;
    if (!pool) return;
    const outcome = result === 'win' ? 'Win' : result === 'loss' ? 'Lose' : 'Draw';
    const cat = (opponent.name === '国际米兰' && pool['derby' + outcome])
        ? pool['derby' + outcome]
        : pool['league' + outcome + (opponent.category === 'strong' ? 'Strong' : 'Weak')];
    pushForumThread(cat, forumCtx(opponent.name, score));
}
// 欧战赛果帖：欧冠走 ucl*，欧联走 uel*。hasNext=是否还有下一轮
function addUclForumThread(oppName, win, score, hasNext, isFinal) {
    const pool = TERMINAL_CONTENT.forumPool;
    if (!pool) return;
    const suffix = win ? 'Win' : 'Lose';
    const euroPrefix = gameStats.euroType === 'uel' ? 'uel' : 'ucl';
    let key = (isFinal ? euroPrefix + 'Final' : euroPrefix) + suffix;
    if (gameStats.euroType !== 'uel' && isFinal && oppName === '国际米兰' && pool['uclFinalDerby' + suffix]) key = 'uclFinalDerby' + suffix; // 欧冠决赛打国米走德比专用池
    const account = gameStats.euroType === 'uel' ? pool.broadcasterUel : pool.broadcasterUcl; // 欧冠/欧联各自的播报账号
    pushForumThread(pool[key], forumCtx(oppName, score, { hasNext: !!hasNext }), { ucl: true, from: account });
}

function renderForum() {
    const sec = terminalSections.forum;
    const screen = document.getElementById('terminal-screen');
    sec.messages.forEach(m => { m.unread = false; ensureForumVotes(m); }); // 点开即已读 + 初始化随机票数
    const body = (sec.messages || []).length
        ? '<div class="tm-msg-list">' + sec.messages.map((m, i) => {
            const up = m.likes + (m.vote === 'up' ? 1 : 0);
            const down = m.dislikes + (m.vote === 'down' ? 1 : 0);
            const repliesHtml = (m.replies || []).map(r => `<div class="forum-reply">${r}</div>`).join('');
            return `<div class="tm-msg forum-card${m.ucl ? ' forum-card-ucl' : ''}">
                <div class="forum-card-head">
                    <span class="tm-msg-from">${m.from}</span>
                    <span class="forum-votes">
                        <button class="forum-vote up${m.vote === 'up' ? ' voted' : ''}" data-i="${i}" data-kind="up">${THUMB_UP_SVG}<span>${up}</span></button>
                        <button class="forum-vote down${m.vote === 'down' ? ' voted' : ''}" data-i="${i}" data-kind="down">${THUMB_DOWN_SVG}<span>${down}</span></button>
                    </span>
                </div>
                <div class="tm-msg-text forum-broadcast">${m.broadcast || m.text || ''}</div>
                ${repliesHtml ? `<div class="forum-replies">${repliesHtml}</div>` : ''}
            </div>`;
        }).join('') + '</div>'
        : `<div class="tm-empty">${sec.empty}</div>`;
    screen.innerHTML =
        `${tmSecHead('forum')}
        <div class="tm-home-rule"></div>${body}`;
    screen.scrollTop = 0;
    screen.querySelectorAll('.forum-vote').forEach(btn =>
        btn.addEventListener('click', () => forumVote(+btn.dataset.i, btn.dataset.kind)));
    wireNotifyToggle(screen);
    buildTerminalTabbar('forum');
    updateTeamNewsDot(); // 论坛进入即全部已读 → 刷新红点
}

// 渲染某个分区（无单独主屏，开局默认 email，靠底部标签切换）
function renderTerminalSection(key) {
    document.getElementById('terminal-screen').classList.remove('dm-thread-view', 'dm-cg', 'dm-cg-enter'); // 任何分区切换都退出私信对话视图（连带卸掉 CG 暗色皮）
    if (key === 'email') { renderEmailInbox(); return; } // 邮件 → Gmail 式收件箱
    if (key === 'dm') { renderDMInbox(); return; }        // 私信 → 可点开列表
    if (key === 'forum') { renderForum(); return; }       // 论坛 → 点赞/点踩
    const sec = terminalSections[key];
    const screen = document.getElementById('terminal-screen');
    let body;
    if (sec.isPlayers) body = renderTerminalPlayers();
    else if (!(sec.messages || []).length) body = `<div class="tm-empty">${sec.empty}</div>`;
    else body = '<div class="tm-msg-list">' + sec.messages.map(m =>
        `<div class="tm-msg${m.unread ? ' tm-msg-unread' : ''}">
            <div class="tm-msg-head"><span class="tm-msg-from">${m.from}</span>${m.unread ? '<span class="tm-msg-dot"></span>' : ''}</div>
            ${m.subject ? `<div class="tm-msg-subject">${m.subject}</div>` : ''}
            <div class="tm-msg-text">${m.text}</div>
        </div>`).join('') + '</div>';
    screen.innerHTML =
        `${tmSecHead(key)}
        <div class="tm-home-rule"></div>${body}`;
    screen.scrollTop = 0;
    if (sec.isPlayers) {
        screen.querySelectorAll('.tm-sell-btn').forEach(btn =>
            btn.addEventListener('click', () => sellScoutPlayer(btn.dataset.sell)));
        screen.querySelectorAll('.tm-detail-btn').forEach(btn =>
            btn.addEventListener('click', () => openPlayerDetail(btn.dataset.detail)));
    }
    wireNotifyToggle(screen);
    buildTerminalTabbar(key);
}

document.getElementById('show-team-news-btn').addEventListener('click', () => {
    setTerminalClock();
    renderTerminalSection('email'); // 默认停留在「邮件」
    document.getElementById('team-news-modal').classList.remove('hidden');
    document.body.classList.add('terminal-modal-open'); // 锁定主界面滚动
});
closeOnOverlayClick('team-news-modal'); // 点击界面外（暗色背景）关闭
// 关闭终端时解除主界面滚动锁定
document.getElementById('team-news-modal').addEventListener('click', e => {
    if (e.target.id === 'team-news-modal') document.body.classList.remove('terminal-modal-open');
});
// 顶部「灵动岛」按钮 → 关闭终端
document.getElementById('terminal-island').addEventListener('click', () => {
    document.getElementById('team-news-modal').classList.add('hidden');
    document.body.classList.remove('terminal-modal-open');
});

