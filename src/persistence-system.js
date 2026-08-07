// ===== 存档（三槽位）=====
const SAVE_PREFIX = 'acm_save_v2_slot';

function getSlotSave(slot) {
    try { return JSON.parse(localStorage.getItem(SAVE_PREFIX + slot)); } catch { return null; }
}

// ===== 静态邮件/私信的每局可变态（已读 unread、私信回复选择 repliedIndex）=====
// 历史问题：unread / repliedIndex 被直接写在内容常量 TERMINAL_CONTENT.email/.dm 的对象上，
// 会跨局残留（二周目不重置 → 不弹提示、无法重选回复）、不随存档走（刷新丢失、读档不还原）。
// 修复：新游戏 resetTerminalMsgState 复位；存档 snapshot；读档先复位再套用 snapshot。
// （动态私信 dynamicDMs、论坛 forumPosts 本就在 gameStats 内，已随存档/重置，无需处理。）
function msgStateKey(m, i) { return m.trigger || ('#' + i); } // 有 trigger 用其（全局唯一）；否则用静态数组下标（稳定）
function resetTerminalMsgState() {
    (TERMINAL_CONTENT.email || []).forEach(m => { m.unread = true; });
    (TERMINAL_CONTENT.dm || []).forEach(m => { m.unread = true; delete m.repliedIndex; });
}
function snapshotTerminalMsgState() {
    const email = {}, dm = {};
    (TERMINAL_CONTENT.email || []).forEach((m, i) => { if (m.unread === false) email[msgStateKey(m, i)] = 1; });
    (TERMINAL_CONTENT.dm || []).forEach((m, i) => {
        if (m.unread === false || m.repliedIndex !== undefined)
            dm[msgStateKey(m, i)] = { u: m.unread === false ? 1 : 0, r: m.repliedIndex };
    });
    return { email, dm };
}
function restoreTerminalMsgState(snap) {
    resetTerminalMsgState();
    if (!snap) return;
    (TERMINAL_CONTENT.email || []).forEach((m, i) => { if (snap.email && snap.email[msgStateKey(m, i)]) m.unread = false; });
    (TERMINAL_CONTENT.dm || []).forEach((m, i) => {
        const s = snap.dm && snap.dm[msgStateKey(m, i)];
        if (!s) return;
        if (s.u) m.unread = false;
        if (s.r !== undefined) m.repliedIndex = s.r;
    });
}

// ===== 通用确认弹窗（存档覆盖等）=====
let confirmCallback = null;
function showConfirm(message, onConfirm) {
    document.getElementById('confirm-text').textContent = message;
    confirmCallback = onConfirm;
    document.getElementById('confirm-modal').classList.remove('hidden');
}
document.getElementById('confirm-ok').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.add('hidden');
    const cb = confirmCallback; confirmCallback = null;
    if (cb) cb();
});
document.getElementById('confirm-cancel').addEventListener('click', () => {
    document.getElementById('confirm-modal').classList.add('hidden');
    confirmCallback = null;
});

function buildSaveData() {
    return {
        gameStats: JSON.parse(JSON.stringify(gameStats)),
        matchSchedule, scheduleIndex,
        matchHistory, choiceHistory,
        decisionPoints, pendingTransferSlots,
        leagueTeams: leagueTeams.map(t => ({ name: t.name, category: t.category, points: t.points })),
        terminalMsgState: snapshotTerminalMsgState(), // 静态邮件/私信的已读+私信回复选择（动态私信/论坛已在 gameStats 内）
        timestamp: new Date().toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })
    };
}

function applyLoadedSave(save) {
    gameStats = save.gameStats;
    matchSchedule = save.matchSchedule;
    scheduleIndex = save.scheduleIndex;
    matchHistory = save.matchHistory;
    choiceHistory = save.choiceHistory;
    decisionPoints = save.decisionPoints;
    pendingTransferSlots = save.pendingTransferSlots || 0;
    leagueTeams = save.leagueTeams;
    // 由存档的当前意甲队伍还原意甲池（不含 AC Milan），保证升降级延续
    serieATeams = leagueTeams.filter(t => t.name !== 'AC Milan').map(t => ({ name: t.name, category: t.category }));
    difficultySelection.classList.add('hidden');
    mainInterface.classList.remove('hidden');
    setInMain(true);
    for (const stat of ['trust', 'media', 'fans', 'player'])
        updateProgressBar(`${stat}-bar`, gameStats[stat]);
    updateBudget(0);
    updateScoreboard();
    updateDecisionPoints();
    eventOptions.classList.add('hidden');
    const allDone = gameStats.round >= 38;
    if (allDone) {
        enterSeasonEndState(); // 读档恢复"结束赛季"待点击状态
    } else {
        seasonEndPending = false;
        startMatchBtn.textContent = '开始比赛';
        resetEventBtns('');
        startMatchBtn.disabled = decisionPoints < 2;
    }
    updateMagicPhoneBtn();
    restoreTerminalMsgState(save.terminalMsgState); // 先复位静态邮件/私信可变态，再套用存档快照（未回复的私信读档后仍可回复）
    updateTeamNewsDot(); // 读档后按未读/通知设置刷新主按钮红点
    document.getElementById('archive-modal').classList.add('hidden');
}

function renderArchiveSlots() {
    const container = document.getElementById('archive-slots');
    container.innerHTML = '';
    [1, 2, 3].forEach(slot => {
        const save = getSlotSave(slot);
        const row = document.createElement('div');
        row.className = 'archive-slot';

        const info = document.createElement('div');
        info.className = 'archive-slot-info';
        const labelDiv = document.createElement('div');
        labelDiv.className = 'archive-slot-label';
        labelDiv.textContent = (save && save.name) ? save.name : `存档 ${slot}`;
        info.appendChild(labelDiv);
        if (save) {
            const d1 = document.createElement('div');
            d1.className = 'archive-slot-detail';
            d1.textContent = `第${toChineseNum(save.gameStats.season)}赛季 · 第${save.gameStats.round}轮`;
            const d2 = document.createElement('div');
            d2.className = 'archive-slot-detail';
            d2.style.color = '#7a6753';
            d2.textContent = save.timestamp;
            info.appendChild(d1);
            info.appendChild(d2);
        } else {
            const empty = document.createElement('div');
            empty.className = 'archive-slot-empty';
            empty.textContent = '空存档';
            info.appendChild(empty);
        }

        const btns = document.createElement('div');
        btns.className = 'archive-slot-btns';

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存';
        const doSave = () => {
            const data = buildSaveData();
            const existing = getSlotSave(slot);
            if (existing && existing.name) data.name = existing.name; // 覆盖保存时保留原存档名
            localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
            renderArchiveSlots();
        };
        saveBtn.addEventListener('click', () => {
            // 该槽已有存档 → 先确认再覆盖；空槽直接保存
            if (getSlotSave(slot)) showConfirm('是否确认覆盖当前存档？', doSave);
            else doSave();
        });

        const loadBtn = document.createElement('button');
        loadBtn.textContent = '读取';
        loadBtn.disabled = !save;
        loadBtn.addEventListener('click', () => {
            const s = getSlotSave(slot);
            if (s) applyLoadedSave(s);
        });

        const renameBtn = document.createElement('button');
        renameBtn.textContent = '重命名';
        renameBtn.disabled = !save;
        renameBtn.addEventListener('click', () => {
            const cur = getSlotSave(slot);
            if (!cur) return;
            const input = prompt('输入存档名称：', cur.name || `存档 ${slot}`);
            if (input === null) return;
            const name = input.trim().slice(0, 16);
            if (name) { cur.name = name; } else { delete cur.name; }
            localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(cur));
            renderArchiveSlots();
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = '删除';
        delBtn.className = 'del-btn';
        delBtn.disabled = !save;
        delBtn.addEventListener('click', () => {
            localStorage.removeItem(SAVE_PREFIX + slot);
            renderArchiveSlots();
        });

        const rightGroup = document.createElement('div');
        rightGroup.className = 'archive-slot-btns-right';
        rightGroup.appendChild(saveBtn);
        rightGroup.appendChild(loadBtn);
        rightGroup.appendChild(delBtn);

        btns.appendChild(renameBtn); // 重命名靠左
        btns.appendChild(rightGroup); // 保存/读取/删除靠右

        row.appendChild(info);
        row.appendChild(btns);
        container.appendChild(row);
    });
}

document.getElementById('show-archive-btn').addEventListener('click', () => {
    renderArchiveSlots();
    document.getElementById('archive-modal').classList.remove('hidden');
});

document.getElementById('close-archive-modal').addEventListener('click', () => {
    document.getElementById('archive-modal').classList.add('hidden');
});

// ===== 结局图鉴 =====
function renderGallery() {
    const achieved = getAchievedEndings();
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    Object.entries(endings)
        .filter(([, ending]) => !ending.epilogue) // 尾声卡片不进图鉴
        .sort((a, b) => a[1].id - b[1].id)
        .forEach(([key, ending]) => {
            const unlocked = achieved.includes(key);
            const card = document.createElement('div');
            card.className = 'gallery-card ' + (unlocked ? 'achieved' : 'locked');
            // 隐藏结局未解锁时遮蔽标题
            const titleText = (ending.hidden && !unlocked) ? '？？？' : ending.title;
            card.innerHTML = `
                <span class="gallery-card-no">No.${String(ending.id).padStart(2, '0')}</span>
                <span class="gallery-card-title">${titleText}</span>`;
            if (unlocked) {
                card.addEventListener('click', () => showGalleryDetail(ending));
            }
            grid.appendChild(card);
        });
    document.getElementById('gallery-grid').classList.remove('hidden');
    document.getElementById('gallery-detail').classList.add('hidden');
}

function showGalleryDetail(ending) {
    // 以结局卡片样式预览（而非在图鉴下方显示文字）
    galleryPreview = true;
    galleryPreviewEnding = ending;
    document.getElementById('gallery-modal').classList.add('hidden');
    renderEndingCard(ending, true);
}

document.getElementById('show-gallery-btn').addEventListener('click', () => {
    renderGallery();
    document.getElementById('gallery-modal').classList.remove('hidden');
});

document.getElementById('close-gallery-modal').addEventListener('click', () => {
    document.getElementById('gallery-modal').classList.add('hidden');
});

// ===== 魔力电话（紫色道具）=====
const MAGIC_CG_SRC = 'Picture_Ending/Milan_CloseEyes.jpg'; // 使用回执卡上一闪而过的立绘（与「她来了」结局同一张闭眼帧）

function updateMagicPhoneBtn() {
    const btn = document.getElementById('magic-phone-btn');
    if (gameStats.magicPhoneUnlocked) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
}

// cgSrc：可选，给卡片铺一张一闪而过的立绘水印（样式见 style.css 的 .magic-cg）
function renderMagicCard(title, html, options, cgSrc) {
    randomEventModal.classList.remove('warning', 'mainline', 'news', 'ucl');
    randomEventModal.classList.add('magic');
    const content = randomEventModal.querySelector('.modal-content');
    const stale = content.querySelector('.magic-cg');
    if (stale) stale.remove(); // .modal-content 是所有事件卡共用的，不能留残渣
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
    if (cgSrc) {
        // 插在正文之前当底层；动画跑完（含淡出）自行摘除，不影响后续复用这张 .modal-content 的事件卡
        const cg = document.createElement('div');
        cg.className = 'magic-cg';
        cg.setAttribute('aria-hidden', 'true');
        cg.style.setProperty('--magic-cg', `url("${cgSrc}")`);
        cg.addEventListener('animationend', () => cg.remove());
        content.insertBefore(cg, content.firstChild);
    }
    randomEventModal.classList.remove('hidden');
}

function closeMagicCard() {
    randomEventModal.classList.remove('magic');
    randomEventModal.classList.add('hidden');
}

function useMagicPhone() {
    closeMagicCard();
    if (gameStats.magicPhoneUses >= 3) { showEnding('sheCame'); return; } // 第4次使用 → 结局
    gameStats.magicPhoneUses++;
    // 为当前四项数值中最低的一项 +15
    const stats = ['trust', 'media', 'fans', 'player'];
    let lowest = stats[0];
    for (const s of stats) { if (gameStats[s] < gameStats[lowest]) lowest = s; }
    updateStat(lowest, 15);
    // 使用结果回执：同一张紫色道具卡，告知加到了哪一项（statTitles 在 game-core.js），
    // 并让 Milan_CloseEyes 立绘在卡片上一闪而过
    renderMagicCard('魔力电话', `您已为<b>${statTitles[lowest]}</b>增加了十五个点数。`, [
        { text: '确认', onClick: closeMagicCard }
    ], MAGIC_CG_SRC);
}

document.getElementById('magic-phone-btn').addEventListener('click', () => {
    // 立绘 7.6MB，首次用时现拉会赶不上那 1 秒的闪现 —— 趁玩家读确认卡的这几秒先解码好
    const pre = new Image();
    pre.src = MAGIC_CG_SRC;
    renderMagicCard('魔力电话', '您确定要使用此道具吗？', [
        { text: '确认', onClick: useMagicPhone },
        { text: '返回', onClick: closeMagicCard }
    ]);
});
