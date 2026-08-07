// ===== 欧冠 / 欧联 =====
// 对手档次系数：欧冠保持原值；欧联整体下调一档（更易过关）
const uclTierCoeffByType = {
    ucl: { S: 1.0,  A: 0.85, B: 0.72, C: 0.60 },
    uel: { S: 0.85, A: 0.72, B: 0.60, C: 0.50 }
};
function tierCoeff(tier) { return (uclTierCoeffByType[gameStats.euroType] || uclTierCoeffByType.ucl)[tier]; }
const uclTierRank  = { C: 1, B: 2, A: 3, S: 4 };
const uclTierLabel = { S: 'S档', A: 'A档', B: 'B档', C: 'C档' };

// 欧冠 / 欧联各自的球队池（按 euroType 选用）
const uclPools = {
    ucl: [
        { name:'皇家马德里', tier:'S' }, { name:'曼城', tier:'S' }, { name:'拜仁慕尼黑', tier:'S' }, { name:'利物浦', tier:'S' }, { name:'巴黎圣日尔曼', tier:'S' }, { name:'切尔西', tier:'S' },
        { name:'国际米兰', tier:'A' }, { name:'马德里竞技', tier:'A' }, { name:'尤文图斯', tier:'A' }, { name:'巴塞罗那', tier:'A' }, { name:'多特蒙德', tier:'A' }, { name:'热刺', tier:'A' },
        { name:'阿贾克斯', tier:'B' }, { name:'本菲卡', tier:'B' }, { name:'波尔图', tier:'B' }, { name:'亚特兰大', tier:'B' }, { name:'莱比锡红牛', tier:'B' },
        { name:'舍里夫', tier:'C' }, { name:'布鲁日', tier:'C' }, { name:'萨尔茨堡红牛', tier:'C' }, { name:'顿涅茨克矿工', tier:'C' }, { name:'萨格勒布迪纳摩', tier:'C' }
    ],
    uel: [
        { name:'塞维利亚', tier:'S' }, { name:'曼联', tier:'S' }, { name:'阿森纳', tier:'S' }, { name:'巴塞罗那', tier:'S' }, { name:'国际米兰', tier:'S' }, { name:'尤文图斯', tier:'S' },
        { name:'罗马', tier:'A' }, { name:'法兰克福', tier:'A' }, { name:'勒沃库森', tier:'A' }, { name:'亚特兰大', tier:'A' }, { name:'皇家社会', tier:'A' }, { name:'阿贾克斯', tier:'A' }, { name:'波尔图', tier:'A' }, { name:'本菲卡', tier:'A' },
        { name:'西汉姆联', tier:'B' }, { name:'摩纳哥', tier:'B' }, { name:'费耶诺德', tier:'B' },
        { name:'卡拉巴赫', tier:'C' }, { name:'费伦茨瓦罗斯', tier:'C' }, { name:'舍里夫', tier:'C' }
    ]
};
function currentUclPool() { return uclPools[gameStats.euroType] || uclPools.ucl; }

// 球队英文简写（用于"最后一战"对阵展示；全称即球队名本身）
const uclTeamAbbr = {
    '皇家马德里':'RMA', '曼城':'MCI', '拜仁慕尼黑':'BAY', '利物浦':'LIV', '巴黎圣日尔曼':'PSG', '切尔西':'CHE',
    '国际米兰':'INT', '马德里竞技':'ATM', '尤文图斯':'JUV', '巴塞罗那':'BAR', '多特蒙德':'DOR', '热刺':'TOT',
    '阿贾克斯':'AJA', '本菲卡':'BEN', '波尔图':'POR', '亚特兰大':'ATA', '莱比锡红牛':'RBL',
    '舍里夫':'SHE', '布鲁日':'CLB', '萨尔茨堡红牛':'RBS', '顿涅茨克矿工':'SHK', '萨格勒布迪纳摩':'DZG',
    '塞维利亚':'SEV', '曼联':'MUN', '阿森纳':'ARS', '罗马':'ROM', '法兰克福':'SGE', '勒沃库森':'LEV', '皇家社会':'RSO',
    '西汉姆联':'WHU', '摩纳哥':'ASM', '费耶诺德':'FEY',
    '卡拉巴赫':'QAR', '费伦茨瓦罗斯':'FTC'
};

// ---- 米兰欧冠有效实力 / 胜率（按设定公式）----
// 基础系数：0.80 起，每签下一名转会池核心球员（01-09，即 tier 1）+0.01，上限 0.85
function uclBaseCoeff() {
    const core = transferBuyPlayers.filter(p => p.tier === 1).map(p => p.id);
    const n = gameStats.signedPlayers.filter(id => core.includes(id)).length;
    return Math.min(0.85, 0.80 + 0.01 * n);
}
// 球员状态修正：(player−50)/200，约 ±0.25
function uclPlayerMod() { return Math.max(-0.25, Math.min(0.25, (gameStats.player - 50) / 200)); }
// 大场面修正：签下 03（法国中锋）、06（上帝的指挥）各 +0.05，都没买 −0.05
function uclBigMatchMod() {
    let c = 0;
    if (gameStats.signedPlayers.includes('striker_fr')) c++;
    if (gameStats.signedPlayers.includes('maestro')) c++;
    return c === 0 ? -0.05 : c === 1 ? 0.05 : 0.10;
}
// 难度修正：中等 +0.05，困难 −0.05
function uclDiffMod() { return gameStats.difficulty === 'hard' ? -0.05 : 0.05; }
// 有效实力 = 基础系数 ×（1 + 球员状态 + 大场面 + 赛前决策 + 难度）
function uclEffectiveStrength(decisionMod) {
    return uclBaseCoeff() * (1 + uclPlayerMod() + uclBigMatchMod() + (decisionMod || 0) + uclDiffMod());
}
// 胜率 = 有效实力 ÷（有效实力 + 对手系数）×（1 − 平局率）；平局率：小组赛0.20，淘汰赛~0.08
function uclWinRate(oppTier, stage, decisionMod) {
    const eff = uclEffectiveStrength(decisionMod);
    const opp = tierCoeff(oppTier);
    const draw = stage === 'group' ? 0.20 : 0.08;
    let win = eff / (eff + opp) * (1 - draw);
    win = Math.min(1 - draw, win + uclGrowthWinBonus()); // 欧冠标签球员成长值之和加成（最多 +10% 胜率）
    return { win, draw, loss: Math.max(0, 1 - win - draw) };
}

// 洗牌
function uclShuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    return arr;
}
// 抽取本赛季欧战对手（按 euroType 选池）：小组赛3队（仅 B/C 档）+ 淘汰赛4队（全档，弱到强，决赛最强）
function drawUclFixtures() {
    const pool = currentUclPool();
    const bc = uclShuffle(pool.filter(t => t.tier === 'B' || t.tier === 'C'));
    const group = bc.slice(0, 3);
    const rest = uclShuffle(pool.filter(t => !group.includes(t)));
    const ko = rest.slice(0, 4).sort((a, b) => uclTierRank[a.tier] - uclTierRank[b.tier]);
    return { group, r16: ko[0], qf: ko[1], sf: ko[2], final: ko[3] };
}

// ---- 欧冠卡片（蓝色样式，复用随机事件弹窗）----
function renderUclCard(title, html, options) {
    randomEventModal.classList.remove('warning', 'mainline', 'news', 'magic');
    randomEventModal.classList.add('ucl');
    randomEventModal.classList.toggle('uel', gameStats.euroType === 'uel'); // 眉标按赛事区分
    document.getElementById('random-event-title').textContent = title;
    document.getElementById('random-event-description').innerHTML = html;
    const oc = document.getElementById('random-event-options');
    oc.innerHTML = '';
    options.forEach(o => {
        const b = document.createElement('button');
        b.className = 'random-event-option' + (options.length === 1 ? ' random-event-option--single' : '');
        b.textContent = o.text;
        b.addEventListener('click', o.onClick);
        oc.appendChild(b);
    });
    randomEventModal.classList.remove('hidden');
}

function uclCloseToGame() {
    randomEventModal.classList.remove('ucl');
    randomEventModal.classList.add('hidden');
    // R38 最后一战踢完 → 接赛季收尾（而非回到主界面）
    if (afterUclFinalSeasonEnd) {
        afterUclFinalSeasonEnd = false;
        proceedSeasonEndR38();
        return;
    }
    resetAfterMatch();
}

// 欧冠各阶段奖惩（数值 + 奖金 budget）。半决赛胜含"进决赛"奖金 1500+2000=3500
const uclRewards = {
    r16:   { win: { fans: 4, media: 3, budget: 600 },                         out: { fans: -3, media: -2 } },
    qf:    { win: { fans: 5, media: 4, budget: 900 },                         out: { fans: -4, media: -3 } },
    sf:    { win: { fans: 7, media: 5, trust: 3, budget: 3500 },              out: { fans: -6, media: -4, player: -3 } },
    final: { win: { fans: 10, media: 8, trust: 8, player: 5, budget: 3000 },  out: { fans: 3, media: 5 } }
};
function applyUclRewards(reward) {
    for (const [k, v] of Object.entries(reward)) updateStat(k, v);
}

// 欧战赛事名称（欧冠 / 欧联）
function euroLabel() { return gameStats.euroType === 'uel' ? '欧联' : '欧冠'; }
function euroTrophy() { return gameStats.euroType === 'uel' ? '欧联奖杯' : '大耳朵杯'; }

// 小组赛出线（球员状态决定概率：≥60→0.9，40~60→0.6，<40→0.4）
function resolveUclGroup() {
    const p = gameStats.player;
    let prob = p >= 60 ? 0.9 : p >= 40 ? 0.6 : 0.4;
    if (gameStats.lastSeasonRanking === 1) prob = 1.0; // 上赛季联赛夺冠 → 小组必出线
    gameStats.uclQualified = Math.random() < prob;
    if (gameStats.uclQualified) {
        gameStats.uclGroupPos = (p >= 60 && Math.random() < 0.6) ? 1 : 2;
        gameStats.uclStage = 'r16';
        updateStat('budget', 500); // 小组出线奖金
    } else {
        gameStats.uclGroupPos = (p < 40 && Math.random() < 0.5) ? 4 : 3; // 未出线：3 或 4
        gameStats.uclStage = 'out';
        gameStats.uclOutRound = 10; // 小组未出线
    }
}

const uclStageMap = {
    r16:   { round: 24, key: 'r16',   label: '十六强', next: 'qf',       nextLabel: '八强' },
    qf:    { round: 28, key: 'qf',    label: '八强',   next: 'sf',       nextLabel: '四强' },
    sf:    { round: 32, key: 'sf',    label: '四强',   next: 'final',    nextLabel: '决赛' },
    final: { round: 38, key: 'final', label: '决赛',   next: 'champion', nextLabel: '' }
};

// 欧冠淘汰赛比分（无平局：胜者进球多）
function uclScore(weWin) {
    const win = 1 + Math.floor(Math.random() * 5);   // 1–5
    const lose = Math.floor(Math.random() * win);     // 0..win-1（双方均 0-5）
    return weWin ? `${win}:${lose}` : `${lose}:${win}`;
}

// 十六强/八强/四强决策后判定晋级/出局
function playUclKnockout(decision) {
    const info = uclStageMap[gameStats.uclStage];
    const opp = gameStats.uclFixtures[info.key];
    const decMod = decision === 'push' ? 0.1 : -0.1;
    if (decision === 'push') updateStat('player', -10); // 淘汰赛全力争胜统一 -10
    const wr = uclWinRate(opp.tier, 'ko', decMod);
    const advanced = Math.random() < (wr.win + 0.5 * wr.draw); // 平局点球各半
    applyUclRewards(uclRewards[info.key][advanced ? 'win' : 'out']);
    const score = uclScore(advanced);
    addUclForumThread(opp.name, advanced, score, advanced); // 论坛欧冠赛果帖（胜→晋级下一轮，故 hasNext=胜）
    if (advanced && opp.name === '国际米兰' && gameStats.euroType === 'ucl') deliverEmail('uclBeatInter'); // 消息48 · 欧冠淘汰赛淘汰国米
    if (opp.name === '皇家马德里' && gameStats.euroType === 'ucl' && (gameStats.season === 4 || gameStats.season === 5))
        deliverEmail(advanced ? 'uclBeatMadrid' : 'uclLoseMadrid'); // 消息78/80 · 第4/5赛季欧冠淘汰赛 胜/负 皇马
    if (advanced) {
        gameStats.uclStage = info.next;
        if (info.next === 'final') { gameStats.uclReachedFinal = true; gameStats.uclFinalCount = (gameStats.uclFinalCount || 0) + 1; }
        const bonus = uclRewards[info.key].win.budget;
        renderUclCard(`晋级${info.nextLabel}！`,
            `你们以 <b>${score}</b> 击败${opp.name}，<span class="ucl-hl">晋级${info.nextLabel}！</span><br>球队获得奖金${bonus}w欧元！`,
            [{ text: '确认', onClick: uclCloseToGame }]);
    } else {
        gameStats.uclStage = 'out';
        gameStats.uclOutRound = info.round;
        renderUclCard(`止步${info.label}`, `对战${opp.name}的比赛结束，很遗憾，你们以 <b>${score}</b> 憾负${opp.name}。`,
            [{ text: '确认', onClick: uclCloseToGame }]);
    }
}

// 决赛（最后一战）：选择后判定夺冠/亚军。option.mod(opp) 为小幅强度修正，option.cost 为预算消耗
function playUclFinal(option) {
    const opp = gameStats.uclFixtures.final;
    if (option.cost) updateBudget(-option.cost);
    const wr = uclWinRate(opp.tier, 'ko', option.mod ? option.mod(opp) : 0);
    const won = Math.random() < (wr.win + 0.5 * wr.draw);
    applyUclRewards(uclRewards.final[won ? 'win' : 'out']);
    const score = uclScore(won);
    addUclForumThread(opp.name, won, score, false, true); // 决赛：单独池 uclFinalWin/Lose（待补文案，未提供前不发帖）
    if (won && opp.name === '国际米兰' && gameStats.euroType === 'ucl') deliverEmail('uclBeatInter'); // 消息48 · 欧冠决赛淘汰国米
    if (won && opp.name === '利物浦' && gameStats.euroType === 'ucl') deliverEmail('uclFinalBeatLiverpool'); // 消息77 · 欧冠决赛击败利物浦
    if (opp.name === '皇家马德里' && gameStats.euroType === 'ucl' && (gameStats.season === 4 || gameStats.season === 5))
        deliverEmail(won ? 'uclBeatMadrid' : 'uclLoseMadrid'); // 消息78/80 · 决赛 胜/负 皇马（第4/5赛季）
    if (won && opp.name === '皇家马德里' && gameStats.euroType === 'ucl') deliverEmail('uclFinalBeatMadrid'); // 消息88 · 决赛击败皇马夺冠（皇马俱乐部致意，任意赛季）
    if (won && opp.name === '尤文图斯' && gameStats.euroType === 'ucl') deliverEmail('uclFinalBeatJuve'); // 消息90 · 决赛击败尤文夺冠（尤文俱乐部致意）
    if (won) {
        gameStats.uclStage = 'champion';
        const bonus = uclRewards.final.win.budget;
        renderUclCard(`${euroLabel()}夺冠！`,
            `决赛 <b>${score}</b> 击败${opp.name}，<span class="ucl-hl">捧起了${euroTrophy()}！</span><br>球队获得奖金${bonus}w欧元！`,
            [{ text: '确认', onClick: uclCloseToGame }]);
    } else {
        gameStats.uclStage = 'out';
        gameStats.uclOutRound = 36;
        renderUclCard('屈居亚军', `决赛 <b>${score}</b> 惜败${opp.name}，遗憾摘得亚军。`,
            [{ text: '确认', onClick: uclCloseToGame }]);
    }
}

// 决赛场地（按赛季，致敬历届欧冠决赛举办地；country 用于主场优势判定，显示用 城市·球场）
const uclFinalVenues = {
    1: { country: '西班牙', city: '马德里', stadium: '西维塔斯大都会球场' },
    2: { country: '葡萄牙', city: '里斯本', stadium: '卢斯球场' },
    3: { country: '葡萄牙', city: '波尔图', stadium: '巨龙球场' },
    4: { country: '法国', city: '巴黎', stadium: '法兰西体育场' },
    5: { country: '土耳其', city: '伊斯坦布尔', stadium: '奥林匹克体育场' }
};
// 决赛举办地所在国的球队：对手为其中之一时，视为拥有主场优势
const uclVenueHomeTeams = {
    '西班牙': ['皇家马德里', '马德里竞技', '巴塞罗那', '塞维利亚', '皇家社会'],
    '葡萄牙': ['本菲卡', '波尔图', '布拉加'],
    '法国': ['巴黎圣日尔曼', '摩纳哥'],
    '土耳其': []
};
function oppHasHomeAdvantage(opp, venue) {
    return (uclVenueHomeTeams[venue.country] || []).includes(opp.name);
}

// 队内带"欧冠"标签（tier1 核心）的已签球员数
function squadUclTagCount() {
    return gameStats.signedPlayers.filter(id => {
        const p = transferBuyPlayers.find(b => b.id === id);
        return p && p.uclTag;
    }).length;
}

// "最后一战"备选策略：每次决赛从"可用"项中随机抽 3 个；mod(opp) 返回赛前强度修正，cost 为预算消耗
const uclFinalOptions = [
    { text: '提前联系媒体造势，展示夺冠决心。', avail: () => gameStats.media > 80,
      mod: opp => (['皇家马德里', '拜仁慕尼黑'].includes(opp.name) ? -0.01 : 0.01) },
    { text: "面对采访时把'夺冠热门'的名头推给对手。", avail: () => gameStats.media > 80,
      mod: opp => (['皇家马德里', '拜仁慕尼黑', '曼城'].includes(opp.name) ? -0.01 : 0.01) },
    { text: '给球队许诺夺冠奖金。', avail: () => gameStats.budget > 1000, cost: 1000, note: '（球队预算-1000万）',
      mod: () => 0.01 },
    { text: '建议教练大胆用某个状态正佳的球员。', avail: () => squadUclTagCount() > 5,
      mod: () => 0.02 },
    { text: '给球队里的年轻人打气，缓解大赛怯场。',
      avail: () => ['lb_winger', 'winger_pt', 'cb_eng', 'cm_youth_it', 'cb_fr_young', 'belgian_star'].some(id => gameStats.signedPlayers.includes(id)),
      mod: () => 0.01 },
    { text: '和紧张的球队核心谈话。',
      avail: () => ['winger_pt', 'cm_youth_it', 'lb_winger'].some(id => gameStats.signedPlayers.includes(id)),
      mod: () => 0.01 },
    { text: '告诉队员们，米兰的球迷们期待着你们能赢下奖杯。', avail: () => gameStats.fans > 80,
      mod: () => 0.01 }
];
// 可用项不足 3 个时用中性项补足，保证始终有 3 个选择
const uclFinalFallbacks = [
    { text: '鼓励球员，相信他们之间的团队协作。', mod: () => 0 },
    { text: '叮嘱球队稳住心态，按既定战术执行。', mod: () => 0 },
    { text: '让球员放平心态，全力享受这场决赛。', mod: () => 0 }
];

function pickUclFinalChoices() {
    const chosen = uclShuffle(uclFinalOptions.filter(o => o.avail())).slice(0, 3);
    for (let i = 0; chosen.length < 3 && i < uclFinalFallbacks.length; i++) chosen.push(uclFinalFallbacks[i]);
    return chosen;
}

// "最后一战"：欧冠蓝色对阵页（全称+简写、决赛场地、随机抽取的三条策略）
function showUclFinalCard() {
    const opp = gameStats.uclFixtures.final;
    const info = { full: opp.name, abbr: uclTeamAbbr[opp.name] || '' };
    const venue = uclFinalVenues[gameStats.season] || uclFinalVenues[1];
    const homeAdv = oppHasHomeAdvantage(opp, venue);
    // 首次进决赛：皮奥利「从未执教过决赛球队」；第二次起（uclFinalCount>1）：改为「缺乏经验」版
    const pioli = gameStats.uclFinalCount > 1
        ? `而你们的主教练皮奥利，更是对执教${euroLabel()}决赛缺乏经验。`
        : `你们的主教练皮奥利，更是在此之前从未执教过进入${euroLabel()}决赛的球队。`;
    const narr1 = homeAdv
        ? `下一轮，你们将要踏入${euroLabel()}决赛的赛场，对方球队具有主场优势，而米兰队里有一半球员对${euroLabel()}赛场还不太熟悉，${pioli}`
        : `下一轮，你们将要踏入${euroLabel()}决赛的赛场，队里有一半球员对${euroLabel()}赛场还不太熟悉，${pioli}`;
    // 对阵两侧改用队徽；缺图时降级为缩写，保证版式不塌
    const badge = (name, abbr) => {
        const src = crestSrc(name);
        return src ? `<img class="ucl-final-crest" src="${src}" alt="">`
                   : `<div class="ucl-final-abbr">${abbr}</div>`;
    };
    const html = `
        <div class="ucl-final-board">
            <div class="ucl-final-team">
                ${badge('AC Milan', 'ACM')}
                <div class="ucl-final-name">AC米兰</div>
            </div>
            <div class="ucl-final-vs">VS</div>
            <div class="ucl-final-team">
                ${badge(opp.name, info.abbr)}
                <div class="ucl-final-name">${info.full}</div>
            </div>
        </div>
        <div class="ucl-final-venue">${venue.city}·${venue.stadium}</div>
        <div class="ucl-final-narr">${narr1}</div>
        <div class="ucl-final-narr">他们听从你的建议，你的一切对于${euroLabel()}赛场的建议，你选择：</div>`;
    renderUclCard('最后一战', html, pickUclFinalChoices().map(o => ({
        text: o.note ? `${o.text}${o.note}` : o.text,
        onClick: () => playUclFinal(o)
    })));
}

// 赛后检查是否到欧战节点（小组赛果 / 淘汰赛决策 / 决赛最后一战）；显示则返回 true
function maybeShowUclCard() {
    if (!gameStats.hasUCL || !gameStats.uclFixtures) return false;
    // 第10轮：小组赛果
    if (gameStats.uclStage === 'group' && gameStats.round >= 10) {
        resolveUclGroup();
        const c = `${euroLabel()}小组赛结束，你们以小组第${gameStats.uclGroupPos}${gameStats.uclQualified ? '出线' : '出局'}。` +
            (gameStats.uclQualified ? '<br>球队获得奖金500w欧元！' : '');
        renderUclCard('小组赛赛果', c, [{ text: '确认', onClick: uclCloseToGame }]);
        return true;
    }
    // 决赛前：最后一战（专属对阵页）。决赛改到联赛结束（R38）后由赛季收尾流程单独触发，此处不再于赛中弹出
    if (gameStats.uclStage === 'final' && gameStats.round >= 38) {
        showUclFinalCard();
        return true;
    }
    // 十六强/八强/四强：欧战决策
    const info = uclStageMap[gameStats.uclStage];
    if (info && gameStats.round >= info.round) {
        const opp = gameStats.uclFixtures[info.key];
        const pushCost = 10; // 淘汰赛全力争胜统一 -10
        renderUclCard(`${euroLabel()}决策`, `${euroLabel()}${info.label}在即，你们将迎战 <b>${opp.name}</b>，你决定：`, [
            { text: `全力争胜。（球员状态-${pushCost}）`, onClick: () => playUclKnockout('push') },
            { text: '保力联赛。', onClick: () => playUclKnockout('rest') }
        ]);
        return true;
    }
    return false;
}

