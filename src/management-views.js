// ===== 赛程 =====
document.getElementById('show-schedule-btn').addEventListener('click', () => {
    document.getElementById('schedule-modal-title').textContent =
        `第${toChineseNum(gameStats.season)}赛季·赛程`;
    const list = document.getElementById('schedule-list');
    list.innerHTML = '';

    // 欧冠赛程按轮次插入主赛程（与联赛同表显示）
    const uclByRound = {};
    if (gameStats.hasUCL && gameStats.uclFixtures) {
        const u = gameStats.uclFixtures;
        const add = (rnd, stage, name) => { (uclByRound[rnd] = uclByRound[rnd] || []).push({ stage, name }); };
        add(3, '小组赛', u.group[0].name);
        add(7, '小组赛', u.group[1].name);
        add(10, '小组赛', u.group[2].name);
        add(24, '十六强', u.r16.name);
        add(28, '八强', u.qf.name);
        add(32, '四强', u.sf.name);
        add(38, '决赛', u.final.name);
    }

    // 转会窗按轮次标注：夏窗第 2 轮后；冬窗第二赛季第 20 轮后、其余第 18 轮后（第一赛季无转会窗）
    const transferByRound = {};
    if (gameStats.season >= 2) {
        transferByRound[2] = '夏季转会窗';
        transferByRound[gameStats.season === 2 ? 20 : 18] = '冬季转会窗';
    }

    matchSchedule.forEach((opponentName, i) => {
        const roundNum = i + 1;
        const hist = matchHistory.find(h => h.round === roundNum);
        const isPast = hist !== undefined;
        const isCurrent = !isPast && roundNum === gameStats.round + 1;
        const row = document.createElement('div');
        row.className = 'schedule-row ' + (isPast ? 'played' : isCurrent ? 'current' : 'upcoming');

        const roundEl = document.createElement('span');
        roundEl.className = 'sch-round';
        roundEl.textContent = `R${roundNum}`;

        const nameEl = document.createElement('span');
        const crestFile = teamCrests[opponentName];
        if (crestFile) {
            const crest = document.createElement('img');
            crest.className = 'sch-crest';
            crest.src = CREST_DIR + crestFile;
            crest.alt = '';
            crest.onerror = () => { crest.style.visibility = 'hidden'; }; // 加载失败仍保留占位空间
            nameEl.appendChild(crest);
        }
        nameEl.appendChild(document.createTextNode(opponentName));

        const resultEl = document.createElement('span');
        resultEl.className = 'sch-result';
        if (hist) {
            const map = { win: '胜', draw: '平', loss: '负' };
            resultEl.textContent = `${hist.score} ${map[hist.result]}`;
            resultEl.classList.add(hist.result);
        } else {
            resultEl.textContent = isCurrent ? '本轮' : '待赛';
            resultEl.classList.add('upcoming');
        }

        row.appendChild(roundEl);
        row.appendChild(nameEl);
        row.appendChild(resultEl);
        list.appendChild(row);

        // 该轮的欧战赛程（与联赛同表、同列宽，首字对齐）
        (uclByRound[roundNum] || []).forEach(u => {
            // 已出局：出局轮次之后的赛事显示"出局"
            const eliminated = gameStats.uclOutRound > 0 && roundNum > gameStats.uclOutRound;
            const urow = document.createElement('div');
            urow.className = 'schedule-row ucl-row ' + (eliminated || gameStats.round >= roundNum ? 'played' : 'upcoming');
            const ur = document.createElement('span');
            ur.className = 'sch-round';
            ur.textContent = `R${roundNum}`;
            const un = document.createElement('span');
            un.className = 'sch-name';
            const uCrest = crestSrc(u.name);
            if (uCrest) {
                const img = document.createElement('img');
                img.className = 'sch-crest';
                img.src = uCrest;
                img.alt = '';
                img.onerror = () => { img.style.visibility = 'hidden'; }; // 加载失败仍保留占位空间
                un.appendChild(img);
            }
            un.appendChild(document.createTextNode(`${euroLabel()}${u.stage}·${u.name}`));
            const ures = document.createElement('span');
            ures.className = 'sch-result upcoming';
            ures.textContent = eliminated ? '出局' : (gameStats.round >= roundNum ? '已赛' : '待赛');
            urow.appendChild(ur); urow.appendChild(un); urow.appendChild(ures);
            list.appendChild(urow);
        });

        // 该轮的转会窗标注（队徽位置放上下箭头图标）
        if (transferByRound[roundNum]) {
            const trow = document.createElement('div');
            trow.className = 'schedule-row transfer-row ' + (gameStats.round >= roundNum ? 'played' : 'upcoming');
            const tr = document.createElement('span');
            tr.className = 'sch-round';
            tr.textContent = `R${roundNum}`;
            const tn = document.createElement('span');
            tn.className = 'sch-name';
            tn.innerHTML = '<svg class="sch-transfer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>' + transferByRound[roundNum];
            const tres = document.createElement('span');
            tres.className = 'sch-result upcoming';
            tres.textContent = gameStats.round >= roundNum ? '结束' : '待开';
            trow.appendChild(tr); trow.appendChild(tn); trow.appendChild(tres);
            list.appendChild(trow);
        }
    });

    document.getElementById('schedule-modal').classList.remove('hidden');
});

document.getElementById('close-schedule-modal').addEventListener('click', () => {
    document.getElementById('schedule-modal').classList.add('hidden');
});

// ===== 排名（意甲积分榜）=====
document.getElementById('show-standings-btn').addEventListener('click', () => {
    updateLeagueRanking();
    const list = document.getElementById('standings-list');
    list.innerHTML = '';
    const total = leagueTeams.length;
    leagueTeams.forEach((team, i) => {
        const rank = i + 1;
        const zone = rank <= 4 ? 'zone-ucl' : rank <= 6 ? 'zone-uel' : rank > total - 3 ? 'zone-releg' : '';
        const row = document.createElement('div');
        row.className = 'standings-row' + (zone ? ' ' + zone : '') +
            (team.name === 'AC Milan' ? ' is-milan' : '');
        const crestFile = teamCrests[team.name];
        const crestImg = crestFile ? `<img class="st-crest" src="${CREST_DIR}${crestFile}" alt="" onerror="this.style.visibility='hidden'">` : '';
        row.innerHTML = `
            <span class="st-rank">${rank}</span>
            <span class="st-name">${crestImg}${team.name}</span>
            <span class="st-points">${team.points}分</span>`;
        list.appendChild(row);
    });
    document.getElementById('standings-modal').classList.remove('hidden');
});

document.getElementById('close-standings-modal').addEventListener('click', () => {
    document.getElementById('standings-modal').classList.add('hidden');
});

// ===== 历史数值 =====
document.getElementById('show-history-btn').addEventListener('click', () => {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    if (choiceHistory.length === 0) {
        list.innerHTML = '<div class="history-empty">暂无决策记录</div>';
    } else {
        const statLabels = { trust:'董事会信任度', media:'媒体声望', fans:'球迷满意度', player:'球员状态', budget:'预算' };
        [...choiceHistory].reverse().forEach(entry => {
            const parts = entry.note
                ? entry.note
                : Object.entries(entry.effects)
                    .map(([k, v]) => {
                        const cls = v > 0 ? 'history-eff-pos' : 'history-eff-neg';
                        return `<span class="${cls}">${statLabels[k] || k}${v > 0 ? '+' : ''}${v}</span>`;
                    }).join(' ');
            const row = document.createElement('div');
            row.className = 'history-row' + (entry.kind === 'special' ? ' history-row-special' : '');
            row.innerHTML = `
                <div class="history-row-header">
                    <span class="history-event">${entry.eventName}</span>
                    <span class="history-round">${entry.roundLabel || `第${entry.round}轮`}</span>
                </div>
                <div class="history-option">${entry.optionText}</div>
                ${parts ? `<div class="history-effects">${parts}</div>` : ''}`;
            list.appendChild(row);
        });
    }
    document.getElementById('history-modal').classList.remove('hidden');
});

document.getElementById('close-history-modal').addEventListener('click', () => {
    document.getElementById('history-modal').classList.add('hidden');
});

