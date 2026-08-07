// 随机选择随机事件
let ffSkipRandom = false; // 测试快进开关：true 时 selectRandomEvents 跳过随机事件池，仅消费强制/定时事件与邮件
function selectRandomEvents() {
    const selectedEvents = [];
    // 随机事件保底计数：本轮先记为"未触发"，真正抽中数字随机事件后归零（见函数末尾）
    gameStats.randomPity = (gameStats.randomPity || 0) + 1;

    // 邮件03（CFCB「关于本俱乐部的决定」）在 FFP的绞索Ⅰ 前一回合送达
    // （绞索Ⅰ 必在第一赛季其最早轮次触发，故提前一个"开始比赛"= minRound-2 轮送达）
    if (gameStats.season === 1) {
        const ffp1Round = (mainlineRoundConstraints[1] && mainlineRoundConstraints[1].ffp1) || 6;
        if (gameStats.round === ffp1Round - 2) deliverEmail('cfcbDecision');
    }
    // 私信31（内斯塔·久别问候）：第一赛季第 10 轮送达
    if (gameStats.season === 1 && gameStats.round >= 10 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.nestaHello)) deliverEmail('nestaHello');
    // 私信79（安切洛蒂·第一赛季问候）：第一赛季尽早送达（第一轮）
    if (gameStats.season === 1 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.ancelottiHello)) deliverEmail('ancelottiHello');

    // 邮件15（朗尼克泄密）+16（马萨拉警告）：邮件14（架构思考）送达两回合后一同送达，16 在 15 之后（标号大者更靠上）
    if (gameStats.season === 2 && gameStats.architectureRound &&
        gameStats.round >= gameStats.architectureRound + 2 &&
        !(gameStats.deliveredEmails && gameStats.deliveredEmails.rangnickLeak)) {
        deliverEmail('rangnickLeak');
        deliverEmail('massaraWarning');
    }
    // 邮件13（博班·新教练皮奥利）：第二赛季第 8 轮送达
    if (gameStats.season === 2 && gameStats.round >= 8 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.pioliHire)) deliverEmail('pioliHire');
    // 邮件17（主席·关于博班去留）：第二赛季第 32 轮送达
    if (gameStats.season === 2 && gameStats.round >= 32) deliverEmail('chairmanBoban');
    // 邮件18（马萨拉·博班已被辞退）：第二赛季第 34 轮送达
    if (gameStats.season === 2 && gameStats.round >= 34 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.bobanFired)) deliverEmail('bobanFired');
    // 邮件20（CEO·有关欧超）：第三赛季第 8 轮送达（先于「欧洲超级联赛Ⅰ」R10）
    if (gameStats.season === 3 && gameStats.round >= 8 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.eslInvite)) deliverEmail('eslInvite');
    // 邮件21/22（主席祝贺）、私信22（特奥染发）已移至 startNewSeason，于赛季一开始(round 0)送达
    // 邮件23（拉伊奥拉·多纳鲁马续约合同）：第四赛季第 2 轮送达
    if (gameStats.season === 4 && gameStats.round >= 2 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.donnaContract)) deliverEmail('donnaContract');
    // 邮件24（马萨拉·第一轮谈判失败）：第四赛季第 4 轮送达
    if (gameStats.season === 4 && gameStats.round >= 4 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.donnaNego1)) deliverEmail('donnaNego1');
    // 邮件25（马萨拉·麦尼昂）：多纳鲁马离队（谈判 tug/break，或未进入谈判=直接破裂）后 4 轮送达
    if (gameStats.season === 4 && gameStats.donnaLeftFreeRound > 0 && gameStats.round >= gameStats.donnaLeftFreeRound + 4
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.maignanSign)) deliverEmail('maignanSign');
    // 邮件26（马萨拉·恰尔汗奥卢转投国米）已改为「谈判破裂/未谈判直接离队时立刻送达」（见 showNegFeedback 与未谈判分支）
    // 邮件27（马萨拉·多家俱乐部报价莱奥）：第四赛季第 24 轮送达
    if (gameStats.season === 4 && gameStats.round >= 24 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.leaoOffer)) deliverEmail('leaoOffer');
    // 邮件28/29(戈登·辛格·出售米兰)、邮件30(加齐迪斯告别)、邮件31(卡尔迪纳莱) 已移至 startNewSeason，于第五赛季一开始(round 0)送达
    // 邮件32（马萨拉·有关德凯特拉雷）：第五赛季第 12 轮、且未签下 09 德凯特拉雷(belgian_star)时送达
    if (gameStats.season === 5 && gameStats.round >= 12 && !gameStats.signedPlayers.includes('belgian_star')
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.deketSuggest)) deliverEmail('deketSuggest');
    // 私信72（托纳利·英超球队打听报价）：第五赛季第 12 轮、且托纳利(07/cm_youth_it)仍在队时送达
    if (gameStats.season === 5 && gameStats.round >= 12 && gameStats.signedPlayers.includes('cm_youth_it') && !gameStats.player07Removed
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.tonaliOffer)) deliverEmail('tonaliOffer');
    // 邮件33（格里·卡尔迪纳莱·预算之争）：第五赛季第 26 轮送达
    if (gameStats.season === 5 && gameStats.round >= 26 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.budgetDispute)) deliverEmail('budgetDispute');
    // 私信71（马萨拉·35页计划书）：与邮件33同轮（第五赛季第 26 轮）送达
    if (gameStats.season === 5 && gameStats.round >= 26 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.massaraPlan)) deliverEmail('massaraPlan');
    // 邮件34（格里·卡尔迪纳莱·欧冠的表现）：第五赛季欧冠出局（决赛前出局，含小组未出线/淘汰赛止步；屈居亚军 uclOutRound=36 不触发）后送达
    if (gameStats.season === 5 && gameStats.euroType === 'ucl' && gameStats.uclOutRound > 0 && gameStats.uclOutRound < 36
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.uclEliminated)) deliverEmail('uclEliminated');
    // 私信73（德凯特拉雷·进球荒自我怀疑）：签下09德凯特拉雷(belgian_star)后满 10 轮送达（跨赛季按 38 轮/季折算；仅一次）
    if (gameStats.deliveredEmails && gameStats.deliveredEmails.signDeket && !gameStats.deliveredEmails.deketSlump
        && gameStats.signedPlayers.includes('belgian_star')
        && (gameStats.season - gameStats.deliveredEmails.signDeket.s) * 38 + (gameStats.round - gameStats.deliveredEmails.signDeket.r) >= 10) {
        deliverEmail('deketSlump');
    }
    // 私信74（卡拉布里亚·接过队长袖标）：第五赛季第 22 轮送达（仅一次）
    if (gameStats.season === 5 && gameStats.round >= 22 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.calabriaCaptain)) deliverEmail('calabriaCaptain');
    // 私信34（因扎吉·卡拉布里亚当队长了？）：与私信74一同（第五赛季第 22 轮）送达（仅一次）
    if (gameStats.season === 5 && gameStats.round >= 22 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.inzaghiCaptain)) deliverEmail('inzaghiCaptain');
    // 私信75（伊布·退役告别晚餐）：第五赛季 God Bye(第36轮) 前送达——第 34 轮起、06 伊布在队、退役事件(godByeDone)尚未触发（仅一次）
    if (gameStats.season === 5 && gameStats.round >= 34 && gameStats.signedPlayers.includes('maestro') && !gameStats.godByeDone
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.ibraFarewellDm)) deliverEmail('ibraFarewellDm');
    // 私信76（莱奥·续约试探·打听特奥合同）：签下02莱奥(winger_pt) 且第五赛季第 30 轮送达（仅一次）
    if (gameStats.season === 5 && gameStats.round >= 30 && gameStats.signedPlayers.includes('winger_pt')
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.leaoRenewDm)) deliverEmail('leaoRenewDm');
    // 私信23（吉鲁·客串门将）：签下03（吉鲁）后概率送达（每轮15%，仅一次）
    if (gameStats.signedPlayers.includes('striker_fr') && !(gameStats.deliveredEmails && gameStats.deliveredEmails.giroudGk)
        && Math.random() < 0.15) deliverEmail('giroudGk');
    // 私信30（里昂总监·卡卢卢踢出来了）：签下卡卢卢(cb_fr_young)满一个赛季后随机送达（每轮15%，仅一次）
    // 入队赛季取签约私信 signKalulu 的送达赛季快照（deliveredEmails.signKalulu.s），当前赛季更大即「在队满一个赛季」
    if (gameStats.signedPlayers.includes('cb_fr_young') && gameStats.deliveredEmails && gameStats.deliveredEmails.signKalulu
        && gameStats.season > gameStats.deliveredEmails.signKalulu.s
        && !gameStats.deliveredEmails.kaluluLyon && Math.random() < 0.15) deliverEmail('kaluluLyon');
    // 私信24（AC米兰·买那个法国前锋）：解锁「魔力电话」后随机送达（每轮20%，仅一次）
    if (gameStats.magicPhoneUnlocked && !(gameStats.deliveredEmails && gameStats.deliveredEmails.magicPhoneDm)
        && Math.random() < 0.2) deliverEmail('magicPhoneDm');
    // 私信25（科斯塔库塔·管理层指导意见）：第五赛季「无所不知」事件后送达
    if (gameStats.season === 5 && (gameStats.omniscient1Done || gameStats.omniscient2Done)
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.costacurtaDm)) deliverEmail('costacurtaDm');
    // 私信26（伊布·推荐的房子）：「必要的支持」任务激活后送达（需06在队）
    if (gameStats.supportTaskActive && gameStats.signedPlayers.includes('maestro')
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.ibraHouseDm)) deliverEmail('ibraHouseDm');
    // 私信27（伊布·给中卫加练）：第四赛季夏窗（R2 开窗）后第3轮起送达，需06在队
    if (gameStats.season === 4 && gameStats.round >= 3 && gameStats.signedPlayers.includes('maestro')
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.ibraCbDm)) deliverEmail('ibraCbDm');
    // 私信65（舍甫琴科·来看德比还是训练）：第四赛季·首次德比在下一个「开始比赛」内（接下来两轮）时送达，即「德比前两轮」
    if (gameStats.season === 4 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.shevaDerby)
        && (matchSchedule[scheduleIndex] === '国际米兰' || matchSchedule[scheduleIndex + 1] === '国际米兰')) deliverEmail('shevaDerby');
    // 私信69（加图索·纸飞机后）/70（加图索·我们的责任后）：赌王检查点结算后 2 轮送达（结算轮取对应静默标记的送达轮）
    if (gameStats.deliveredEmails && gameStats.deliveredEmails.betKingGamblerMark
        && gameStats.round >= gameStats.deliveredEmails.betKingGamblerMark.r + 2
        && !gameStats.deliveredEmails.gattusoGambler) deliverEmail('gattusoGambler');
    if (gameStats.deliveredEmails && gameStats.deliveredEmails.betKingRespMark
        && gameStats.round >= gameStats.deliveredEmails.betKingRespMark.r + 2
        && !gameStats.deliveredEmails.gattusoResp) deliverEmail('gattusoResp');
    // 私信29（AC米兰·再见面的那天）：第五赛季第38轮送达。真机由 enterSeasonEndState 送达（R38 收尾不走 selectRandomEvents）；
    // 此处为幂等兜底（正常流程 selectRandomEvents 在 R38 不会被调用，不会重复送达）。
    if (gameStats.season === 5 && gameStats.round >= 38 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.milanFarewell)) deliverEmail('milanFarewell');
    // 私信50（科斯塔库塔·升任技术总监）已移至 startNewSeason，于第二赛季一开始(round 0)送达
    // 私信53（马萨拉·反对签老将）：第二赛季第16轮送达，且需「新教练」已选选项2（承诺冬窗按教练想法选人 → 已送达 pioliCoach2/消息52）
    if (gameStats.season === 2 && gameStats.round >= 16 && gameStats.deliveredEmails && gameStats.deliveredEmails.pioliCoach2
        && !gameStats.deliveredEmails.massaraVeterans) deliverEmail('massaraVeterans');
    // 私信54（安布罗西尼·点评0:5惨败）：第二赛季「圣诞夜惊魂」触发后送达
    if (gameStats.season === 2 && gameStats.xmasDone && !(gameStats.deliveredEmails && gameStats.deliveredEmails.xmasAmbrosini)) deliverEmail('xmasAmbrosini');
    // 私信39（罗马诺·换教练风声）：第二赛季「圣诞夜惊魂」触发后送达
    if (gameStats.season === 2 && gameStats.xmasDone && !(gameStats.deliveredEmails && gameStats.deliveredEmails.xmasRomano)) deliverEmail('xmasRomano');
    // 私信57（博班·内鬼风波）：第二赛季邮件15（rangnickLeak）送达两轮后送达
    if (gameStats.season === 2 && gameStats.deliveredEmails && gameStats.deliveredEmails.rangnickLeak
        && gameStats.round >= gameStats.deliveredEmails.rangnickLeak.r + 2 && !gameStats.deliveredEmails.bobanRangnick) deliverEmail('bobanRangnick');
    // 私信58（博班·告别）：第二赛季邮件18（bobanFired）送达后送达
    if (gameStats.season === 2 && gameStats.deliveredEmails && gameStats.deliveredEmails.bobanFired
        && !gameStats.deliveredEmails.bobanGoodbye) deliverEmail('bobanGoodbye');
    // 私信55（加图索·那孩子愿意来）：第三赛季「童年的马克杯Ⅰ」(mug1Done)触发后送达
    if (gameStats.season === 3 && gameStats.mug1Done && !(gameStats.deliveredEmails && gameStats.deliveredEmails.mug1Gattuso)) deliverEmail('mug1Gattuso');
    // 私信59（特奥·想做的事太多）：「下一个左后卫Ⅰ」(emoOutburst)触发后送达
    if (gameStats.emoOutburstDone && !(gameStats.deliveredEmails && gameStats.deliveredEmails.theoManyThings)) deliverEmail('theoManyThings');
    // 私信61（丹尼尔·一线队教练来电）：第三赛季「同一个姓氏」前两轮（第30轮起、事件前）送达
    if (gameStats.season === 3 && gameStats.round >= 30 && !gameStats.sameNameDone
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.danielPreCall)) deliverEmail('danielPreCall');
    // 私信62（多纳鲁马·离队告别）：第四赛季多纳鲁马离队（donnaLeftFreeRound>0）后送达
    if (gameStats.season === 4 && gameStats.donnaLeftFreeRound > 0
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.donnaFarewell)) deliverEmail('donnaFarewell');
    // 私信63（马萨拉·麦尼昂谈判）：邮件25(maignanSign)送达两回合后送达；送达即把麦尼昂(gk_talent)加入 transferIntel，解锁其签约「情报加持」
    if (gameStats.season === 4 && gameStats.deliveredEmails && gameStats.deliveredEmails.maignanSign
        && gameStats.round >= gameStats.deliveredEmails.maignanSign.r + 2 && !gameStats.deliveredEmails.massaraMaignan) {
        deliverEmail('massaraMaignan');
        if (!gameStats.transferIntel) gameStats.transferIntel = [];
        if (!gameStats.transferIntel.includes('gk_talent')) gameStats.transferIntel.push('gk_talent'); // 解锁麦尼昂签约「情报加持」
    }
    // 私信60（球探求购）：已签青年球员成长值达阈值后逐轮下发（每轮最多一条）
    maybeScoutOffer();
    // 私信64（球探引荐 NPC + 解锁情报）：64a 送达 / 选感兴趣后下一轮 64b
    maybeScout64();

    // 第二赛季剧本事件（按轮次必定触发，优先于其他随机事件）
    if (gameStats.season === 2) {
        if (gameStats.round >= 10 && !gameStats.newCoachDone) {
            gameStats.newCoachDone = true;
            return ['newCoach'];
        }
        if (gameStats.round >= 16 && !gameStats.xmasDone) {
            gameStats.xmasDone = true;
            return ['xmasHorror'];
        }
        if (gameStats.round >= 18 && !gameStats.oldFriendDone) {
            gameStats.oldFriendDone = true;
            return ['oldFriend'];
        }
        // 兹拉坦剧情：仅当签下 06（上帝的指挥），26 回合后触发"卓有成效"
        if (gameStats.round >= 26 && !gameStats.effectiveDone &&
            gameStats.signedPlayers.includes('maestro')) {
            gameStats.effectiveDone = true;
            if (!gameStats.ibraNewsDone) gameStats.ibraNewsPending = true; // 卓有成效后 → 当赛季随机触发"伊布的续约谈判"新闻
            return ['effective'];
        }
        // "坐视不理"50% 触发的更衣室斗殴（下回合）
        if (gameStats.lockerBrawlPending && !gameStats.lockerBrawlDone) {
            gameStats.lockerBrawlPending = false;
            gameStats.lockerBrawlDone = true;
            return ['lockerBrawl'];
        }
        // 第30回合固定触发"必要的支持"（需前序剧情已激活：签下06→卓有成效），解锁支持点任务
        if (gameStats.round >= 30 && gameStats.effectiveDone && !gameStats.supportTaskActive) {
            gameStats.supportTaskActive = true;
            return ['support'];
        }
    }

    // 第三赛季剧本事件（童年的马克杯）
    if (gameStats.season === 3) {
        // 第4轮后必定触发 童年的马克杯Ⅰ
        if (gameStats.round >= 4 && !gameStats.mug1Done) {
            gameStats.mug1Done = true;
            return ['mug1'];
        }
        // 欧洲超级联赛Ⅰ（第10轮）；皇家马德里私信56（欧超派对）与Ⅰ同轮送达
        if (gameStats.round >= 10 && !gameStats.eslDone) {
            gameStats.eslDone = true;
            deliverEmail('esl2Madrid'); // 皇马私信与欧超Ⅰ同轮送达（不再等欧超Ⅱ）
            return ['esl1'];
        }
        // 欧洲超级联赛Ⅱ（第14轮，仅Ⅰ选"保持观望"时）
        if (gameStats.round >= 14 && gameStats.esl2Pending && !gameStats.esl2Done) {
            gameStats.esl2Done = true;
            return ['esl2'];
        }
        // 强烈反对！/你什么冠军？（第16轮，按前序选择分支结局）
        if (gameStats.round >= 16 && gameStats.eslResolution && !gameStats.eslResolutionDone) {
            gameStats.eslResolutionDone = true;
            return [{ oppose1: 'eslOppose1', oppose2: 'eslOppose2', oppose3: 'eslOppose3', whatTitle: 'eslWhatTitle' }[gameStats.eslResolution]];
        }
        // 童年的马克杯Ⅱ opt1 触发的"约定"（下一回合）
        if (gameStats.mugPactPending && !gameStats.mugPactDone) {
            gameStats.mugPactPending = false;
            gameStats.mugPactDone = true;
            return ['mugPact'];
        }
        // 第20轮后、冬窗签下07 → 童年的马克杯Ⅱ
        if (gameStats.round >= 20 && !gameStats.mug2Done && gameStats.signedPlayers.includes('cm_youth_it')) {
            gameStats.mug2Done = true;
            return ['mug2'];
        }
        // 同一个姓氏（第32轮）：丹尼尔·马尔蒂尼晋升一线队
        if (gameStats.round >= 32 && !gameStats.sameNameDone) {
            gameStats.sameNameDone = true;
            return ['sameName'];
        }
    }

    // 第四赛季剧本事件（赌王传奇 → 检查点 → 远方来电）；赌王传奇需 07 在队才展开
    if (gameStats.season === 4) {
        // 转会传闻（第6轮后）→ 续约谈判（选恰尔汗奥卢=线性，选多纳鲁马=详细分支谈判页）
        if (gameStats.round >= 6 && !gameStats.transferRumorDone) {
            gameStats.transferRumorDone = true;
            return ['transferRumor'];
        }
        const on07 = gameStats.signedPlayers.includes('cm_youth_it') && !gameStats.player07Removed;
        // 赌王传奇Ⅰ（第8轮后，07在队）
        if (gameStats.round >= 8 && !gameStats.betKing1Done && on07) {
            gameStats.betKing1Done = true;
            return ['betKing1'];
        }
        // 赌王传奇Ⅱ（第16轮后，未提前结束）
        if (gameStats.round >= 16 && gameStats.betKing1Done && !gameStats.betKing2Done && !gameStats.betKingSkip) {
            gameStats.betKing2Done = true;
            return ['betKing2'];
        }
        // 赌王传奇Ⅲ（第20轮后，未提前结束）
        if (gameStats.round >= 20 && gameStats.betKing2Done && !gameStats.betKing3Done && !gameStats.betKingSkip) {
            gameStats.betKing3Done = true;
            return ['betKing3'];
        }
        // 检查点（第30轮后，Ⅲ结束）：07信任点≥3 且 07仍在队 → 我们的责任，否则 → 摔碎的马克杯
        // 检查点（第30轮）：只要07已离队（任何路径，含赌王Ⅱ卖掉/Ⅲ解约或处罚）→ 固定「一去不返的纸飞机」；
        // 07仍在队且信任点≥3 → 「我们的责任」，否则也走纸飞机（届时由 gamblerEnd 移出07）
        if (gameStats.round >= 30 && !gameStats.betKingResolved && (gameStats.betKing3Done || gameStats.player07Removed)) {
            gameStats.betKingResolved = true;
            const standBy = !gameStats.player07Removed && gameStats.player07Trust >= 3;
            deliverEmail(standBy ? 'betKingRespMark' : 'betKingGamblerMark'); // 记录结算轮次（静默标记），供2轮后发加图索私信70/69
            return [standBy ? 'ourResponsibility' : 'gamblerEnd'];
        }
        // 买断我！保罗！（第32轮必定触发，调整21夏窗身价）—— 仅在尚未买断21(托莫里)时触发
        if (gameStats.round >= 32 && !gameStats.buyoutTomoriDone && !gameStats.signedPlayers.includes('cb_eng_loan')) {
            gameStats.buyoutTomoriDone = true;
            gameStats.force21Window = true; // 触发买断后 → 下个转会窗保证 21 出现
            return ['buyoutTomori'];
        }
        // 下一个左后卫Ⅲ：第20轮起联赛赢球后触发（需01在队，一次）；若一直没赢球，到第30轮固定触发。consecutiveNonWins===0 即上一场获胜
        if (gameStats.round >= 20 && gameStats.signedPlayers.includes('lb_winger') && !gameStats.nextLeftBack3Done &&
            (gameStats.consecutiveNonWins === 0 || gameStats.round >= 30)) {
            gameStats.nextLeftBack3Done = true;
            return ['nextLeftBack3'];
        }
    }

    // 第五赛季剧本事件（红鸟入主：合同 → 续约 → 无所不知 → 新闻官）
    if (gameStats.season === 5) {
        // 第30轮后只要输过球就记一笔（持久），避免南看台被同轮的检查点抢占而永久丢失
        if (gameStats.round >= 30 && gameStats.lastMatchLost) gameStats.southStandPending = true;
        // 犹豫不决的合同Ⅰ（第4轮）→ 下一轮新闻"最后一刻"
        if (gameStats.round >= 4 && !gameStats.hesitantContract1Done) {
            gameStats.hesitantContract1Done = true;
            return ['hesitantContract1'];
        }
        // 犹豫不决的合同Ⅱ（第6轮；若Ⅰ选项1则提前到其下一轮）→ 下一轮"续约"（或选项1直接进结局）
        if ((gameStats.round >= 6 || gameStats.hesitantContract2Pending) && !gameStats.hesitantContract2Done) {
            gameStats.hesitantContract2Done = true;
            return ['hesitantContract2'];
        }
        // 无所不知Ⅰ（第16轮）
        if (gameStats.round >= 16 && !gameStats.omniscient1Done) {
            gameStats.omniscient1Done = true;
            return ['omniscient1'];
        }
        // 无所不知Ⅱ（第20轮）
        if (gameStats.round >= 20 && !gameStats.omniscient2Done) {
            gameStats.omniscient2Done = true;
            return ['omniscient2'];
        }
        // 聘请新闻官（第24轮后）
        if (gameStats.round >= 24 && !gameStats.pressOfficerDone) {
            gameStats.pressOfficerDone = true;
            return ['pressOfficer'];
        }
        // 下一个左后卫Ⅳ（第26轮后，需01在队）
        if (gameStats.round >= 26 && gameStats.signedPlayers.includes('lb_winger') && !gameStats.nextLeftBack4Done) {
            gameStats.nextLeftBack4Done = true;
            return ['nextLeftBack4'];
        }
        // 左后卫检查点（第30轮，Ⅳ后）：01信任度≥3 → 接班人，否则 → 另一面
        if (gameStats.round >= 30 && gameStats.nextLeftBack4Done && !gameStats.leftBack4Resolved) {
            gameStats.leftBack4Resolved = true;
            return [gameStats.player01Trust >= 3 ? 'successor' : 'otherSide'];
        }
        // Football之争（第22轮后）
        if (gameStats.round >= 22 && !gameStats.footballDisputeDone) {
            gameStats.footballDisputeDone = true;
            return ['footballDispute'];
        }
        // 此路不通（第10轮后）
        if (gameStats.round >= 10 && !gameStats.deadEndDone) {
            gameStats.deadEndDone = true;
            return ['deadEnd'];
        }
        // 南看台的训话（第30轮后、输球后触发，一次）
        if (gameStats.southStandPending && !gameStats.southStandTalkDone) {
            gameStats.southStandTalkDone = true;
            return ['southStandTalk'];
        }
        // God Bye（第36轮，需 06 伊布在队）：伊布退役仪式 → 退役后移出球员列表
        if (gameStats.round >= 36 && gameStats.signedPlayers.includes('maestro') && !gameStats.godByeDone) {
            gameStats.godByeDone = true;
            const iIbra = gameStats.signedPlayers.indexOf('maestro');
            if (iIbra !== -1) gameStats.signedPlayers.splice(iIbra, 1); // 伊布退役 → 移出球员列表
            return ['godBye'];
        }
    }

    // 远方来电（解锁魔力电话）：签下06 + 兹拉坦支持点满3 → 下回合立刻触发（跨第二/三赛季）
    if (!gameStats.farCallDone && gameStats.zlatanSupport >= 3 && gameStats.signedPlayers.includes('maestro')) {
        gameStats.farCallDone = true;
        return ['farCall'];
    }

    // 情绪宣泄（需购买01）：第三赛季26轮后触发；若届时未买01，则买下01后补触发
    if (!gameStats.emoOutburstDone && gameStats.signedPlayers.includes('lb_winger') &&
        ((gameStats.season === 3 && gameStats.round >= 26) || gameStats.season >= 4)) {
        gameStats.emoOutburstDone = true;
        return ['emoOutburst'];
    }

    // 连输四场后触发南看台事件（平局不算；属随机事件，触发后重置保底计数）
    if (gameStats.consecutiveLosses >= 4 && !gameStats.southStandEventUsed) {
        selectedEvents.push(2);
        gameStats.southStandEventUsed = true;
        gameStats.randomPity = 0;
        return selectedEvents;
    }

    // 待触发的链式/主线事件：到点即必定触发并优先占用本轮；未到点则不阻塞，继续往下抽随机事件
    if (gameStats.futureRandomEvents.length > 0) {
        const pending = gameStats.futureRandomEvents[0];
        const eventId  = resolveEventEntry(pending);
        const minRound = typeof pending === 'object' ? (pending.minRound  || 0)     : 0;
        if (gameStats.round >= minRound) {
            gameStats.futureRandomEvents.shift();
            selectedEvents.push(eventId);
            return selectedEvents;
        }
        // 未到触发轮次：不占用本轮随机事件名额，继续往下
    }

    // 主线事件池：当前赛季专属事件，满足最早轮次即必定触发（优先于随机事件）
    const roundConstraints = mainlineRoundConstraints[gameStats.season] || {};
    const currentMainlinePool = (mainlineEventPools[gameStats.season] || []).filter(id =>
        !gameStats.usedMainlineEvents.includes(id) &&
        gameStats.round >= (roundConstraints[id] || 0)
    );
    if (currentMainlinePool.length > 0) {
        const selectedId = currentMainlinePool[Math.floor(Math.random() * currentMainlinePool.length)];
        selectedEvents.push(selectedId);
        return selectedEvents;
    }

    // 新闻：不占用随机事件名额，与本轮随机事件并列展示（先入队，继续往下抽随机）
    if (gameStats.news01Pending && !gameStats.news01Done) {
        gameStats.news01Pending = false; gameStats.news01Done = true;
        selectedEvents.push('news01');
    }
    if (gameStats.leaoNewsPending && !gameStats.leaoNewsDone) {
        gameStats.leaoNewsPending = false; gameStats.leaoNewsDone = true;
        selectedEvents.push('newsLeao');
    }
    // 伊布的续约谈判：第二赛季「卓有成效」触发后（R26），本赛季内随机某轮触发（每轮 35% 概率）；到赛季末（R36 起）仍未触发则保底触发一次
    if (gameStats.ibraNewsPending && !gameStats.ibraNewsDone && gameStats.season === 2 && (Math.random() < 0.35 || gameStats.round >= 36)) {
        gameStats.ibraNewsPending = false; gameStats.ibraNewsDone = true;
        selectedEvents.push('newsIbraRenewal');
    }

    // 测试快进（当前回合+2）：到此说明强制/定时事件已消费完，不再抽随机事件
    if (ffSkipRandom) return selectedEvents;

    // 随机事件池
    const eventIds = numericRandomEventIds.filter(id => {
        const numId = parseInt(id);
        // 本赛季已触发过的随机事件不再进入随机池（避免重复，赛季初重置）
        if (gameStats.usedRandomEvents.includes(numId)) return false;
        // 仅由特定条件触发的事件，不进入随机池：2=南看台(连输四场)，17=德比失利(输给国米)
        if (numId === 2 || numId === 17) return false;
        // 12=汇报之争、15=大数据时代、18=干扰训练：仅第五赛季进入随机池
        if ((numId === 12 || numId === 15 || numId === 18) && gameStats.season !== 5) return false;
        if (numId === 5 && gameStats.rebateEventCount >= 2) return false;
        if (numId === 10 && gameStats.transferEventUsed) return false;
        if (numId === 11 && gameStats.carCrashEventUsed) return false;
        if (numId === 13 && (gameStats.sinkOrSwimEventUsed || gameStats.budget >= 500)) return false; // 断尾求生：仅预算<500w 时有概率触发
        if (numId === 15 && gameStats.bigDataEventUsed) return false;
        if (numId === 19 && gameStats.overtimeFineUsed) return false; // 超时罚款每赛季最多一次
        return true;
    });

    // 保底概率：50% 起，每个未触发回合 +10%，触发后归零（randomPity 在函数开头已 +1）
    const chance = Math.min(1, 0.4 + 0.1 * gameStats.randomPity);
    if (eventIds.length === 0 || Math.random() >= chance) {
        return selectedEvents;   // 本轮未抽中，randomPity 保留累积
    }
    gameStats.randomPity = 0;     // 触发随机事件 → 重置，下回合回到 50%

    const randomIndex = Math.floor(Math.random() * eventIds.length);
    const selectedId = parseInt(eventIds[randomIndex]);
    gameStats.usedRandomEvents.push(selectedId);   // 本赛季内不再重复触发
    if (selectedId === 10) gameStats.transferEventUsed = true;
    if (selectedId === 11) gameStats.carCrashEventUsed = true;
    if (selectedId === 19) gameStats.overtimeFineUsed = true;
    selectedEvents.push(selectedId);
    return selectedEvents;
}

// 预警阈值规则表，驱动 applyWarningEffects 和 getActiveEffectsText
const warningDeltaRules = [
    { critical: { pred: () => gameStats.trust > 0  && gameStats.trust  < 15, delta: { budget: -200 } },
        crisis: { pred: () => gameStats.trust >= 15 && gameStats.trust  < 30, delta: { budget: -100 } } },
    { critical: { pred: () => gameStats.media > 0  && gameStats.media  < 15, delta: { fans: -2, trust: -2 } },
        crisis: { pred: () => gameStats.media >= 15 && gameStats.media < 30, delta: { fans: -1 } } },
    { critical: { pred: () => gameStats.player > 0  && gameStats.player < 15, delta: { media: -3, fans: -3 } },
        crisis: { pred: () => gameStats.player >= 15 && gameStats.player < 30, delta: { media: -2 } } },
    { critical: { pred: () => gameStats.fans > 0  && gameStats.fans  < 15, delta: { budget: -200, trust: -2 } },
        crisis: { pred: () => gameStats.fans >= 15 && gameStats.fans  < 30, delta: { budget: -100 } } }
];

function computeWarningDeltas() {
    const d = { budget: 0, trust: 0, media: 0, fans: 0 };
    for (const rule of warningDeltaRules) {
        const level = rule.critical.pred() ? rule.critical : rule.crisis.pred() ? rule.crisis : null;
        if (level) for (const [k, v] of Object.entries(level.delta)) d[k] += v;
    }
    return d;
}

// 预警事件数据
const statWarningEvents = [
    {
        key: 'trustCrisis',
        title: '信任危机',
        description: '管理层对你的信任已经大幅度下滑，你必须做点什么来挽救这一切。',
        note: '（管理层信任度低于30，每回合预算-100w欧）',
        condition: () => gameStats.trust >= 15 && gameStats.trust < 30
    },
    {
        key: 'trustCritical',
        title: '扫地出门！',
        description: '你的同事告诉你，管理层已经在考虑用什么样的理由辞退你了。',
        note: '（管理层信任度低于15，每回合预算-200w欧，获得预算时，数目减半。）',
        condition: () => gameStats.trust > 0 && gameStats.trust < 15
    },
    {
        key: 'mediaCrisis',
        title: '米兰报的来信',
        description: '你不能什么都不跟媒体说，现在舆论不会倒向你们了。',
        note: '（媒体声望低于30，每回合球迷满意度-1）',
        condition: () => gameStats.media >= 15 && gameStats.media < 30
    },
    {
        key: 'mediaCritical',
        title: '差评满天飞！',
        description: '一个传球失误就能让媒体大肆批判球员，这给球员也带来了不小的心理压力。',
        note: '（媒体声望低于15，每回合球迷满意度 -2，管理层信任度 -2）',
        condition: () => gameStats.media > 0 && gameStats.media < 15
    },
    {
        key: 'playerCrisis',
        title: '状态不佳',
        description: '输球已是常态，有没有考虑过换教练？',
        note: '（球员状态低于30，每回合媒体声望 -2）',
        condition: () => gameStats.player >= 15 && gameStats.player < 30
    },
    {
        key: 'playerCritical',
        title: '根本没在踢球',
        description: '外面的赌场在下注你们究竟能连输多少场。',
        note: '（球员状态低于15，每回合媒体声望 -3，球迷满意度 -3）',
        condition: () => gameStats.player > 0 && gameStats.player < 15
    },
    {
        key: 'fansCrisis',
        title: '南看台的嘘声',
        description: '球迷对你们的支持仅限于最便宜的票，远征成为了一种花钱找罪受的体验。',
        note: '（球迷满意度低于30，每回合预算-100w欧）',
        condition: () => gameStats.fans >= 15 && gameStats.fans < 30
    },
    {
        key: 'fansCritical',
        title: '冷战时刻',
        description: '球迷仍然爱着这支球队，嘴上说说，在你们获得下一场意甲冠军之前，这些球迷是不会再看你们的比赛的。',
        note: '（球迷满意度低于15，每回合预算 -200，管理层信任度 -2）',
        condition: () => gameStats.fans > 0 && gameStats.fans < 15
    },
    {
        key: 'mediaHigh',
        title: '针锋相对！',
        description: '媒体的高曝光让你们的比赛备受关注，现在，无论是赢球还是输球都将给球迷满意度带来更大的变化。',
        note: '（媒体声望高于80，赢球会增加10点球迷满意度，输球和平局会相应扣除10和5点满意度。）',
        condition: () => gameStats.media > 80
    }
];

const statWarningEvtMap = Object.fromEntries(statWarningEvents.map(e => [e.key, e]));

function showRandomEvents() {
    randomEventModal.classList.remove('warning');
    randomEventModal.classList.remove('mainline');
    randomEventModal.classList.remove('news');
    randomEventModal.classList.remove('ucl');
    randomEventModal.classList.remove('magic');
    // 转会窗即将开始（开窗前一轮提示，主线卡片）
    const winterRound = gameStats.season === 2 ? 20 : 18;
    // 夏窗（第三赛季及以后开局开启，第2轮后开窗）：第1轮提示
    if (gameStats.season >= 3 && gameStats.round === 1 && pendingTransferSlots > 0 && !gameStats.summerWarnShown) {
        gameStats.summerWarnShown = true;
        currentRandomEvents = ['windowSummerSoon'];
        randomEventIndex = 0;
        showNextRandomEvent();
        return;
    }
    // 冬窗：开窗前一轮提示
    if (gameStats.season >= 2 && gameStats.round === winterRound - 1 && !gameStats.winterWindowDone && !gameStats.winterWarnShown && !gameStats.winterNoBudget) {
        gameStats.winterWarnShown = true;
        currentRandomEvents = ['windowWinterSoon'];
        randomEventIndex = 0;
        showNextRandomEvent();
        return;
    }
    // 夏季转会窗：第二赛季经"转会操作权"开启；第三赛季及以后第2轮后开启
    if (pendingTransferSlots > 0 && (gameStats.season < 3 || gameStats.round >= 2)) {
        const slots = pendingTransferSlots;
        pendingTransferSlots = 0;
        openTransferMarket(slots);
        return;
    }
    // 冬季转会窗：第二赛季第20轮后（06）；第三赛季及以后第18轮后（07）
    if (gameStats.season >= 2 && gameStats.round >= winterRound && !gameStats.winterWindowDone) {
        gameStats.winterWindowDone = true;
        if (gameStats.winterNoBudget) { // 无所不知选项3 → 管理层不给预算，弹「冬窗无预算」主线卡代替开窗
            currentRandomEvents = ['winterNoBudgetCard'];
            randomEventIndex = 0;
            showNextRandomEvent();
            return;
        }
        openWinterTransferMarket();
        return;
    }
    // 欧冠节点（小组赛果 / 淘汰赛之夜）
    if (maybeShowUclCard()) return;
    // 德比赛果已在 closeResultBtn（赛后第一步）最高优先级单独展示，此处只抽常规随机/主线事件
    currentRandomEvents = selectRandomEvents();
    randomEventIndex = 0;
    showNextRandomEvent();
}

// 每轮关闭周报时应用的持续衰减效果
function applyWarningEffects() {
    for (const rule of warningDeltaRules) {
        const level = rule.critical.pred() ? rule.critical : rule.crisis.pred() ? rule.crisis : null;
        if (!level) continue;
        for (const [k, v] of Object.entries(level.delta)) {
            if (k === 'budget') updateBudget(v); else updateStat(k, v);
        }
    }
}

// 检测本轮新触发的预警并返回队列
function getNewWarnings() {
    const queue = [];
    const statPairs = [
        ['trustCrisis', 'trustCritical'],
        ['mediaCrisis', 'mediaCritical'],
        ['playerCrisis', 'playerCritical'],
        ['fansCrisis', 'fansCritical']
    ];
    for (const [crisisKey, criticalKey] of statPairs) {
        const critEvt = statWarningEvtMap[criticalKey];
        const crisEvt = statWarningEvtMap[crisisKey];
        if (critEvt.condition() && !gameStats.shownWarnings[criticalKey]) {
            gameStats.shownWarnings[criticalKey] = true;
            gameStats.shownWarnings[crisisKey] = true;
            queue.push(critEvt);
        } else if (crisEvt.condition() && !gameStats.shownWarnings[crisisKey]) {
            gameStats.shownWarnings[crisisKey] = true;
            queue.push(crisEvt);
        }
    }
    return queue;
}

// 展示单个预警弹窗
function displayWarningEvent(title, description, note) {
    document.getElementById('random-event-title').textContent = title;
    document.getElementById('random-event-description').innerHTML =
        `${description}<span class="warning-note">${note}</span>`;
    const optionsContainer = document.getElementById('random-event-options');
    optionsContainer.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = '确认';
    button.className = 'random-event-option';
    button.addEventListener('click', () => {
        randomEventModal.classList.remove('warning');
        randomEventModal.classList.add('hidden');
        showNextPendingWarning();
    });
    optionsContainer.appendChild(button);
    randomEventModal.classList.add('warning');
    randomEventModal.classList.remove('hidden');
}

// 依次弹出预警队列，队列清空后进入随机事件
function showNextPendingWarning() {
    if (pendingWarnings.length === 0) {
        showRandomEvents();
        return;
    }
    const w = pendingWarnings.shift();
    displayWarningEvent(w.title, w.description, w.note);
}

// 显示下一个随机事件
function showNextRandomEvent() {
    if (randomEventIndex >= currentRandomEvents.length) {
        randomEventModal.classList.add('hidden');
        randomEventModal.classList.remove('mainline');
        randomEventModal.classList.remove('warning');
        randomEventModal.classList.remove('news');
        randomEventModal.classList.remove('ucl');
        randomEventModal.classList.remove('magic');
        if (afterDerbyCallback) { // 德比弹窗看完 → 接续预警 + 主线/随机
            const cb = afterDerbyCallback;
            afterDerbyCallback = null;
            cb();
            return;
        }
        if (pendingSeasonEndCallback) {
            // 当前事件展示完后，检查是否有新入队的主线事件（如 euroNight2 结束后 farewell 被推入）
            const nextMainlineIdx = gameStats.futureRandomEvents.findIndex(e =>
                randomEvents[resolveEventEntry(e)]?.mainline
            );
            if (nextMainlineIdx !== -1) {
                const next = gameStats.futureRandomEvents.splice(nextMainlineIdx, 1)[0];
                currentRandomEvents = [resolveEventEntry(next)];
                randomEventIndex = 0;
                showNextRandomEvent();
                return;
            }
            const cb = pendingSeasonEndCallback;
            pendingSeasonEndCallback = null;
            cb();
            return;
        }
        resetAfterMatch();
        return;
    }

    const eventId = currentRandomEvents[randomEventIndex];

    // 多纳鲁马续约谈判：直接打开谈判页（接管后续流程）
    if (eventId === 'donnaNego') {
        openDonnaNego();
        return;
    }

    // 小组赛抽签（蓝色卡片）：赛季开场播报
    if (eventId === 'uclDraw') {
        const names = gameStats.uclFixtures.group.map(t => t.name).join('、');
        renderUclCard('小组赛抽签', `小组赛抽签完毕！AC Milan 和 ${names} 分为一组。`, [{
            text: '确认', onClick: () => { randomEventIndex++; showNextRandomEvent(); }
        }]);
        return;
    }

    const event = randomEvents[eventId];

    // FFP的绞索Ⅰ 触发 → CEO 的 FFP 提醒邮件（04）送达邮箱
    if (eventId === 'ffp1') deliverEmail('ffp');
    // 欧联之夜Ⅰ 触发 → 莱昂纳多换帅预警邮件（07）送达
    if (eventId === 'euroNight1') deliverEmail('coachWarning');
    // 卓有成效 触发 → CEO 架构思考邮件（14）送达；记录回合，两回合后再送 15/16
    if (eventId === 'effective') { deliverEmail('clubArchitecture'); gameStats.architectureRound = gameStats.round; }

    randomEventModal.classList.remove('ucl', 'magic', 'compilation');
    document.getElementById('random-event-title').textContent = event.title;
    if (event.warningStyle) {
        randomEventModal.classList.add('warning');
        randomEventModal.classList.remove('mainline', 'news');
        document.getElementById('random-event-description').innerHTML =
            event.description + (event.note ? `<span class="warning-note">${event.note}</span>` : '');
    } else if (event.newsStyle) {
        randomEventModal.classList.add('news');
        randomEventModal.classList.remove('mainline', 'warning');
        document.getElementById('random-event-description').innerHTML =
            `<span class="news-source">新闻来源：${event.source}</span>` +
            event.content.split('\n').map(p => `<p class="news-para">${p}</p>`).join('');
    } else if (event.newsCompilation) {
        // 新闻合订本：多条新闻竖向排列、上下滑动查看（眉标改为"新闻合订本"）
        randomEventModal.classList.add('news', 'compilation');
        randomEventModal.classList.remove('mainline', 'warning');
        document.getElementById('random-event-description').innerHTML =
            event.items.map(item =>
                `<div class="news-item"><div class="news-item-title">${item.title}</div>` +
                `<span class="news-source">新闻来源：${item.source}</span>` +
                item.content.split('\n').map(p => `<p class="news-para">${p}</p>`).join('') +
                `</div>`
            ).join('<div class="news-item-rule"></div>');
        const nc = randomEventModal.querySelector('.modal-content');
        if (nc) nc.scrollTop = 0;
    } else if (event.mainline) {
        randomEventModal.classList.add('mainline');
        randomEventModal.classList.remove('warning', 'news');
        document.getElementById('random-event-description').innerHTML = formatBrackets(
            typeof event.description === 'function' ? event.description() : event.description
        );
    } else {
        randomEventModal.classList.remove('mainline', 'warning', 'news');
        document.getElementById('random-event-description').textContent = event.description;
    }
    
    const optionsContainer = document.getElementById('random-event-options');
    optionsContainer.innerHTML = '';

    // 可重复选择的事件（如"必要的支持"）：选择后不自动关闭，仅在达成支持点或点击关闭时退出
    if (event.repeatable) {
        renderRepeatableEvent(event, optionsContainer);
        randomEventModal.classList.remove('hidden');
        return;
    }

    const visibleCount = event.options.filter(o => !o.condition || o.condition()).length;
    let visibleOptionIndex = 0;
    event.options.forEach((option) => {
        if (option.condition && !option.condition()) {
            return;
        }
        visibleOptionIndex++;
        const button = document.createElement('button');
        // 新闻样式卡片（单条/合订本）按钮统一为"合上报纸"
        button.textContent = (event.newsStyle || event.newsCompilation) ? '合上报纸' : option.text;
        button.className = 'random-event-option' + (visibleCount === 1 ? ' random-event-option--single' : '');
        button.addEventListener('click', () => {
            // 记录随机/主线事件选择：有数值变化即记录；主线的多选项决策即使无数值变化也记录
            // 排除：预警卡、event.noHistory（结算卡如德比获胜）、disc21（自带记录）、negotiation（只记谈判结果，不记"进入谈判"）
            if (!event.warningStyle && !event.noHistory && option.disc21 === undefined && !option.negotiation &&
                (Object.keys(option.effects).length > 0 || (event.mainline && visibleCount > 1))) {
                choiceHistory.push({
                    round: gameStats.round,
                    eventName: event.title,
                    optionText: option.text.replace(/（结局）$/, ''),
                    effects: option.effects,
                    kind: 'special'
                });
            }
            // 应用效果
            for (const [stat, delta] of Object.entries(option.effects)) {
                updateStat(stat, delta);
            }
            if (eventId === 13) { gameStats.sinkOrSwimEventUsed = true; }
            if (eventId === 15) { gameStats.bigDataEventUsed = true; }
            if ((mainlineEventPools[gameStats.season] || []).includes(eventId) &&
                !gameStats.usedMainlineEvents.includes(eventId)) {
                gameStats.usedMainlineEvents.push(eventId);
            }
            if (eventId === 5) { gameStats.rebateEventCount += 1; }
            if (option.chain) {
                // 概率命中走 eventId，未命中且配了 elseEventId 走备选（两者互斥，恰好触发其一）
                const chainedId = Math.random() < option.chain.probability
                    ? option.chain.eventId
                    : option.chain.elseEventId;
                if (chainedId) {
                    // afterRounds：相对当前轮次的延迟触发（如"Ⅰ后第4轮"）
                    const chainMinRound = option.chain.minRound
                        || (option.chain.afterRounds ? gameStats.round + option.chain.afterRounds : 0);
                    const hasExtra = chainMinRound || option.chain.immediate;
                    const entry = hasExtra
                        ? { eventId: chainedId,
                            ...(chainMinRound  ? { minRound: chainMinRound } : {}),
                            ...(option.chain.immediate  ? { immediate: true }               : {}) }
                        : chainedId;
                    gameStats.futureRandomEvents.push(entry);
                }
            }
            if (option.ending) {
                randomEventModal.classList.add('hidden');
                showEnding(option.ending);
                return;
            }
            if (option.endingChance && Math.random() < option.endingChance.probability) {
                randomEventModal.classList.add('hidden');
                showEnding(option.endingChance.endingId);
                return;
            }
            if (option.unknownOptNum !== undefined && !gameStats.gameEnded) {
                const trustHigh = gameStats.trust > 80;
                const rightsId = option.unknownOptNum === 1
                    ? (trustHigh ? 'transferRightsA' : 'transferRightsC')
                    : (trustHigh ? 'transferRightsB' : 'transferRightsD');
                currentRandomEvents.splice(randomEventIndex + 1, 0, rightsId);
            }
            if (option.transferSlots !== undefined && !gameStats.gameEnded) {
                pendingTransferSlots = option.transferSlots;
            }
            if (option.winterSlot) { gameStats.winterSlotBonus += option.winterSlot; }
            if (option.winterNoBudget) { gameStats.winterNoBudget = true; } // 无所不知选项3 → 下个冬窗无预算（弹卡代替开窗）
            if (option.winterReturn !== undefined) { gameStats.winterReturnCost = option.winterReturn; }
            if (option.winterReturnIntent !== undefined) { gameStats.winterReturnIntent = option.winterReturnIntent; }
            if (option.brawlChance && Math.random() < option.brawlChance) { gameStats.lockerBrawlPending = true; }
            if (option.euroBan) { gameStats.uclBanNextSeason = true; deliverEmail('cfcb'); } // 认罚放弃一年欧战 → CFCB 裁决转发邮件（05）送达
            if (option.deliverMail) // 选项直接指定送达触发型邮件/私信（可为数组→一次送达多封，如 ffp2 选项2 → 邮件06 + 国米…主力球员私信）
                (Array.isArray(option.deliverMail) ? option.deliverMail : [option.deliverMail]).forEach(deliverEmail);
            if (option.mug07Cost !== undefined) { gameStats.player07WinterCost = option.mug07Cost; }
            if (option.mug07Trust) { gameStats.player07Trust += option.mug07Trust; }
            if (option.trust01) { gameStats.player01Trust += option.trust01; }
            if (option.suspicion) {
                gameStats.suspicion += option.suspicion;
                updateSuspicionCard();
                // 不满值攒满 5 点 → 立即触发「新的一页」（红鸟解约，即 seasonTrust 结局卡；同 option.ending 模式）
                if (gameStats.suspicion >= 5 && !gameStats.gameEnded) {
                    randomEventModal.classList.add('hidden');
                    showEnding('seasonTrust');
                    return;
                }
            }
            if (option.disc21 !== undefined) {
                gameStats.player21Discount = option.disc21;
                // 买断决策进入决策记录，称呼球员名字而非代号
                choiceHistory.push({
                    round: gameStats.round,
                    eventName: event.title,
                    optionText: option.text,
                    note: option.disc21 > 0 ? `托莫里身价 -${option.disc21}万欧元` : '托莫里身价不变',
                    effects: {},
                    kind: 'special'
                });
            }
            if (option.mugPact) { gameStats.mugPactPending = true; }
            if (option.eslResult) { gameStats.eslResolution = option.eslResult; } // 欧超：记录第16轮要展示的分支结局
            if (option.eslWait) { gameStats.esl2Pending = true; }                  // 欧超Ⅰ选"观望" → 第14轮触发欧超Ⅱ
            if (option.triggerHc2) { gameStats.hesitantContract2Pending = true; }  // 犹豫合同Ⅰ选项1 → 下一轮提前触发Ⅱ
            // 同一个姓氏：晋升丹尼尔·马尔蒂尼（08）入一线队 → 收录到终端「球员」（中性晋升，不改数值）
            if (option.acquire08 || (option.acquire08Chance && Math.random() < option.acquire08Chance)) {
                if (!gameStats.signedPlayers.includes('daniel_maldini')) {
                    gameStats.signedPlayers.push('daniel_maldini');
                    initPlayerGrowth('daniel_maldini'); // 青年球员初始成长值1
                    deliverEmail('signDaniel');    // 丹尼尔晋升入队 → 其私信（消息16）
                    deliverEmail('danielNumber');  // AC米兰·三号球衣（消息28）
                }
            }
            if (option.betKingSkip) { gameStats.betKingSkip = true; }
            if (option.remove07) {
                gameStats.player07Removed = true;
                const i07 = gameStats.signedPlayers.indexOf('cm_youth_it');
                if (i07 !== -1) gameStats.signedPlayers.splice(i07, 1);
            }
            if (option.unlockMagicPhone) {
                gameStats.magicPhoneUnlocked = true; updateMagicPhoneBtn();
            }
            if (option.nextEvent && !gameStats.gameEnded) {
                currentRandomEvents.splice(randomEventIndex + 1, 0, option.nextEvent);
            }
            // 进入续约谈判页面（接管后续流程，谈判结束后继续比赛）
            if (option.negotiation && !gameStats.gameEnded) {
                // 转会传闻：未被选中谈判的（多纳鲁马/恰尔汗奥卢）= 不进入谈判 = 直接破裂自由离队 → 触发对应邮件25/26
                if (option.negotiation.includes('calhanoglu') || option.negotiation.includes('donnarumma')) {
                    if (!option.negotiation.includes('donnarumma')) gameStats.donnaLeftFreeRound = gameStats.round;
                    if (!option.negotiation.includes('calhanoglu')) { gameStats.calhaLeftRound = gameStats.round; deliverEmail('calhaInter'); } // 未谈判=直接破裂：邮件26 立刻送达
                }
                randomEventModal.classList.add('hidden');
                randomEventModal.classList.remove('mainline');
                pendingNegotiations = option.negotiation.slice();
                startNextNegotiation();
                return;
            }
            randomEventIndex++;
            showNextRandomEvent();
        });
        optionsContainer.appendChild(button);
    });

    randomEventModal.classList.remove('hidden');
}

// 渲染可重复选择的事件（必要的支持）：选择不关闭，达成3点或点击关闭才退出
function renderRepeatableEvent(event, optionsContainer) {
    const counter = document.createElement('div');
    counter.className = 'support-event-counter';
    counter.textContent = '兹拉坦的支持点';
    optionsContainer.appendChild(counter);
    optionsContainer.appendChild(buildSupportDots());

    event.options.forEach((option) => {
        const button = document.createElement('button');
        button.className = 'random-event-option';
        button.textContent = `${option.text}（${formatEffects(option.effects)}）`;
        button.addEventListener('click', () => {
            applyZlatanSupport(option);
            if (gameStats.zlatanSupport >= 3 || gameStats.gameEnded) {
                randomEventIndex++;          // 达成或触发结局 → 关闭事件
            }
            showNextRandomEvent();           // 否则以同一索引重渲染，刷新计数
        });
        optionsContainer.appendChild(button);
    });

    const closeBtn = document.createElement('button');
    closeBtn.className = 'random-event-option support-event-close';
    closeBtn.textContent = '关闭';
    closeBtn.addEventListener('click', () => {
        randomEventIndex++;
        showNextRandomEvent();
    });
    optionsContainer.appendChild(closeBtn);
}

function getActiveEffectsText() {
    const d = computeWarningDeltas();
    const parts = [];
    if (d.budget !== 0) parts.push(`预算 ${d.budget}w欧`);
    if (d.trust  !== 0) parts.push(`信任度 ${d.trust}`);
    if (d.media  !== 0) parts.push(`媒体声望 ${d.media}`);
    if (d.fans   !== 0) parts.push(`球迷满意度 ${d.fans}`);
    return parts.length ? parts.join('，') : null;
}

function showWeeklyReport(result1, result2) {
    const round2 = gameStats.round;
    const round1 = round2 - 1;

    function resultText(r) {
        if (r.result === 'win') return `AC Milan以${r.score}战胜了${r.opponent.name}！`;
        if (r.result === 'draw') return `AC Milan与${r.opponent.name}以${r.score}打成平手！`;
        return `AC Milan以${r.score}不敌${r.opponent.name}！`;
    }
    function resultClass(r) {
        return r.result === 'win' ? 'result-win' : r.result === 'draw' ? 'result-draw' : 'result-loss';
    }

    const effectsText = getActiveEffectsText();
    const effectsHtml = effectsText
        ? `<div class="news-effects"><span class="news-effects-label">当前效果</span>：${effectsText}</div>`
        : '';

    matchResultModal.classList.add('weekly');
    matchResultText.innerHTML = `
        <div class="news-header">
            <div class="news-rule"></div>
            <div class="news-masthead">周　报</div>
            <div class="news-edition">AC Milan &middot; 赛季第 ${round1}–${round2} 轮</div>
            <div class="news-rule"></div>
        </div>
        <div class="news-body">
            <div class="news-match">
                <div class="news-round-label">第 ${round1} 轮</div>
                <div class="news-match-text ${resultClass(result1)}">${resultText(result1)}</div>
            </div>
            <div class="news-match">
                <div class="news-round-label">第 ${round2} 轮</div>
                <div class="news-match-text ${resultClass(result2)}">${resultText(result2)}</div>
            </div>
        </div>
        ${effectsHtml}
        <div class="news-footer-rule"></div>
    `;
    matchResultModal.classList.remove('hidden');
}

function resetAfterMatch() {
    matchResultModal.classList.add('hidden');
    decisionPoints = 0;
    updateDecisionPoints();
    resetEventBtns();
    startMatchBtn.disabled = true;
}

function startNewSeason() {
    gameStats.season += 1;
    // 欧战资格：上赛季前四进欧冠、第5~6进欧联，且未因 FFP 主动认罚放弃欧战
    // 上赛季拿到欧冠/欧联冠军 → 下赛季必定有欧冠小组赛资格（无视排名与禁赛）
    const prevRanking = gameStats.ranking;
    const wonEuro = gameStats.uclStage === 'champion';
    const qualifies = wonEuro || ((prevRanking <= 6) && !gameStats.uclBanNextSeason);
    gameStats.lastSeasonRanking = prevRanking;
    gameStats.euroType = (wonEuro || prevRanking <= 4) ? 'ucl' : 'uel';
    gameStats.hasUCL = qualifies;
    gameStats.uclReachedFinal = false; // 每赛季欧冠是否进入决赛，重置
    gameStats.scout64SeasonCount = 0;  // 消息64：本赛季球探引荐名额重置（上限 SCOUT64_MAX_PER_SEASON）
    gameStats.scoutOfferSeasonCount = 0; // 私信60：本赛季 AAA 球探求购名额重置（上限 SCOUT_OFFER_MAX_PER_SEASON）
    // 第四赛季任务按此前已获得的意甲冠军数确定（迟来的冠军 / 第n个冠军 / 进欧冠决赛）
    if (gameStats.season === 4) gameStats.season4TitlesBefore = gameStats.scudettoCount;
    // 第三赛季起，01-09 的"欧冠"标签在转会窗显示（无论是否打欧冠）
    if (gameStats.season >= 3) gameStats.uclTagShown = true;
    gameStats.uclBanNextSeason = false;
    gameStats.uclFixtures = qualifies ? drawUclFixtures() : null;
    gameStats.uclStage = qualifies ? 'group' : null;
    gameStats.uclQualified = false;
    gameStats.uclGroupPos = 0;
    gameStats.uclOutRound = 0;
    gameStats.round = 0;
    gameStats.points = 0;
    gameStats.ranking = 1;
    gameStats.lastScore = '';
    gameStats.lastOpponentDisplay = '';
    gameStats.consecutiveNonWins = 0;
    gameStats.consecutiveLosses = 0;
    gameStats.usedRandomEvents = [];
    gameStats.southStandEventUsed = false;
    gameStats.betKingEventUsed = false;
    gameStats.rebateEventCount = 0;
    gameStats.transferEventUsed = false;
    gameStats.carCrashEventUsed = false;
    gameStats.sinkOrSwimEventUsed = false;
    gameStats.bigDataEventUsed = false;
    gameStats.overtimeFineUsed = false; // 超时罚款每赛季重置
    if (gameStats.difficulty === 'medium') gameStats.homeVisitUsed = false; // 中等模式：亲自登门次数每赛季重置（困难不重置=全程仅一次）
    gameStats.derbyLossEventPending = false;
    gameStats.derbyWinEventPending = false;
    gameStats.warningEventShown = false;
    gameStats.futureRandomEvents = [];
    gameStats.usedMainlineEvents = [];
    gameStats.newCoachDone = false;
    gameStats.xmasDone = false;
    gameStats.oldFriendDone = false;
    gameStats.winterWindowDone = false;
    gameStats.summerWarnShown = false; // 转会窗提示每赛季重置
    gameStats.winterWarnShown = false;
    gameStats.winterSlotBonus = 0;
    gameStats.winterReturnCost = 0;
    gameStats.winterReturnIntent = 0;
    // 注意：signedPlayers（已签下球员）必须跨赛季保留，否则已购球员会在下赛季转会窗重新出现
    gameStats.news01Pending = false;
    gameStats.news01Done = false;
    gameStats.ibraNewsPending = false;
    gameStats.ibraNewsDone = false;
    gameStats.effectiveDone = false;
    gameStats.lockerBrawlPending = false;
    gameStats.lockerBrawlDone = false;
    // 必要的支持=可选任务：完成(满3→已触发远方来电)后进入第四赛季清理；未完成则不清理、跨赛季常驻「赛季任务」直到完成
    if (gameStats.season >= 4 && gameStats.zlatanSupport >= 3) {
        gameStats.supportTaskActive = false;
        gameStats.zlatanSupport = 0;
    }
    gameStats.shownWarnings = {
        trustCrisis: false, trustCritical: false,
        mediaCrisis: false, mediaCritical: false,
        playerCrisis: false, playerCritical: false,
        fansCrisis: false, fansCritical: false
    };
    (seasonStartEvents[gameStats.season] || []).forEach(e => gameStats.futureRandomEvents.push(e));
    pendingTransferSlots = 0;
    // 第三赛季及以后开局开启夏季转会窗（第二轮结束后开始；可买 08、09）
    if (gameStats.season >= 3) pendingTransferSlots = 3;
    // 邮件19（马萨拉·夏窗可用预算）：第三赛季一开始即送达（先于夏窗、先于任何比赛），正文 {budget} 取此刻季初预算快照
    if (gameStats.season === 3 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.summerBudget)) deliverEmail('summerBudget');
    // 「赛季一开始」即送达的邮件/私信统一在此（round 0，先于任何比赛与转会窗）
    if (gameStats.season === 2 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.costacurtaDirector)) deliverEmail('costacurtaDirector'); // 私信50·科斯塔库塔
    if (gameStats.season === 5) {
        if (!(gameStats.deliveredEmails && (gameStats.deliveredEmails.sellMilan || gameStats.deliveredEmails.sellMilanUcl))) deliverEmail(gameStats.s4WonUcl ? 'sellMilanUcl' : 'sellMilan'); // 邮件28/29·戈登·辛格（互斥）
        if (!(gameStats.deliveredEmails && gameStats.deliveredEmails.gazidisFarewell)) deliverEmail('gazidisFarewell');       // 邮件30·加齐迪斯告别
        if (!(gameStats.deliveredEmails && gameStats.deliveredEmails.cardinaleDirection)) deliverEmail('cardinaleDirection'); // 邮件31·卡尔迪纳莱
    }
    // 私信71（马萨拉·35页计划书）改到与邮件33同轮（第五赛季第 26 轮）送达，不再于赛季一开始送达
    // 邮件21/22（主席·首个里程碑祝贺，互斥）：首次赛季结算进欧冠区(名次≤4)后的下个赛季一开始；排名1→22(firstScudetto)，2~4→21(firstTop4)
    if (gameStats.season >= 2 && gameStats.lastSeasonRanking >= 1 && gameStats.lastSeasonRanking <= 4
        && !(gameStats.deliveredEmails && (gameStats.deliveredEmails.firstScudetto || gameStats.deliveredEmails.firstTop4)))
        deliverEmail(gameStats.lastSeasonRanking === 1 ? 'firstScudetto' : 'firstTop4');
    // 私信22（特奥·染发庆祝）：签下01且上赛季夺意甲冠军 → 赛季一开始送达
    if (gameStats.lastSeasonRanking === 1 && gameStats.signedPlayers.includes('lb_winger')
        && !(gameStats.deliveredEmails && gameStats.deliveredEmails.theoScudetto)) deliverEmail('theoScudetto');
    lastOpponentName = '';
    matchHistory = [];
    choiceHistory = [];
    applyRelegation();
    initializeLeague();
    matchSchedule = generateMatchSchedule();   // 升降级后再排程，避免赛程含已降级球队
    scheduleIndex = 0;
    updateLeagueRanking();
    updateScoreboard();
    decisionPoints = 0;
    updateDecisionPoints();
    resetEventBtns();
    startMatchBtn.disabled = true;
    eventOptions.classList.add('hidden');
    showSeasonIntro(gameStats.season, null);
}

function showScudetto1ThenResult() {
    gameStats.wonScudetto1 = true;
    currentRandomEvents = ['scudetto1'];
    randomEventIndex = 0;
    pendingSeasonEndCallback = () => {
        const intro = seasonIntros[gameStats.season];
        if (intro && intro.taskCheck) { showSeasonResult(intro.taskCheck()); return; }
        if (gameStats.difficulty === 'easy') { showEnding(getSeasonEndingKey()); return; }
        showSeasonTransition(gameStats.season);
    };
    showNextRandomEvent();
}

// 未完成赛季任务：先弹"遗憾离场"卡片（深色失败样式，复用赛季结算弹窗），点继续后再进入普通结局
let pendingSeasonResultContinue = null;
function showRegretCard(endingKey) {
    const modal = document.getElementById('season-result-modal');
    modal.classList.remove('passed');
    modal.classList.add('failed');
    document.getElementById('season-result-title').textContent = '遗憾离场';
    document.getElementById('season-result-text').textContent = '您没有完成本赛季的赛季任务，即将进入普通结局。';
    pendingSeasonResultContinue = () => showEnding(endingKey);
    modal.classList.remove('hidden');
}

function showSeasonResult(passed) {
    if (!passed) {
        // 第五赛季的未完成任务在 doSeasonEnd 中单独处理；此处仅服务第 1–4 赛季 + easy
        showRegretCard(getSeasonEndingKey());
        return;
    }
    pendingSeasonResultContinue = null; // 通过路径不复用遗憾离场的继续回调
    // 通过赛季任务 → 一律走「赛季结算」卡（按最终排名 / 欧战夺冠给结语与预算）
    showSeasonSettlement();
}

// 主线样式卡片（红色，复用随机事件弹窗）
function renderMainlineCard(title, html, options) {
    randomEventModal.classList.remove('warning', 'news', 'ucl', 'magic');
    randomEventModal.classList.add('mainline');
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

// 赛季结束后进入下一赛季 / 结局
function proceedAfterSeason() {
    randomEventModal.classList.remove('mainline');
    randomEventModal.classList.add('hidden');
    if (gameStats.difficulty === 'easy') { showEnding(getSeasonEndingKey()); }
    else if (gameStats.season >= 5) { showEnding('surprise'); }
    else { startNewSeason(); }
}

// 赛季结算：按最终排名 + 欧冠/欧联夺冠情况给出结语与预算奖励
function getSeasonSettlement() {
    const r = gameStats.ranking;
    const wonUCL = gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion';
    const wonUEL = gameStats.euroType === 'uel' && gameStats.uclStage === 'champion';
    const others = leagueTeams.filter(t => t.name !== 'AC Milan').map(t => t.points);
    const margin = Math.max(0, gameStats.points - (others.length ? Math.max(...others) : 0));
    // 排名第一夺冠的领先描述：与第二名同分（净胜球夺冠）时改用"净胜球优势"，避免"以0分的优势"
    const leadText = margin > 0
        ? `以${margin}分的优势领跑意甲，最终在赛季结束时获得了意甲冠军！`
        : '以净胜球优势夺得意甲冠军！';
    // FFP 主动认罚、放弃下赛季欧战（第一赛季 ffp 选项）专用结算文案：不提"下赛季欧冠资格"。
    // 第一赛季无欧战资格，wonUCL/wonUEL 必为 false，故此即认罚后的全部结算文案。
    if (gameStats.uclBanNextSeason && !wonUCL && !wonUEL) {
        if (r === 1) return { budget: 1000, text: `AC Milan不负众望，${leadText}时隔多年，AC Milan再次举行了盛大的冠军游行！管理层因为这个赛季突出的成绩，增加了球队的预算。（球队预算+1000w）` };
        if (r <= 4) return { budget: 500, text: 'AC Milan的最终成绩稳定在了联赛前四，虽然您可能有向前一步的目标，但以球队目前的状况来看，保住欧冠资格才是管理层的首要任务。管理层对球队的预算有了小幅度的上升。（球队预算+500w）' };
        return { budget: 250, text: 'AC Milan最终的成绩稳定在了欧联区，球队有资格参加下赛季的欧洲联赛，在欧联中，球队仍然可以争取奖金和曝光度。管理层仍然希望球队每年都能踢上欧冠，这对于广告招商和球员签约具有正面影响。管理层给球队的预算小幅度上升了。（球队预算+250w）' };
    }
    if (r === 1) {
        if (wonUCL) return { budget: 2000, text: '您带领的AC Milan获得了双冠王！所向披靡的姿态和无懈可击的战术配合，使得你们同时将意甲冠军和欧冠冠军收入囊中。球队的影响力得到了极大扩张，教练摇身一变成了不可多得的名帅。管理层收到了多份广告商的合作报价，球队的预算也上升了。（球队预算+2000w）' };
        if (wonUEL) return { budget: 1500, text: 'AC Milan获得了欧联冠军和意甲冠军！虽然上赛季只获得了参加欧联的资格，但球队顺势而为，不仅获得了意甲第一，还拿下了欧联冠军。在下个赛季，你们将有较大的优势在欧冠联赛中小组直接出线。管理层对这个赛季的进步非常满意，增加了球队的预算。（预算+1500w）' };
        return { budget: 1000, text: `AC Milan不负众望，${leadText}您将获得下赛季的欧冠资格，并且有较大的优势小组直接出线，管理层因为这个赛季突出的成绩，增加了球队的预算。（球队预算+1000w）` };
    }
    if (r <= 4) {
        if (wonUCL) return { budget: 1500, text: '谁说联赛很重要？球员们抱着大耳朵杯亲了又亲，虽然你们错失意甲第一的宝座，但花车巡游时，没有任何一个球员的脸上有失去意甲冠军的失望。踢十年小组赛不如拿一次大耳朵杯，教练深谙此道。抓欧冠放联赛也是需要技术的，搞不好两头都没了。管理层给球队的预算上升了。（球队预算+1500w）' };
        if (wonUEL) return { budget: 1000, text: 'AC Milan获得了欧联冠军！作为欧联冠军，球队有资格直接进入下赛季的欧冠小组赛。上赛季跌入欧联区没有让球员气馁，反而激发了球员的斗志。获得欧联冠军使得球队的影响力和球队预算都上升了。（球队预算+1000w）' };
        return { budget: 500, text: 'AC Milan的最终成绩稳定在了联赛前四，你们拥有了下赛季参加欧冠联赛的资格，虽然您可能有向前一步的目标，但以球队目前的状况来看，保住欧冠资格才是管理层的首要任务。管理层对球队的预算有了小幅度的上升。（球队预算+500w）' };
    }
    if (wonUCL) return { budget: 1250, text: '尽管你们在联赛排名不佳，仅仅处于欧联区，但谁让大耳朵杯已经被米兰收入囊中。受欧足联条款影响，作为当赛季的欧冠冠军，你们有资格直接参加下赛季的欧冠小组赛。教练的大智慧让你们不再纠结于联赛，管理层对球队的预算增加了。（球队预算+1250w）' };
    if (wonUEL) return { budget: 750, text: 'AC Milan获得了欧联冠军！虽然在联赛排名中，米兰再一次跌入欧联区，但你们作为本赛季欧联冠军，受欧足联条款影响，有资格直接参加下个赛季的欧冠小组赛。媒体影响力上升的同时，球队的预算小幅度上升了。（球队预算+750w）' };
    if (r <= 6) return { budget: 250, text: 'AC Milan最终的成绩稳定在了欧联区，球队有资格参加下赛季的欧洲联赛，在欧联中，球队仍然可以争取奖金和曝光度。管理层仍然希望球队每年都能踢上欧冠，对于广告招商和球员签约具有正面影响。管理层给球队的预算小幅度上升了。（球队预算+250w）' };
    // 排名 7+：无任何欧战资格（仅在以非排名任务通过赛季时可能出现）
    return { budget: 250, text: 'AC Milan最终排在了意甲中游，遗憾无缘下赛季的欧洲赛场。虽然没能挤进欧战区，但你完成了管理层这个赛季交付的任务，这支年轻的球队仍在一步步搭建。管理层认可你的工作，给球队的预算小幅度上升了。（球队预算+250w）' };
}

function showSeasonSettlement() {
    const s = getSeasonSettlement();
    // 赛季结算奖励直接入账，不受低信任度减半影响（保证与文案数字一致）
    gameStats.budget += s.budget;
    document.getElementById('budget').textContent = gameStats.budget + '万欧元';
    renderMainlineCard('赛季结算', s.text, [{ text: '确认', onClick: proceedAfterSeason }]);
}

document.getElementById('season-result-continue').addEventListener('click', function() {
    document.getElementById('season-result-modal').classList.add('hidden');
    // 遗憾离场卡片：点继续进入预先确定的普通结局
    if (pendingSeasonResultContinue) {
        const cb = pendingSeasonResultContinue;
        pendingSeasonResultContinue = null;
        cb();
        return;
    }
    if (gameStats.difficulty === 'easy') {
        showEnding(getSeasonEndingKey());
    } else if (gameStats.season >= 5) {
        showEnding('surprise');
    } else {
        startNewSeason();
    }
});

function showSeasonTransition(completedSeason) {
    isSeasonTransition = true;
    document.getElementById('match-result-title').textContent = `第 ${completedSeason} 赛季结束`;
    matchResultText.innerHTML = `
        <div class="season-end-note">
            <p>五个赛季中的第 ${completedSeason} 个已结束。</p>
            <p class="season-end-sub">各项数值将延续至下一赛季，积分与排名将重新计算。</p>
        </div>
    `;
    matchResultModal.classList.remove('hidden');
}

function doSeasonEnd() {
    // 球员成长值每赛季自然 +1（上限10）
    for (const id of gameStats.signedPlayers) {
        initPlayerGrowth(id);
        gameStats.playerGrowth[id] = Math.min(10, gameStats.playerGrowth[id] + 1);
    }
    if (gameStats.ranking === 1) { gameStats.scudettoCount++; (gameStats.scudettoSeasons || (gameStats.scudettoSeasons = [])).push(gameStats.season); } // 本赛季联赛夺冠，累计意甲冠军数 + 记录夺冠赛季号（旧存档无此字段时兜底初始化）
    // 意甲冠军庆祝私信（消息41–47）：每次夺冠都对「在队且没发过」的球员补发 ——
    // 即每名球员「入队后的第一个意甲冠军」触发一次（deliverEmail 幂等：首冠已发过的球员第二冠不重复；后入队的球员在其首冠时补上）
    if (gameStats.ranking === 1) {
        const _has = id => gameStats.signedPlayers.includes(id);
        if (_has('maestro')) deliverEmail('firstScudettoIbra');           // 41 伊布
        if (_has('cm_youth_it')) deliverEmail('firstScudettoTonali');     // 42 托纳利
        if (_has('winger_pt')) deliverEmail('firstScudettoLeao');         // 43 莱奥
        if (_has('gk_talent')) deliverEmail('firstScudettoMaignan');      // 44 麦尼昂
        if (_has('striker_fr')) deliverEmail('firstScudettoGiroud');      // 45 吉鲁
        if (_has('daniel_maldini')) deliverEmail('firstScudettoDaniel');  // 46 丹尼尔
        deliverEmail('firstScudettoCalabria');                           // 47 卡拉布里亚（常驻，仅首冠发一次）
    }
    if (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion') gameStats.uclTitleCount++; // 累计欧冠冠军数
    // 欧冠冠军庆祝私信（消息81–86，1–4赛季）：每次夺冠都对「在队且没发过」的球员补发 ——
    // 即每名球员「入队后的第一个欧冠冠军」触发一次（deliverEmail 幂等，同意甲庆祝逻辑）
    if (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion' && gameStats.season <= 4) {
        const _hu = id => gameStats.signedPlayers.includes(id);
        deliverEmail('firstUclSinger');                          // 81 戈登·辛格（常驻，仅首冠发一次）
        if (_hu('cm_youth_it')) deliverEmail('firstUclTonali');  // 82 托纳利
        if (_hu('maestro')) deliverEmail('firstUclIbra');        // 83 伊布
        if (_hu('cb_den')) deliverEmail('firstUclKjaer');        // 84 克亚尔（需19）
        if (_hu('lb_winger')) deliverEmail('firstUclTheo');      // 85 特奥
        if (_hu('winger_pt')) deliverEmail('firstUclLeao');      // 85 莱奥
        deliverEmail('firstUclMassara');                         // 86 马萨拉（常驻，仅首冠发一次）
        deliverEmail('firstUclAtalanta');                        // 87 亚特兰大（常驻，仅首冠发一次）
        // 89 AC米兰（俱乐部之声）：魔力电话触发后的首个欧冠冠军（解锁前的夺冠不发；解锁后第一次夺冠即发，幂等仅一次）
        if (gameStats.magicPhoneUnlocked) deliverEmail('firstUclMagic');
    }
    if (gameStats.season === 4 && gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion') gameStats.s4WonUcl = true; // 第四赛季欧冠夺冠快照，供邮件28/29二选一
    gameStats.lastSeasonWonUcl = (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion'); // 记「上赛季是否夺欧冠」，供下赛季签约谈判话术
    if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) {
        // 隐藏结局：任期内至少 4 次意甲冠军 + 至少 2 次欧冠冠军，优先于任务判定
        if (gameStats.scudettoCount >= 4 && gameStats.uclTitleCount >= 2) { showEnding('tomorrow'); return; }
        // 完成第五赛季任务（不满值<5 且 排名≤4）→ 特殊结局（主卡→尾声）；未完成 → 遗憾离场 → 普通结局
        const intro = seasonIntros[5];
        if (intro && intro.taskCheck && intro.taskCheck()) { showEnding('surprise'); }
        else { showRegretCard(getSeasonEndingKey()); }
        return;
    }
    if (gameStats.season === 1 && gameStats.ranking === 1) { showScudetto1ThenResult(); return; }
    const intro = seasonIntros[gameStats.season];
    if (intro && intro.taskCheck) { showSeasonResult(intro.taskCheck()); return; }
    if (gameStats.difficulty === 'easy') { showEnding(getSeasonEndingKey()); return; }
    showSeasonTransition(gameStats.season);
}

// 第 38 轮收尾：所有赛后事件展示完后，回主界面把八个事件按钮置灰、"开始比赛"改为"结束赛季"；
// 点击"结束赛季"（见 start-match 监听）才真正进入赛季结算 doSeasonEnd。
let seasonEndPending = false;
let afterUclFinalSeasonEnd = false; // R38 最后一战踢完后接赛季收尾的标记（见 uclCloseToGame）
function enterSeasonEndState() {
    matchResultModal.classList.add('hidden');
    matchResultModal.classList.remove('weekly');
    randomEventModal.classList.add('hidden');
    eventOptions.classList.add('hidden');
    // 私信29（AC米兰·再见面的那天）：第五赛季第38轮送达。R38 收尾流程（closeResultBtn 直接进赛季结算）
    // 不经过 selectRandomEvents，故必须在此送达；否则真机永远收不到。
    if (gameStats.season === 5 && gameStats.round >= 38 && !(gameStats.deliveredEmails && gameStats.deliveredEmails.milanFarewell)) deliverEmail('milanFarewell');
    eventBtns.forEach(btn => { btn.disabled = true; btn.style.backgroundColor = '#ccc'; });
    seasonEndPending = true;
    startMatchBtn.textContent = '结束赛季';
    startMatchBtn.disabled = false;
}

// R38 赛季收尾：强制触发所有未展示的主线链式事件（如 euroNight2 → farewell），全部展示完再进入"结束赛季"待点击状态
function proceedSeasonEndR38() {
    const pendingMainlineIdx = gameStats.futureRandomEvents.findIndex(e =>
        randomEvents[resolveEventEntry(e)]?.mainline
    );
    if (pendingMainlineIdx !== -1) {
        const pending = gameStats.futureRandomEvents.splice(pendingMainlineIdx, 1)[0];
        currentRandomEvents = [resolveEventEntry(pending)];
        randomEventIndex = 0;
        pendingSeasonEndCallback = enterSeasonEndState;
        showNextRandomEvent();
        return;
    }
    enterSeasonEndState();
}

closeResultBtn.addEventListener('click', function() {
    matchResultModal.classList.add('hidden');
    matchResultModal.classList.remove('weekly');

    if (isSeasonTransition) {
        isSeasonTransition = false;
        startNewSeason();
        return;
    }

    if (gameStats.round >= 38) {
        // 联赛全部结束后：若还有欧冠决赛未踢，先打"最后一战"，再进入赛季收尾
        if (gameStats.hasUCL && gameStats.uclStage === 'final') {
            afterUclFinalSeasonEnd = true;
            showUclFinalCard();
            return;
        }
        proceedSeasonEndR38();
        return;
    }

    applyWarningEffects();
    if (gameStats.gameEnded) return;
    // 德比赛果弹窗最高优先级：赛后立即触发，先于预警弹窗与主线，不顺延到下一回合
    const derbyQueue = [];
    if (gameStats.derbyWinEventPending) { gameStats.derbyWinEventPending = false; derbyQueue.push('derbyWin'); }
    if (gameStats.derbyLossEventPending) { gameStats.derbyLossEventPending = false; derbyQueue.push(17); }
    if (derbyQueue.length) {
        afterDerbyCallback = runPostMatchFlow; // 德比看完 → 预警弹窗 + 主线/随机
        currentRandomEvents = derbyQueue;
        randomEventIndex = 0;
        showNextRandomEvent();
        return;
    }
    runPostMatchFlow();
});

// 赛后预警弹窗 + 随机/主线事件（德比弹窗之后接续）
function runPostMatchFlow() {
    pendingWarnings = getNewWarnings();
    if (gameStats.media > 80 && !gameStats.warningEventShown) {
        gameStats.warningEventShown = true;
        pendingWarnings.push(statWarningEvents.find(e => e.key === 'mediaHigh'));
    }
    showNextPendingWarning();
}

// 重新开始游戏
document.getElementById('restart-game').addEventListener('click', function() {
    stopEndingImageSequence();
    // 图鉴预览：有后续尾声卡片则链式展示（主卡点“继续”→尾声卡），否则返回结局图鉴
    if (galleryPreview) {
        const cur = galleryPreviewEnding;
        if (cur && cur.next && endings[cur.next]) {
            galleryPreviewEnding = endings[cur.next];
            renderEndingCard(galleryPreviewEnding, true);
            return;
        }
        galleryPreview = false;
        galleryPreviewEnding = null;
        document.getElementById('ending-modal').classList.add('hidden');
        renderGallery();
        document.getElementById('gallery-modal').classList.remove('hidden');
        return;
    }
    // 该结局有后续尾声卡片 → 先展示尾声，而非重新开始
    const ending = endings[currentEndingKey];
    if (ending && ending.next) { showEnding(ending.next); return; }
    document.getElementById('ending-modal').classList.add('hidden');
    matchResultModal.classList.add('hidden');
    matchResultModal.classList.remove('weekly');
    decisionPoints = 0;
    mainInterface.classList.add('hidden');
    setInMain(false);
    difficultySelection.classList.add('hidden');
    document.getElementById('test-notice-modal').classList.add('hidden');
    eventModal.classList.remove('hidden'); // 重新开始跳过创作者声明，直接到马尔蒂尼上任
});

// 官方公告卡（结局卡片样式）：赛季号 → 显示用赛季年份（意甲冠军差分文案用）
const SCUDETTO_SEASON_YEARS = { 1: '2018/2019', 2: '2019/2020', 3: '2020/2021', 4: '2021/2022', 5: '2022/2023' };
// 第五赛季点击"结束赛季"后展示：正文按玩家任期内实际夺得意甲冠军的赛季生成差分文案
function showAnnouncementCard() {
    const years = (gameStats.scudettoSeasons || []).slice().sort((a, b) => a - b).map(s => SCUDETTO_SEASON_YEARS[s]).join('、');
    const p2 = years
        ? `我们感谢他在这个职位上多年以来的贡献，帮助AC米兰重返欧洲冠军联赛和赢得${years}赛季意甲联赛的冠军。`
        : '我们感谢他在这个职位上多年以来的贡献，帮助AC米兰重返欧洲冠军联赛。';
    document.getElementById('announcement-text').innerHTML =
        `<p>AC米兰足球俱乐部宣布，保罗·马尔蒂尼于2023年6月5日起结束了他在俱乐部的任职。</p>
        <p>${p2}</p>
        <p>他的职责将分配给一个直接向首席执行官汇报的，与一线队主教练密切合作的综合工作组。</p>`;
    document.getElementById('announcement-modal').classList.remove('hidden');
}
document.getElementById('announcement-view-ending').addEventListener('click', () => {
    document.getElementById('announcement-modal').classList.add('hidden');
    doSeasonEnd();
});

// 开始比赛
startMatchBtn.addEventListener('click', function() {
    // 第 38 轮收尾：按钮已变"结束赛季"，点击进入赛季结算而非打比赛
    if (seasonEndPending) {
        seasonEndPending = false;
        startMatchBtn.textContent = '开始比赛';
        if (gameStats.season === 5) { showAnnouncementCard(); return; } // 第五赛季：先展示官方公告卡，点「查看结局」再进入真正的赛季结算
        doSeasonEnd();
        return;
    }
    startMatchBtn.disabled = true;
    weekForumReplies = []; // 本周开赛：清空论坛回复去重记录（本周两场不抽同一句）
  try {
    const opponentName1 = drawOpponent();
    const matchResult1 = playRound(opponentName1);
    gameStats.round = Math.min(38, gameStats.round + 1);
    updateScoreboard();
    if (matchResult1 === null) return;
    matchHistory.push({ round: gameStats.round, opponent: opponentName1, result: matchResult1.result, score: matchResult1.score });

    const opponentName2 = drawOpponent();
    const matchResult2 = playRound(opponentName2);
    gameStats.round = Math.min(38, gameStats.round + 1);
    updateScoreboard();
    eventOptions.classList.add('hidden');
    if (matchResult2 === null) return;
    matchHistory.push({ round: gameStats.round, opponent: opponentName2, result: matchResult2.result, score: matchResult2.score });

    showWeeklyReport(matchResult1, matchResult2);

    if (gameStats.round >= 38) {
        eventBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
        });
        startMatchBtn.disabled = true;
    }
  } catch (err) {
    // 安全网：开始比赛过程中若有异常，别让按钮卡死，记录到控制台便于排查
    console.error('开始比赛出错：', err);
    startMatchBtn.disabled = false;
  }
});

// ===== 公共工具 =====
const chineseNums = ['一','二','三','四','五','六','七','八','九','十'];
const toChineseNum = n => chineseNums[n - 1] || String(n);

function closeOnOverlayClick(modalId) {
    const el = document.getElementById(modalId);
    el.addEventListener('click', e => { if (e.target === el) el.classList.add('hidden'); });
}
closeOnOverlayClick('schedule-modal');
closeOnOverlayClick('history-modal');
closeOnOverlayClick('archive-modal');
closeOnOverlayClick('gallery-modal');
closeOnOverlayClick('standings-modal');

