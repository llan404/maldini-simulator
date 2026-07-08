// 获取元素
const eventModal = document.getElementById('event-modal');
const closeEventBtn = document.getElementById('close-event');
const difficultySelection = document.getElementById('difficulty-selection');
const selectDifficultyBtns = document.querySelectorAll('.select-difficulty');
const mainInterface = document.getElementById('main-interface');
const eventBtns = document.querySelectorAll('.event-btn');
const decisionPointsSpan = document.getElementById('decision-points');
const startMatchBtn = document.getElementById('start-match');
const eventOptions = document.getElementById('event-options');
const eventDescription = document.getElementById('event-description');
const optionButtons = document.getElementById('option-buttons');

let decisionPoints = 0;
let lastOpponentName = '';
let gameStats = {
    trust: 50,
    media: 50,
    fans: 50,
    player: 50,
    budget: 1000,
    points: 0,
    ranking: 0,
    round: 0,
    lastScore: '-',
    lastOpponentDisplay: '',
    deliveredEmails: {}, // 已送达的触发型邮件：{ trigger: true }；无 trigger 的邮件始终可见
    architectureRound: 0, // 邮件14（架构思考）送达回合，+2 后送达邮件15/16；0=未送达
    notifyPrefs: { email: true, dm: true, forum: true, players: true }, // 各终端分区通知开关（开+有未读 → 主按钮红点）
    consecutiveNonWins: 0,
    consecutiveLosses: 0,
    usedRandomEvents: [],
    southStandEventUsed: false,
    betKingEventUsed: false,
    rebateEventCount: 0,
    randomPity: 0,
    transferEventUsed: false,
    carCrashEventUsed: false,
    sinkOrSwimEventUsed: false,
    bigDataEventUsed: false,
    derbyLossEventPending: false,
    derbyWinEventPending: false,
    warningEventShown: false,
    gameEnded: false,
    season: 1,
    futureRandomEvents: [],
    usedMainlineEvents: [],
    newCoachDone: false,
    xmasDone: false,
    oldFriendDone: false,
    winterWindowDone: false,
    winterSlotBonus: 0,
    winterNoBudget: false,
    winterReturnCost: 0,
    winterReturnIntent: 0, // 06 伊布初始意向：拨通电话→100 / 经纪人→40 / 放弃→0（随「曾经的传奇」选择）
    signedPlayers: [],
    news01Pending: false,
    news01Done: false,
    ibraNewsPending: false,
    ibraNewsDone: false,
    effectiveDone: false,
    lockerBrawlPending: false,
    lockerBrawlDone: false,
    supportTaskActive: false,
    zlatanSupport: 0,
    wonScudetto1: false,
    hasUCL: false,
    uclBanNextSeason: false,
    uclFixtures: null,
    uclStage: null,
    uclQualified: false,
    uclGroupPos: 0,
    uclOutRound: 0,
    euroType: 'ucl',
    lastSeasonRanking: 0,
    uclTagShown: false,
    mug1Done: false,
    mug2Done: false,
    mugPactDone: false,
    mugPactPending: false,
    eslDone: false,
    esl2Pending: false,
    esl2Done: false,
    eslResolution: '',
    eslResolutionDone: false,
    sameNameDone: false,
    player07WinterCost: 0,
    player07Trust: 0,
    player07Removed: false,
    player01Trust: 0,
    emoOutburstDone: false,
    nextLeftBack3Done: false,
    transferRumorDone: false,
    donnaNegoDone: false,
    summerWarnShown: false,
    winterWarnShown: false,
    player21Discount: 0,
    force21Window: false,
    forceWindowPlayers: [],      // 下个转会窗保证出现的球员id（如消息64球探引荐，仅一窗后清空；情报另存 transferIntel 持久）
    scout64Pending: null,        // 消息64：选「感兴趣」后待下一轮下发「球员条件」私信 {playerId,round}
    scout64ActiveId: null,       // 消息64：当前交涉中的球员id（非空=进行中，未结束前不引荐下一位；跨赛季保留）
    scout64Offered: [],          // 消息64：已引荐过的 NPC id（不重复引荐）
    scout64SeasonCount: 0,       // 消息64：本赛季已引荐人数（上限 SCOUT64_MAX_PER_SEASON，赛季初重置）
    scoutOfferSeasonCount: 0,    // 私信60·AAA球探：本赛季已求购人数（上限 SCOUT_OFFER_MAX_PER_SEASON，赛季初重置）
    donnaLeftFreeRound: 0,
    calhaLeftRound: 0,
    s4WonUcl: false,
    lastSeasonWonUcl: false,     // 上赛季是否夺欧冠（签约谈判·话术「更多冠军」可用条件）
    transferIntel: [],           // 已在对话中获得情报的球员id（签约谈判·情报加持可用，后续剧情补充）
    starterPromise: [],          // 谈判中「许诺首发位置」过的球员id（终端球员档案显示淡红「首发」标签）
    playerGrowth: {},            // 已签球员成长值 id→1~10（青年初始1/老将初始5；每赛季+1；欧冠标签球员之和→欧冠胜率加成）
    forumPosts: [],              // 球迷论坛动态帖子（每场联赛后生成：{from,broadcast,replies[],round,unread}；新帖在前）
    dynamicDMs: [],              // 运行时生成的私信（如消息60·球探求购，带 trigger 记送达时间；随 gameStats 存档）
    purchasePrice: {},           // 已签球员实际成交价 id→万欧元（含谈判加价；供消息60求购报价 ×1.1）
    scoutSellable: [],           // AAA球探求购回复「我会考虑的」的球员id → 终端球员档案显示「出售」按钮
    soldPlayers: [],             // 已「出售」套现移出的球员id（不再回到转会窗）
    buyoutTomoriDone: false,
    overtimeFineUsed: false,
    homeVisitUsed: false,        // 亲自登门「我想把你带到米兰」是否已用（中等=每赛季重置/困难=全程一次；简单不读此字段）
    leaoNewsPending: false,
    leaoNewsDone: false,
    betKing1Done: false,
    betKing2Done: false,
    betKing3Done: false,
    betKingSkip: false,
    betKingResolved: false,
    farCallDone: false,
    magicPhoneUnlocked: false,
    magicPhoneUses: 0,
    scudettoCount: 0,
    uclTitleCount: 0,
    season4TitlesBefore: 0,
    uclReachedFinal: false,
    uclFinalCount: 0, // 累计进入欧冠决赛次数（不随赛季重置），>1 时「最后一战」旁白改为「缺乏经验」版
    suspicion: 0,
    hesitantContract1Done: false,
    hesitantContract2Done: false,
    hesitantContract2Pending: false,
    omniscient1Done: false,
    omniscient2Done: false,
    pressOfficerDone: false,
    nextLeftBack4Done: false,
    leftBack4Resolved: false,
    southStandTalkDone: false,
    southStandPending: false,
    footballDisputeDone: false,
    deadEndDone: false,
    godByeDone: false,
    lastMatchLost: false,
    shownWarnings: {
        trustCrisis: false, trustCritical: false,
        mediaCrisis: false, mediaCritical: false,
        playerCrisis: false, playerCritical: false,
        fansCrisis: false, fansCritical: false
    }
};

// 事件数据
const events = {
    1: {
        description: "在每周的周例会上，你向管理层进行汇报的风格是：",
        options: [
            { text: "保守", effects: { trust: 2, fans: 2,media: -4 } },
            { text: "激进", effects: { trust: -6, media: 6 } }
        ]
    },
    2: {
        description: "向球队董事会申请预算时，你的计划是：",
        options: [
            { text: "谨慎", effects: { trust: -2, budget: 100 } },
            { text: "大胆", effects: { trust: -8, budget: 300 } }
        ]
    },
    3: {
        description: "进行常规新闻发布会时，你的风格是：",
        options: [
            { text: "标准", effects: { media: 2, trust: 2, player: -1 } },
            { text: "主动", effects: { media: 6, trust: -4, fans: 3 } },
            { text: "指责对手", effects: { media: 9, trust: -7, player: -4 } }
        ]
    },
    4: {
        description: "媒体邀请你参加赛后的深度采访时，你的选择是：",
        options: [
            { text: "参加", effects: { media: 5, player: -3, fans: 3 } },
            { text: "拒绝", effects: { media: -4, player: 2 } }
        ]
    },
    5: {
        description: "赛前最后一次集合时，你需要对球员做出一些鼓励，你的选择是：",
        options: [
            { text: "鼓励全队", effects: {fans: 2 } },
            { text: "激励关键球员", effects: { player: 3, trust: -5} }
        ]
    },
    6: {
        description: "你需要对球队近一段时间的表现做出内部总结时：",
        options: [
            { text: "正面鼓励", effects: { player: 3, trust: -4 ,fans: 2} },
            { text: "严厉批评", effects: { player: -6, trust: 3, fans: 5 } }
        ]
    },
    7: {
        description: "在下一场比赛来临之前，你决定对阵容提出一些意见：",
        options: [
            { text: "大幅轮换", effects: { player: 3, fans: -6, trust: -2 } },
            { text: "固定主力", effects: { player: -4, fans: 6, media: -2 } }
        ]
    },
    8: {
        description: "部分经纪人想提升球员年薪，你对球员合同谈判态度是：",
        options: [
            { text: "宽松", effects: { player: 4, trust: -6, budget: -200 } },
            { text: "强硬", effects: { player: -4, trust: 2, budget: 300 } }
        ]
    }
};

// ===== randomEvents（随机事件 + 主线/新闻事件）已拆分 =====
// 随机事件 → eventContent.js；主线/新闻 → mainlineContent.js（Object.assign 追加）。两者须先于 script.js 引入。

// 主线事件池 — 各赛季专属事件，仅在对应赛季内随机触发
const mainlineEventPools = {
    1: ['ffp1', 'euroNight1'],
    2: [], 3: [], 4: [], 5: []
};

// 各赛季主线事件的最早触发轮次（含）
const mainlineRoundConstraints = {
    1: { ffp1: 6, euroNight1: 26 }
};

// 赛季开始时必定推入 futureRandomEvents 的事件
const seasonStartEvents = {};

// 随机事件池中数字 ID 的预计算集合（排除链式命名事件）
const numericRandomEventIds = Object.keys(randomEvents).filter(id => !isNaN(parseInt(id)));

// 赛季开幕简报数据
const seasonIntros = {
    1: {
        title: '第一赛季·废墟上的人',
        tasks: () => [
            '赛季末预算不低于 2000w 欧',
            (pendingDifficulty || gameStats.difficulty) === 'hard' ? '排名不低于第 14 位' : '排名不低于第 10 位'
        ],
        taskCheck: () => gameStats.budget >= 2000 &&
            gameStats.ranking <= (gameStats.difficulty === 'hard' ? 14 : 10),
        description: [
            '你重新回到了米兰，新资方刚刚接管AC Milan，他们和你一样处处受限。因上个财年多次违反FFP（财政公平法案），欧足联对你们展开了数次调查，要求你们在限期内达到预算平衡，否则将对你们处以禁赛两个赛季作为惩罚。',
            '你必须立刻开始处理球队当中的问题球员，与此同时，管理层提出了要求，你需要在这个赛季内平衡好【预算】和【排名】之间的关系，好在，他们的要求并不是很高。'
        ]
    },
    2: {
        title: '第二赛季·青春风暴',
        tasks: ['拿到欧战资格（赛季末排名不低于第 6 位）'],
        taskCheck: () => gameStats.ranking <= 6,
        description: [
            '现在的米兰买不起经验丰富的知名球星。即使和经纪人谈判顺利，球员本人也会要求高薪资和战术地位。这两者都是米兰无法保证的，你选择将目光放在几位小将身上，遗憾的是，即使是初出茅庐的稍有潜力的小将，对米兰的预算来说也不便宜。管理层和球迷不允许你犯错，稍有不慎，你可能就会购入天价饮水机。',
            '你必须做出准确的判断，在【排名】更进一步的情况下，提升【球员状态】。'
        ]
    },
    3: {
        title: '第三赛季·重返欧冠',
        tasks: ['赛季末至少购入一名含【欧冠】标签的球员', '联赛排名不低于第 4 位'],
        taskCheck: () => gameStats.ranking <= 4 && gameStats.signedPlayers.some(id => {
            const p = transferBuyPlayers.find(b => b.id === id);
            return p && p.uclTag;
        }),
        description: () => gameStats.lastSeasonRanking <= 4 ? [
            '上赛季的默契配合让你们获得了重返欧冠赛场的机会！米兰这支球队已经多年没有踏上过欧冠的赛场，无论是队员、教练，还是你自己，都对此感到非常振奋。',
            '欧冠的赛程会和联赛赛程有一些冲突，尤其在赛程的后半段，有时，您需要在【联赛排名】和【欧冠表现】两者之间进行选择。',
            '在欧冠赛场获得胜利，将会给球队带来巨额奖金和高曝光，但同时，如果在赛场中失利，也会给球队的信心带来一些打击。'
        ] : [
            '上赛季的排名让你们有了参与欧联赛场的资格！欧联赛程会和意甲赛程有一些冲突，尤其在赛程的后半段，有时，您需要在【联赛排名】和【欧联表现】两者之间进行选择。',
            '在欧战赛场获得胜利，将会给球队带来巨额奖金和高曝光，但同时，如果在赛场中失利，也会给球队的信心带来一些打击。',
            '管理层和球迷都希望这个赛季，米兰能拿到欧冠的入场券。',
            '您可以在【赛程】中查看欧联赛场的对手，提高【球员状态】和购入含有【欧冠】标签的球员，会给赛场表现带来一些帮助。'
        ]
    },
    4: {
        title: () => {
            const n = gameStats.season4TitlesBefore;
            return n === 0 ? '第四赛季·迟来的冠军'
                : n === 1 ? '第四赛季·第二个冠军'
                : n === 2 ? '第四赛季·第三个冠军'
                : '第四赛季·剑指欧冠';
        },
        tasks: () => {
            const n = gameStats.season4TitlesBefore;
            if (n >= 3) return ['本赛季进入【欧冠决赛】'];
            const ord = ['一', '二', '三'][n] || String(n + 1);
            return [`获得第${ord}个意甲冠军（赛季末联赛排名第 1）`];
        },
        taskCheck: () => gameStats.season4TitlesBefore >= 3
            ? gameStats.uclReachedFinal
            : gameStats.ranking === 1,
        description: () => {
            const n = gameStats.season4TitlesBefore;
            if (n === 0) return [
                '时机成熟……是时候朝着意甲冠军进发了！球员之间的配合已经逐渐稳定，你们不再是一只被拼凑起来的球队，而是意甲中不容小觑的队伍。米兰的球员渴望登上那辆游行大巴，在米兰城中举行冠军巡游，让米兰红黑色的旗帜掠过白色大教堂的尖顶……',
                '在这个赛季，球迷和管理层都希望米兰能够获得那个迟来的【意甲冠军】。'
            ];
            if (n === 1) return [
                '米兰离第二颗星只有一步之遥，这是过去十年里你们离这个机会最近的一次。球员之间的配合已经逐渐稳定，你们不再是一只被拼凑起来的球队，而是意甲中不容小觑的队伍。米兰的球员再次渴望登上那辆游行大巴，在米兰城中举行冠军巡游，让米兰的红黑色的旗帜掠过白色大教堂的尖顶……',
                '在这个赛季，球迷和管理层都希望你们能为米兰绣上【第二颗星】。'
            ];
            if (n === 2) return [
                '米兰几乎称霸了这几年的意甲，意媒称现在的意甲为“米兰时代”，球迷们希望你能复刻AC Milan的统治时期，他们想象中的黄金年代。米兰已经顺利绣上了第二颗星星，你们还能更进一步，获得第三个【意甲冠军】吗？'
            ];
            return [
                '米兰在之前的三个赛季实现了三连冠！这一切和你的到来密不可分，相比其他球队总监，你能更轻易地买来想要的球员——他们都想来米兰。更衣室的矛盾和球场上的冲突对你来说更是小问题，在球员时代你就学会了如何处理这些。',
                '米兰在你的帮助下已经迅速离开了之前的泥潭，现在，你们有一个看似难以实现的目标：进入【欧冠决赛】。',
                '您可以通过选择策略来帮助球队平衡欧冠与联赛对球员状态的消耗。'
            ];
        }
    },
    5: {
        title: '第五赛季·红鸟的不满',
        tasks: [
            '和红鸟资本谈判中，保持【不满值】小于 5 点',
            '赛季结束时，排名不低于第 4 位'
        ],
        taskCheck: () => gameStats.suspicion < 5 && gameStats.ranking <= 4,
        description: [
            '美国红鸟资本即将入主米兰，上赛季结尾时被球迷津津乐道的投资有了结果，新资方会给球队带来各方面的改变。你们在上个赛季刚获得意甲冠军，球迷们希望能维持向前的势头，教练则期待着阵容的进一步补强。',
            '你需要重新与资方的管理层建立联系，<span class="highlight-red">新的谈判</span>将会决定你们双方在球队管理上的话语权。你摸不准新资方的想法，但要是双方的裂痕扩大到一定程度，你可能会是最先离开的那个。'
        ]
    }
};

let pendingDifficulty = null;
let pendingSeasonEndCallback = null;

// ===== endings（结局文案）已拆分至 endingContent.js（须先于 script.js 引入）=====

// 返回触发的结局 key（优先级：trust -> media -> fans -> player），否则返回 null
function getTriggeredEndingKey() {
    if (gameStats.trust <= 0) return 'trust';
    if (gameStats.media <= 0) return 'media';
    if (gameStats.fans <= 0) return 'fans';
    if (gameStats.player <= 0) return 'player';
    return null;
}

function getSeasonEndingKey() {
    if (gameStats.round < 38) return null;
    if (gameStats.trust < 30) return 'seasonTrust';
    if (gameStats.media < 30) return 'seasonMedia';
    if (gameStats.fans < 30) return 'seasonFans';
    if (gameStats.player < 30) return 'seasonPlayer';
    if (gameStats.trust > 80) return 'seasonTrustHigh';
    if (gameStats.fans > 80) return 'seasonFansHigh';
    if (gameStats.player > 80) return 'seasonPlayerHigh';
    if (gameStats.media > 80) return 'seasonMediaHigh';
    return 'seasonGood';
}

function resolveCurrentEndingKey() {
    const direct = getTriggeredEndingKey();
    if (direct) return direct;
    if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) return 'surprise';
    if (gameStats.trust < 30) return 'seasonTrust';
    if (gameStats.media < 30) return 'seasonMedia';
    if (gameStats.fans < 30) return 'seasonFans';
    if (gameStats.player < 30) return 'seasonPlayer';
    if (gameStats.trust > 80) return 'seasonTrustHigh';
    if (gameStats.fans > 80) return 'seasonFansHigh';
    if (gameStats.player > 80) return 'seasonPlayerHigh';
    if (gameStats.media > 80) return 'seasonMediaHigh';
    return 'seasonGood';
}

const teams = [
    { name: '尤文图斯', category: 'strong' },
    { name: '那不勒斯', category: 'strong' },
    { name: '国际米兰', category: 'strong' },
    { name: '罗马', category: 'strong' },
    { name: '拉齐奥', category: 'strong' },
    { name: '亚特兰大', category: 'mid' },
    { name: '佛罗伦萨', category: 'mid' },
    { name: '都灵', category: 'mid' },
    { name: '桑普多利亚', category: 'mid' },
    { name: '萨索洛', category: 'mid' },
    { name: '热那亚', category: 'mid' },
    { name: '博洛尼亚', category: 'mid' },
    { name: '卡利亚里', category: 'low' },
    { name: '乌迪内斯', category: 'low' },
    { name: '斯帕尔', category: 'low' },
    { name: '弗罗西诺内', category: 'low' },
    { name: '恩波利', category: 'low' },
    { name: '切沃', category: 'low' }
];

// 意乙系球队名单（不在第一赛季初始意甲中的队）：第一赛季初始意甲固定补入"科莫"，其余 6 队构成初始意乙池
const serieBTeams = ['帕尔马', '科莫', '威尼斯', '克雷莫纳', '卡坦扎罗', '巴勒莫', '布雷西亚'];

// 第一赛季初始意甲固定补入的意乙队
const FIRST_PROMOTED = '科莫';

// 升降级全集（不含 AC Milan）= teams 18 支 + 意乙系 7 支（含科莫）= 25 支，固定不变。
// 任一时刻：意甲池 serieATeams 恒 19 支；意乙池 = 全集中不在 serieATeams 的队（恒 6 支）。
// 升降级即在这 25 支之间循环搬运，因此降级队会回到意乙池、下赛季可再升（球队 category 始终保留）。
const allLeagueTeams = teams.concat(serieBTeams.map(name => ({ name, category: 'low' })));

// 当前意甲池（不含 AC Milan），随升降级动态变化；新游戏时为 teams + 科莫
let serieATeams = teams.map(t => ({ ...t }));

// 球队队徽（SVG 文件夹；文件名见实际文件）。无对应文件的球队（欧战对手等）不显示图标
const teamCrests = {
    'AC Milan': 'ACM.svg',
    '尤文图斯': 'juventus-4.svg',
    '那不勒斯': 'napoli-1.svg',
    '国际米兰': 'inter-milan-2021.svg',
    '罗马': 'as-roma-1.svg',
    '拉齐奥': 'lazio.svg',
    '亚特兰大': 'Atalanta-BC-v1993.svg',
    '佛罗伦萨': 'ACF-Fiorentina-v2003.svg',
    '都灵': 'torino-fc.svg',
    '桑普多利亚': 'Unione-Calcio-Sampdoria-v1997.svg',
    '萨索洛': 'US-Sassuolo-Calcio-v2010.svg',
    '热那亚': 'Genoa-CFC-v1998.svg',
    '博洛尼亚': 'bologna-fc-1.svg',
    '卡利亚里': 'Cagliari-Calcio-v2015.svg',
    '乌迪内斯': 'Udinese-Calcio-v2010.svg',
    '弗罗西诺内': 'Frosinone-Calcio-v2011.svg',
    '恩波利': 'Empoli-FC-v2021.svg',
    '切沃': 'AC_Chievo_Verona.svg',
    '帕尔马': 'Parma-Calcio-1913-v2016.svg',
    '斯帕尔': 'spal.svg',
    '科莫': 'Como-1907-v2019-mono.svg',
    '威尼斯': 'Venezia-FC-v2022.svg',
    '克雷莫纳': 'US-Cremonese-v1997.svg',
    '卡坦扎罗': 'US-Catanzaro-1929-v2018.svg',
    '巴勒莫': 'Palermo-FC-v2019.svg',
    '布雷西亚': 'brescia.svg'
};
// 队徽所在目录（意甲队徽在 SVG/SA/、欧战队徽在 SVG/E/；如再移动只改这两处）
const CREST_DIR = 'SVG/SA/';
const EURO_CREST_DIR = 'SVG/E/';

// 欧冠/欧联球队队徽（意甲队仍走 teamCrests）。文件见 SVG/E/
const euroCrests = {
    '皇家马德里': 'Real-Madrid-CF-v2002.svg', '曼城': 'Manchester-City-v2016.svg',
    '拜仁慕尼黑': 'FC-Bayern-Munchen-v2024.svg', '利物浦': 'Liverpool-Football-Club-v2024-minor.svg',
    '巴黎圣日尔曼': 'Paris-Saint-Germain-v2013.svg', '切尔西': 'Chelsea-FC-v2006.svg',
    '马德里竞技': 'Atletico-Madrid-v2024.svg', '巴塞罗那': 'FC-Barcelona-v2002.svg',
    '多特蒙德': 'Borussia-Dortmund-v1993.svg', '热刺': 'Tottenham-Hotspur-Football-Club-v2006.svg',
    '阿贾克斯': 'AFC-Ajax-v1991.svg', '本菲卡': 'Sport-Lisboa-e-Benfica-v1999.svg',
    '波尔图': 'Futebol-Clube-do-Porto-v2002.svg', '莱比锡红牛': 'RB-Leipzig-v2020.svg',
    '舍里夫': 'sheriff-3.svg', '布鲁日': 'Club-Brugge-KV-v2017.svg',
    '萨尔茨堡红牛': 'Red-Bull-Salzburg-v2007.svg', '顿涅茨克矿工': 'shakhtar.svg',
    '萨格勒布迪纳摩': 'Logo_GNK_Dinamo_Zagreb_(2019).svg',
    '塞维利亚': 'Sevilla-Futbol-Club-v1995.svg', '曼联': 'Manchester-United-Football-Club-v1998.svg',
    '阿森纳': 'Arsenal-FC-v2002.svg', '法兰克福': 'Eintracht-Frankfurt-v1998.svg',
    '勒沃库森': 'Bayer-04-Leverkusen-v2006.svg', '皇家社会': 'Real-Sociedad-de-Futbol-v1997.svg',
    '西汉姆联': 'West-Ham-United-Football-Club-v2016.svg', '摩纳哥': 'AS-Monaco-v2021.svg',
    '费耶诺德': 'Feyenoord-Rotterdam-v2024.svg', '卡拉巴赫': 'Qarabag-FK-v0000.svg',
    '费伦茨瓦罗斯': 'ferencv-ros.svg'
};

// 队徽图片路径：先查意甲队徽（SVG/SA/），再查欧战队徽（SVG/E/）；都没有返回空串，由调用处兜底
function crestSrc(name) {
    if (teamCrests[name]) return CREST_DIR + teamCrests[name];
    if (euroCrests[name]) return EURO_CREST_DIR + euroCrests[name];
    return '';
}

let currentRandomEvents = [];
let randomEventIndex = 0;
let pendingWarnings = [];
let afterDerbyCallback = null; // 德比赛果弹窗结束后的接续（赛后：德比 → 预警 → 主线/随机）
let isSeasonTransition = false;
let matchSchedule = [];
let scheduleIndex = 0;
let pendingTransferSlots = 0;
let matchHistory = [];   // {round, opponent, result, score}
let choiceHistory = [];  // {round, eventName, optionText, effects}

const eventNames = {
    1:'周例会汇报', 2:'申请预算', 3:'新闻发布会', 4:'深度采访',
    5:'赛前鼓励',   6:'内部总结', 7:'阵容意见',   8:'合同谈判'
};

const categoryStrength = {
    strong: 1.0,
    mid: 0.65,
    low: 0.38
};

let leagueTeams = [];

function initializeLeague() {
    leagueTeams = [
        { name: 'AC Milan', category: 'strong', points: 0 }
    ];
    leagueTeams.push(...serieATeams.map(team => ({
        name: team.name,
        category: team.category,
        points: 0
    })));
}

// 当前意乙池 = 升降级全集中不在意甲池的队（恒 6 支，含上赛季的降级队）。
function getSerieBPool() {
    const aNames = serieATeams.map(t => t.name);
    return allLeagueTeams.filter(t => !aNames.includes(t.name));
}

// 赛季末升降级：意甲（除米兰）垫底 3 队降入意乙池，同时从意乙池抽 3 队补入意甲。
// 升级候选取自"重置 serieATeams 之前"的意乙池，因此本赛季降级的 3 队不会被立刻抽回；
// 它们被移出意甲后即自动归入意乙池（意乙池由 getSerieBPool 推导），下赛季可再升 —— 意乙池循环使用。
// 升降数 = min(3, 意乙池队数)，保证意甲始终 19 队（含 AC Milan 共 20），避免奇数导致排程崩溃。
function applyRelegation() {
    const pool = getSerieBPool();
    const n = Math.min(3, pool.length);
    if (n === 0) return;
    const ranked = leagueTeams.slice().sort((a, b) => b.points - a.points);
    const relegated = ranked.filter(t => t.name !== 'AC Milan').slice(-n).map(t => t.name);
    const survivors = serieATeams.filter(t => !relegated.includes(t.name));
    const promoted = pool.slice().sort(() => Math.random() - 0.5).slice(0, n).map(t => ({ ...t }));
    serieATeams = survivors.concat(promoted); // (19 - n) 留级 + n 升级 = 19；降级队移出后归入意乙池
}

function getTeamByName(name) {
    return leagueTeams.find(team => team.name === name);
}

function updateLeagueRanking() {
    leagueTeams.sort((a, b) => b.points - a.points);
    const rank = leagueTeams.findIndex(team => team.name === 'AC Milan') + 1;
    gameStats.ranking = rank === 0 ? 20 : rank;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getMatchProbability(teamA, teamB) {
    const strengthA = categoryStrength[teamA.category];
    const strengthB = categoryStrength[teamB.category];
    const drawRate = 0.2;
    const winA = (strengthA / (strengthA + strengthB)) * (1 - drawRate);
    return { winA, drawRate };
}

function simulateOtherMatches(excludedOpponentName) {
    const availableTeams = leagueTeams.filter(team => team.name !== 'AC Milan' && team.name !== excludedOpponentName);
    shuffleArray(availableTeams);
    // i + 1 < length：球队数为奇数时跳过最后一支，避免 teamB 为 undefined 崩溃
    for (let i = 0; i + 1 < availableTeams.length; i += 2) {
        const teamA = availableTeams[i];
        const teamB = availableTeams[i + 1];
        const prob = getMatchProbability(teamA, teamB);
        const random = Math.random();
        if (random < prob.winA) {
            teamA.points += 3;
        } else if (random < prob.winA + prob.drawRate) {
            teamA.points += 1;
            teamB.points += 1;
        } else {
            teamB.points += 3;
        }
    }
}

function getWinRate(category) {
    const statusBonus = (gameStats.player - 50) / 250;
    let difficultyBonus = 0;
    if (gameStats.difficulty === 'easy') {
        difficultyBonus = 0.12;
    } else if (gameStats.difficulty === 'hard') {
        difficultyBonus = -0.12;
    }
    if (category === 'strong') {
        return Math.min(0.88, Math.max(0.05, 0.30 + statusBonus + difficultyBonus));
    }
    if (category === 'mid') {
        return Math.min(0.88, Math.max(0.05, 0.48 + statusBonus + difficultyBonus));
    }
    return Math.min(0.88, Math.max(0.05, 0.65 + statusBonus + difficultyBonus));
}

function updateScoreboard() {
    document.getElementById('points').textContent = gameStats.points;
    document.getElementById('ranking').textContent = gameStats.ranking;
    document.getElementById('round').textContent = Number.isFinite(gameStats.round) ? gameStats.round : 0;
    const slashEl = document.querySelector('#round-value .slash');
    if (slashEl) {
        const multiSeason = gameStats.difficulty && gameStats.difficulty !== 'easy';
        slashEl.textContent = multiSeason ? `/38 · 第${gameStats.season}赛季` : '/38';
    }
    // 上一轮比赛结果：本赛季未开赛（lastScore 为空，仅第0轮）只显示淡灰占位标签；
    // 开赛后隐藏标签，比分居中放大，胜方比分标红。
    const hasMatch = gameStats.lastScore !== '';
    const scorePanel = document.querySelector('.last-score-panel');
    if (scorePanel) {
        const labelEl = scorePanel.querySelector('.panel-label');
        const valueEl = scorePanel.querySelector('.last-score-value');
        if (labelEl) labelEl.style.display = hasMatch ? 'none' : '';
        if (valueEl) valueEl.style.display = hasMatch ? '' : 'none';
    }
    document.getElementById('last-score-home').textContent = hasMatch ? 'AC Milan' : '';
    document.getElementById('last-score-away').textContent = hasMatch ? gameStats.lastOpponentDisplay : '';
    const homeGoalsEl = document.getElementById('score-home-goals');
    const awayGoalsEl = document.getElementById('score-away-goals');
    if (hasMatch) {
        const [h, a] = gameStats.lastScore.split(':');
        const hn = parseInt(h, 10), an = parseInt(a, 10);
        homeGoalsEl.textContent = h;
        awayGoalsEl.textContent = a;
        homeGoalsEl.classList.toggle('score-win', hn > an); // 胜方比分标红
        awayGoalsEl.classList.toggle('score-win', an > hn);
    } else {
        homeGoalsEl.textContent = '';
        awayGoalsEl.textContent = '';
        homeGoalsEl.classList.remove('score-win');
        awayGoalsEl.classList.remove('score-win');
    }
    // 比分两侧队徽：AC Milan—队徽—比分—对手队徽—对手名
    const setCrest = (id, name) => {
        const el = document.getElementById(id);
        if (name) { el.src = crestSrc(name); el.style.display = ''; el.onerror = () => { el.style.display = 'none'; }; }
        else { el.style.display = 'none'; el.removeAttribute('src'); }
    };
    setCrest('last-score-home-crest', hasMatch ? 'AC Milan' : null);
    setCrest('last-score-away-crest', hasMatch ? gameStats.lastOpponentDisplay : null);
    updateSuspicionCard();
}

// 红鸟的不满：仅第五赛季显示，点亮 suspicion 个红点
function updateSuspicionCard() {
    const card = document.getElementById('suspicion-card');
    if (!card) return;
    if (gameStats.season === 5) {
        card.classList.remove('hidden');
        card.querySelectorAll('.suspicion-dot').forEach((d, i) =>
            d.classList.toggle('lit', i < gameStats.suspicion));
    } else {
        card.classList.add('hidden');
    }
}

function playRound(opponentName) {
    let opponent = getTeamByName(opponentName);
    if (!opponent) {
        // 防御：赛程里的队已不在当前联赛（升降级不同步），改取一支有效对手，避免崩溃卡死
        const pool = leagueTeams.filter(t => t.name !== 'AC Milan');
        opponent = pool[Math.floor(Math.random() * pool.length)];
        opponentName = opponent.name;
        lastOpponentName = opponentName;
    }
    // 第二赛季第16轮（亚特兰大）： 0:5 
    const forcedLoss = gameStats.season === 2 && scheduleIndex === 16 && opponentName === '亚特兰大';
    const winRate = getWinRate(opponent.category);
    let drawRate = 0.18;
    if (winRate > 0.8) {
        drawRate = 0.12;
    } else if (winRate < 0.5) {
        drawRate = 0.22;
    }
    const random = Math.random();
    let result;
    if (forcedLoss) {
        result = 'loss';
    } else if (random < winRate) {
        result = 'win';
    } else if (random < winRate + drawRate) {
        result = 'draw';
    } else {
        result = 'loss';
    }

    let score;
    if (result === 'win') {
        const ourGoals = 1 + Math.floor(Math.random() * 4);        // 1–4
        const theirGoals = Math.floor(Math.random() * ourGoals);    // 0 至 ourGoals-1，严格小于
        score = `${ourGoals}:${theirGoals}`;
        gameStats.points += 3;
        gameStats.consecutiveNonWins = 0;
        gameStats.consecutiveLosses = 0;   // 赢球清零连败
        gameStats.southStandEventUsed = false;
        if (opponentName === '国际米兰') {
            gameStats.derbyWinEventPending = true;
        }
        if (gameStats.media > 80) {
            updateStat('fans', 10);
        } else {
            updateStat('fans', 5);
        }
    } else if (result === 'draw') {
        const goals = Math.floor(Math.random() * 3);
        score = `${goals}:${goals}`;
        gameStats.points += 1;
        opponent.points += 1;
        gameStats.consecutiveNonWins += 1;
        if (gameStats.media > 80) {
            updateStat('fans', -5);
        }
    } else {
        if (forcedLoss) {
            score = '0:5';
        } else {
            const theirGoals = 1 + Math.floor(Math.random() * 4);      // 1–4
            const ourGoals = Math.floor(Math.random() * theirGoals);    // 0 至 theirGoals-1，严格小于
            score = `${ourGoals}:${theirGoals}`;
        }
        opponent.points += 3;
        gameStats.consecutiveNonWins += 1;
        gameStats.consecutiveLosses += 1;   // 仅输球累加；平局不增不减（见 draw 分支）
        if (opponentName === '国际米兰') {
            gameStats.derbyLossEventPending = true;
        }
        if (gameStats.media > 80) {
            updateStat('fans', -10);
        } else {
            updateStat('fans', -5);
        }
    }

    const ourTeam = getTeamByName('AC Milan');
    ourTeam.points = gameStats.points;
    gameStats.lastScore = score;
    gameStats.lastOpponentDisplay = opponent.name;
    gameStats.lastMatchLost = (result === 'loss'); // 供"南看台的训话"等判断输球
    addMatchForumThread(opponent, result, score); // 球迷论坛赛果帖（联赛胜/负，平局暂不发）
    // 私信66/67（舍甫琴科·德比赛后点评）：消息65送达后的首次德比——赢→66，输或平→67（仅对首次德比生效）
    if (opponentName === '国际米兰' && gameStats.deliveredEmails && gameStats.deliveredEmails.shevaDerby
        && !gameStats.deliveredEmails.shevaDerbyWin && !gameStats.deliveredEmails.shevaDerbyLose) {
        if (result === 'win') deliverEmail('shevaDerbyWin');
        else deliverEmail('shevaDerbyLose'); // 输或平局 → 消息67
    }

    const prevRanking = gameStats.ranking;
    const pointsDelta = result === 'win' ? 3 : result === 'draw' ? 1 : 0;

    simulateOtherMatches(opponentName);
    updateLeagueRanking();
    updateScoreboard();

    if (pointsDelta > 0) showVariableChange('points', `+${pointsDelta}`, true);
    const rankingDelta = prevRanking - gameStats.ranking;
    if (rankingDelta !== 0) showVariableChange('ranking', rankingDelta > 0 ? `+${rankingDelta}` : `${rankingDelta}`, rankingDelta > 0);
    
    // 检查结局（比赛后统一判断触发哪一个结局）
    const endingKeyAfterMatch = getTriggeredEndingKey();
    if (endingKeyAfterMatch) {
        showEnding(endingKeyAfterMatch);
        return null; // 结局触发，不返回比赛结果
    }
    
    return { result, opponent, score };
}

// 将【文字】转为红色高亮 span，去除括号
function formatBrackets(text) {
    return text.replace(/【([^】]+)】/g, '<span class="highlight-red">$1</span>');
}

// 格式化effects
function formatEffects(effects) {
    const statNames = {
        trust: '董事会信任度',
        media: '媒体声望',
        fans: '球迷满意度',
        player: '球员状态',
        budget: '预算'
    };
    // 显示优先级：球员状态 > 董事会信任度 > 球迷满意度 > 媒体声望 > 预算
    const order = ['player', 'trust', 'fans', 'media', 'budget'];
    const keys = Object.keys(effects).sort((a, b) => {
        const ia = order.indexOf(a), ib = order.indexOf(b);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
    const parts = [];
    for (const stat of keys) {
        const delta = effects[stat];
        const sign = delta > 0 ? '+' : '';
        const name = statNames[stat] || stat;
        parts.push(`${name}${sign}${delta}`);
    }
    return parts.join(', ');
}

// 创作者声明"了解" → 马尔蒂尼上任
// 创作者声明：三角形按钮翻页（显示 1/2），底部「了解」关闭
(function () {
    const pages = [document.getElementById('test-notice-page-1'), document.getElementById('test-notice-page-2')];
    const prev = document.getElementById('tn-prev');
    const next = document.getElementById('tn-next');
    const ind = document.getElementById('tn-page-ind');
    let cur = 0;
    function show(i) {
        cur = Math.max(0, Math.min(pages.length - 1, i));
        pages.forEach((p, idx) => p.classList.toggle('tn-hidden', idx !== cur)); // 用 visibility 切换，隐藏页仍占位
        ind.textContent = `${cur + 1} / ${pages.length}`;
        prev.disabled = cur === 0;
        next.disabled = cur === pages.length - 1;
    }
    prev.addEventListener('click', () => show(cur - 1));
    next.addEventListener('click', () => show(cur + 1));
    show(0);
})();
document.getElementById('close-test-notice').addEventListener('click', function() {
    document.getElementById('test-notice-modal').classList.add('hidden');
    eventModal.classList.remove('hidden');
});

// 马尔蒂尼上任"关闭" → 难度选择
closeEventBtn.addEventListener('click', function() {
    eventModal.classList.add('hidden');
    difficultySelection.classList.remove('hidden');
});

// 选择难度
selectDifficultyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const difficulty = this.getAttribute('data-difficulty');
        difficultySelection.classList.add('hidden');
        showSeasonIntro(1, difficulty);
    });
});

// 显示赛季开幕简报（difficulty 传 null 表示赛季中期过渡，不重新初始化游戏）
// 赛季开场卡片：第二赛季无名小卒；第五赛季新闻合订本；有欧战资格再补小组赛抽签
function playSeasonOpeningCards() {
    const queue = [];
    if (gameStats.season === 2) { queue.push('unknownOneI'); }
    if (gameStats.season === 5) { queue.push('newsCompilation'); } // 第五赛季开场：红鸟收购新闻合订本
    if (gameStats.hasUCL) { queue.push('uclDraw'); }
    if (queue.length > 0) {
        currentRandomEvents = queue;
        randomEventIndex = 0;
        showNextRandomEvent();
    }
}

function showSeasonIntro(season, difficulty) {
    const intro = seasonIntros[season];
    if (!intro) {
        if (difficulty !== null) {
            mainInterface.classList.remove('hidden');
            initializeGame(difficulty);
        } else {
            playSeasonOpeningCards(); // 无开场剧情的赛季（如第五赛季）仍播开场卡片
        }
        return;
    }
    pendingDifficulty = difficulty;
    document.getElementById('season-intro-title').textContent =
        typeof intro.title === 'function' ? intro.title() : intro.title;

    renderTaskList(document.getElementById('season-intro-tasks'), intro);

    const descEl = document.getElementById('season-intro-description');
    descEl.innerHTML = '';
    const paras = typeof intro.description === 'function' ? intro.description() : intro.description;
    paras.forEach(para => {
        const p = document.createElement('p');
        p.innerHTML = formatBrackets(para);
        descEl.appendChild(p);
    });

    document.getElementById('season-intro-modal').classList.remove('hidden');
    // 第二赛季赛季任务发布 → 博班加盟（11）、技术总监任命（12）邮件一同送达（皮奥利13改至第8轮送达）
    if (season === 2) { deliverEmail('bobanArrival'); deliverEmail('directorRole'); }
}

function renderSeasonTasksPanel() {
    const season = gameStats.season;
    const intro = seasonIntros[season];
    const titleEl = document.getElementById('season-tasks-title');
    const listEl = document.getElementById('season-tasks-list');

    if (!intro) {
        titleEl.textContent = `第${season}赛季`;
        listEl.innerHTML = '<p class="no-tasks-note">本赛季暂无主线任务。</p>';
    } else {
        titleEl.textContent = typeof intro.title === 'function' ? intro.title() : intro.title;
        renderTaskList(listEl, intro);
    }
    // 必要的支持=可选任务：未完成则跨赛季常驻「赛季任务」（任意赛季都显示）；完成后仅在原赛季(2/3)显示「已完成」
    if (gameStats.supportTaskActive && (gameStats.zlatanSupport < 3 || season === 2 || season === 3)) {
        renderSupportTask(listEl);
    }
}

// 支持点小圆点（事件与赛季任务共用）
function buildSupportDots() {
    const points = Math.min(3, gameStats.zlatanSupport);
    const dots = document.createElement('div');
    dots.className = 'support-task-dots';
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        dot.className = 'support-dot' + (i < points ? ' filled' : '');
        dots.appendChild(dot);
    }
    return dots;
}

// 渲染可交互的"为兹拉坦获得三个支持点"任务（赛季任务面板内可重复选择）
function renderSupportTask(listEl) {
    const done = gameStats.zlatanSupport >= 3;
    const box = document.createElement('div');
    box.className = 'support-task' + (done ? ' support-task-done' : '');

    const header = document.createElement('div');
    header.className = 'support-task-header';
    header.textContent = `为兹拉坦获得支持点${done ? ' · 已完成' : ''}`;
    box.appendChild(header);
    box.appendChild(buildSupportDots());

    if (!done) {
        randomEvents.support.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'support-task-btn';
            btn.textContent = `${opt.text}（${formatEffects(opt.effects)}）`;
            btn.addEventListener('click', () => {
                applyZlatanSupport(opt);
                renderSeasonTasksPanel();
            });
            box.appendChild(btn);
        });
    }
    listEl.appendChild(box);
}

function applyZlatanSupport(option) {
    if (gameStats.zlatanSupport >= 3 || gameStats.gameEnded) return;
    for (const [stat, delta] of Object.entries(option.effects)) updateStat(stat, delta);
    gameStats.zlatanSupport += (option.supportPoint || 1);
    choiceHistory.push({
        round: gameStats.round,
        eventName: '必要的支持',
        optionText: option.text,
        effects: option.effects,
        kind: 'special'
    });
}

document.getElementById('show-tasks-btn').addEventListener('click', function() {
    renderSeasonTasksPanel();
    document.getElementById('season-tasks-modal').classList.remove('hidden');
});

document.getElementById('close-tasks-modal').addEventListener('click', function() {
    document.getElementById('season-tasks-modal').classList.add('hidden');
});

document.getElementById('season-intro-continue').addEventListener('click', function() {
    document.getElementById('season-intro-modal').classList.add('hidden');
    if (pendingDifficulty !== null) {
        mainInterface.classList.remove('hidden');
        initializeGame(pendingDifficulty);
        pendingDifficulty = null;
        return;
    }
    // 赛季开场卡片（统一逻辑）
    playSeasonOpeningCards();
});

// 更新数值
function updateStat(statName, delta) {
    if (statName === 'budget') {
        updateBudget(delta);
        return;
    }

    if (delta !== 0) {
        showStatChange(statName, delta);
    }

    gameStats[statName] += delta;
    gameStats[statName] = Math.max(0, Math.min(100, gameStats[statName]));
    
    const barId = statName + '-bar';
    updateProgressBar(barId, gameStats[statName]);
    
    // 检查结局
    checkEnding(statName);
}

// 检查结局
function checkEnding(statName) {
    if (gameStats.gameEnded) return;
    if (gameStats[statName] <= 0) showEnding(statName);
}

// 显示结局
let currentEndingKey = null;
let galleryPreview = false;
let galleryPreviewEnding = null; // 图鉴预览时当前展示的结局对象，供"继续"链式预览尾声卡片

// 渲染结局卡片（真实结局与图鉴预览共用）。preview=true 时按钮为"返回图鉴"
function renderEndingCard(ending, preview) {
    const modal = document.getElementById('ending-modal');
    const hasTitle = !!ending.title;
    modal.querySelector('.ending-label').style.display = ''; // "结局"标签始终保留
    modal.querySelector('.ending-rule').style.display = hasTitle ? '' : 'none';
    const titleEl = document.getElementById('ending-title');
    titleEl.style.display = hasTitle ? '' : 'none';
    titleEl.textContent = ending.title || '';
    // 标题居中补偿：结尾为标点 → 右移；开头为引号/括号（开头留白显得偏右）→ 左移
    const _et = ending.title || '';
    const _ends = /[？！。，、）」』】’”?!.,)]\s*$/.test(_et);
    const _starts = /^\s*[‘“「『【（(]/.test(_et);
    titleEl.classList.toggle('trailing-punct', _ends && !_starts);
    titleEl.classList.toggle('leading-punct', _starts);
    const text = typeof ending.text === 'function' ? ending.text() : ending.text;
    document.getElementById('ending-text').innerHTML =
        text.split('\n').map(p => `<p>${p}</p>`).join('');
    const imgEl = document.getElementById('ending-image');
    if (ending.image) {
        // 用宽高比预留高度，弹窗一打开就占好位，图片解码完不再撑高回流
        if (ending.imageW && ending.imageH) {
            imgEl.setAttribute('width', ending.imageW);
            imgEl.setAttribute('height', ending.imageH);
        } else {
            imgEl.removeAttribute('width'); imgEl.removeAttribute('height');
        }
        imgEl.src = ending.image;
        imgEl.classList.remove('hidden');
    } else {
        imgEl.classList.add('hidden');
        imgEl.removeAttribute('src');
    }
    // 预览时：有后续尾声卡片则按钮为“继续”（链式展示主卡→尾声卡），否则“返回”图鉴
    document.getElementById('restart-game').textContent =
        preview ? (ending.next ? (ending.nextText || '继续') : '返回')
                : (ending.next ? (ending.nextText || '继续') : '重新开始');
    modal.classList.remove('hidden');
    const ec = modal.querySelector('.ending-content');
    if (ec) ec.scrollTop = 0;
}

function showEnding(endingKey) {
    const ending = endings[endingKey];
    if (!ending) return;
    currentEndingKey = endingKey;
    galleryPreview = false;
    gameStats.gameEnded = true;
    if (endingKey === 'tomorrow') saveTomorrowStats(); // 记录触发时的冠军数，供图鉴预览
    if (!ending.epilogue) recordAchievedEnding(endingKey); // 尾声卡片不计入图鉴
    renderEndingCard(ending, false);
}

// ===== 结局图鉴（跨存档持久化）=====
const ENDINGS_KEY = 'acm_endings_v1';

// 该结局触发时的意甲/欧冠冠军数快照，供结局图鉴预览时填充
const TOMORROW_STATS_KEY = 'acm_ending_tomorrow_v1';
function saveTomorrowStats() {
    try { localStorage.setItem(TOMORROW_STATS_KEY, JSON.stringify({ s: gameStats.scudettoCount, u: gameStats.uclTitleCount })); } catch {}
}
function getTomorrowStats() {
    try { return JSON.parse(localStorage.getItem(TOMORROW_STATS_KEY)); } catch { return null; }
}

function getAchievedEndings() {
    try { return JSON.parse(localStorage.getItem(ENDINGS_KEY)) || []; }
    catch { return []; }
}

function recordAchievedEnding(key) {
    const achieved = getAchievedEndings();
    if (!achieved.includes(key)) {
        achieved.push(key);
        localStorage.setItem(ENDINGS_KEY, JSON.stringify(achieved));
    }
}

// 更新预算
function updateBudget(delta) {
    if (delta > 0 && gameStats.trust > 0 && gameStats.trust < 15) {
        delta = Math.floor(delta / 2);
    }
    if (delta !== 0) {
        showVariableChange('budget', delta > 0 ? `+${delta}万` : `${delta}万`, delta > 0);
    }
    gameStats.budget += delta;
    document.getElementById('budget').textContent = gameStats.budget + '万欧元';
    if (gameStats.budget < 0 && !gameStats.gameEnded) {
        showEnding('budgetCrash');
    }
}

function getStatusText(value) {
    if (value >= 75) return '良好';
    if (value >= 50) return '稳定';
    if (value >= 25) return '中等';
    return '低迷';
}

function showStatChange(statName, delta) {
    if (!delta) return;
    const card = document.getElementById(`${statName}-card`);
    if (!card) return;
    const change = document.createElement('span');
    change.className = 'stat-change';
    change.textContent = delta > 0 ? `+${delta}` : `${delta}`;
    card.appendChild(change);
    requestAnimationFrame(() => change.classList.add('visible'));
    setTimeout(() => change.remove(), 1400);
}

function showVariableChange(spanId, text, isPositive) {
    const el = document.getElementById(spanId);
    if (!el) return;
    const container = el.closest('.variable');
    if (!container) return;
    const change = document.createElement('span');
    change.className = 'stat-change';
    change.textContent = text;
    change.style.color = isPositive ? '#2f6e2e' : '#8B0000';
    container.appendChild(change);
    requestAnimationFrame(() => change.classList.add('visible'));
    setTimeout(() => change.remove(), 1400);
}

// 更新进度条
function updateProgressBar(barId, value) {
    const bar = document.getElementById(barId);
    const valueSpan = document.getElementById(barId.replace('-bar', '-value'));
    const statusSpan = document.getElementById(barId.replace('-bar', '-status'));
    
    // 设置宽度
    bar.style.width = value + '%';
    bar.dataset.value = value;
    
    // 更新数值显示
    valueSpan.textContent = value;
    statusSpan.textContent = getStatusText(value);
    
    // 移除所有颜色 class
    bar.classList.remove('low', 'medium', 'high');
    
    // 根据数值添加对应的 class
    if (value < 20) {
        bar.classList.add('low');
    } else if (value > 80) {
        bar.classList.add('high');
    } else {
        bar.classList.add('medium');
    }
}

// 初始化游戏
function initializeGame(difficulty) {
    // 初始化数值
    const initVal = difficulty === 'hard' ? 40 : 50;
    gameStats = { trust: initVal, media: initVal, fans: initVal, player: initVal, budget: 1000, points: 0, ranking: 1, round: 0, lastScore: '', lastOpponentDisplay: '', consecutiveNonWins: 0, consecutiveLosses: 0, usedRandomEvents: [], southStandEventUsed: false, betKingEventUsed: false, rebateEventCount: 0, randomPity: 0, transferEventUsed: false, carCrashEventUsed: false, sinkOrSwimEventUsed: false, bigDataEventUsed: false, derbyLossEventPending: false, derbyWinEventPending: false, warningEventShown: false, gameEnded: false, season: 1, deliveredEmails: {}, architectureRound: 0, notifyPrefs: { email: true, dm: true, forum: true, players: true }, futureRandomEvents: [], usedMainlineEvents: [], newCoachDone: false, xmasDone: false, oldFriendDone: false, winterWindowDone: false, winterSlotBonus: 0, winterNoBudget: false, winterReturnCost: 0, winterReturnIntent: 0, signedPlayers: [], news01Pending: false, news01Done: false, ibraNewsPending: false, ibraNewsDone: false, effectiveDone: false, lockerBrawlPending: false, lockerBrawlDone: false, supportTaskActive: false, zlatanSupport: 0, wonScudetto1: false, hasUCL: false, uclBanNextSeason: false, uclFixtures: null, uclStage: null, uclQualified: false, uclGroupPos: 0, uclOutRound: 0, euroType: 'ucl', lastSeasonRanking: 0, uclTagShown: false, mug1Done: false, mug2Done: false, mugPactDone: false, mugPactPending: false, eslDone: false, esl2Pending: false, esl2Done: false, eslResolution: '', eslResolutionDone: false, sameNameDone: false, player07WinterCost: 0, player07Trust: 0, player07Removed: false, player01Trust: 0, emoOutburstDone: false, nextLeftBack3Done: false, transferRumorDone: false, donnaNegoDone: false, summerWarnShown: false, winterWarnShown: false, player21Discount: 0, force21Window: false, forceWindowPlayers: [], scout64Pending: null, scout64ActiveId: null, scout64Offered: [], scout64SeasonCount: 0, scoutOfferSeasonCount: 0, donnaLeftFreeRound: 0, calhaLeftRound: 0, s4WonUcl: false, lastSeasonWonUcl: false, transferIntel: [], starterPromise: [], playerGrowth: {}, forumPosts: [], dynamicDMs: [], purchasePrice: {}, scoutSellable: [], soldPlayers: [], buyoutTomoriDone: false, overtimeFineUsed: false, homeVisitUsed: false, leaoNewsPending: false, leaoNewsDone: false, betKing1Done: false, betKing2Done: false, betKing3Done: false, betKingSkip: false, betKingResolved: false, farCallDone: false, magicPhoneUnlocked: false, magicPhoneUses: 0, scudettoCount: 0, uclTitleCount: 0, season4TitlesBefore: 0, uclReachedFinal: false, uclFinalCount: 0, suspicion: 0, hesitantContract1Done: false, hesitantContract2Done: false, hesitantContract2Pending: false, omniscient1Done: false, omniscient2Done: false, pressOfficerDone: false, nextLeftBack4Done: false, leftBack4Resolved: false, southStandTalkDone: false, southStandPending: false, footballDisputeDone: false, deadEndDone: false, godByeDone: false, lastMatchLost: false, shownWarnings: { trustCrisis: false, trustCritical: false, mediaCrisis: false, mediaCritical: false, playerCrisis: false, playerCritical: false, fansCrisis: false, fansCritical: false }, difficulty };
    pendingTransferSlots = 0;
    lastOpponentName = '';
    serieATeams = teams.map(t => ({ ...t }));
    // 第一赛季固定 20 队（含 AC Milan）：teams 18 + 科莫；后续每赛季末由 applyRelegation 循环维持
    serieATeams.push({ name: FIRST_PROMOTED, category: 'low' });
    initializeLeague();
    matchSchedule = generateMatchSchedule();   // 必须在 serieATeams/leagueTeams 就绪后排程
    scheduleIndex = 0;
    updateLeagueRanking();
    for (const stat of ['trust', 'media', 'fans', 'player'])
        updateProgressBar(`${stat}-bar`, initVal);
    updateBudget(0);
    updateScoreboard();
    matchHistory = [];
    choiceHistory = [];
    decisionPoints = 0;
    updateDecisionPoints();
    resetEventBtns();
    startMatchBtn.disabled = true;
    eventOptions.classList.add('hidden');
    updateMagicPhoneBtn();
    updateTeamNewsDot(); // 开局：序幕邮件/私信/论坛未读 → 主按钮红点
}

// 事件按钮点击
eventBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (decisionPoints >= 2) return;
        
        const eventId = this.getAttribute('data-event');
        const event = events[eventId];
        
        eventDescription.textContent = event.description;
        optionButtons.innerHTML = '';
        
        event.options.forEach((option) => {
            const optionContainer = document.createElement('div');
            optionContainer.className = 'option-container';
            
            const optionBtn = document.createElement('button');
            optionBtn.textContent = option.text;
            optionBtn.className = 'option-btn';
            
            const effectsSpan = document.createElement('span');
            effectsSpan.textContent = formatEffects(option.effects);
            effectsSpan.className = 'effects-text';
            
            optionBtn.addEventListener('click', () => {
                // 记录历史
                choiceHistory.push({
                    round: gameStats.round + 1,
                    eventName: eventNames[eventId] || `事件${eventId}`,
                    optionText: option.text,
                    effects: option.effects,
                    kind: 'event'
                });

                // 应用效果
                for (const [stat, delta] of Object.entries(option.effects)) {
                    if (stat === 'budget') {
                        updateBudget(delta);
                    } else {
                        updateStat(stat, delta);
                    }
                }

                // 隐藏选项
                eventOptions.classList.add('hidden');

                // 增加决策点
                decisionPoints++;
                updateDecisionPoints();
                
                // 禁用该事件
                this.disabled = true;
                this.style.backgroundColor = '#ccc';
                
                // 检查是否可以开始比赛
                if (decisionPoints >= 2) {
                    startMatchBtn.disabled = false;
                }
            });
            
            optionContainer.appendChild(optionBtn);
            optionContainer.appendChild(effectsSpan);
            optionButtons.appendChild(optionContainer);
        });
        
        eventOptions.classList.remove('hidden');
        eventOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});

// 点击四项数值卡片：弹出预警样式说明卡，解释该数值的作用
const statInfoTexts = {
    trust:  '管理层对你的信任，采取管理层的建议可增加信任度。<br>低于 30：每回合扣除部分预算；<br>低于 15：扣得更多，且申请到的预算减半；<br>归零时触发结局「下课」。',
    media:  '你与媒体的关系，适当放料给媒体会让你在媒体中声望变高。<br>高于 80：比赛胜负会放大球迷情绪；<br>低于 30：负面舆论持续影响球迷；<br>归零时触发结局「守口如瓶」。',
    fans:   '球迷对球队的支持，只要一直赢球，球迷就不会有什么意见。<br>低于 30：每回合扣除部分预算；<br>低于 15：扣除预算的同时，还会连带扣除管理层信任度；<br>归零时触发结局「冷漠的球迷」。',
    player: '球队的竞技状态，直接决定比赛胜率。<br>低于 30：每回合扣除媒体声望；<br>低于 15：扣除媒体声望的同时，还会连带扣除球迷满意度；<br>归零时触发结局「伤病潮」。'
};
const statTitles = { trust: '董事会信任度', media: '媒体声望', fans: '球迷满意度', player: '球员状态' };

function showStatInfo(statKey) {
    if (gameStats.gameEnded) return;
    randomEventModal.classList.remove('mainline', 'news', 'ucl', 'magic');
    randomEventModal.classList.add('warning');
    document.getElementById('random-event-title').textContent = statTitles[statKey];
    document.getElementById('random-event-description').innerHTML = statInfoTexts[statKey];
    const oc = document.getElementById('random-event-options');
    oc.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'random-event-option random-event-option--single';
    btn.textContent = '了解';
    btn.addEventListener('click', () => {
        randomEventModal.classList.remove('warning');
        randomEventModal.classList.add('hidden');
    });
    oc.appendChild(btn);
    randomEventModal.classList.remove('hidden');
}

['trust', 'media', 'fans', 'player'].forEach(stat => {
    const card = document.getElementById(`${stat}-card`);
    if (!card) return;
    const help = document.createElement('button');
    help.className = 'stat-help';
    help.textContent = '?';
    help.setAttribute('aria-label', `${statTitles[stat]}说明`);
    help.addEventListener('click', (e) => { e.stopPropagation(); showStatInfo(stat); });
    card.appendChild(help);
});

// 更新决策点显示
function updateDecisionPoints() {
    decisionPointsSpan.textContent = decisionPoints;
    if (decisionPoints >= 2) {
        startMatchBtn.disabled = false;
    } else {
        startMatchBtn.disabled = true;
    }
}

const matchResultModal = document.getElementById('match-result-modal');
const matchResultTitle = document.getElementById('match-result-title');
const matchResultText = document.getElementById('match-result-text');
const closeResultBtn = document.getElementById('close-result');
const randomEventModal = document.getElementById('random-event-modal');

function generateMatchSchedule() {
    // 每队主客场各踢一次，共38轮
    const schedule = [];
    // 用当前意甲池（19 队，含升降级后的队伍）排程：每队主客各一次 = 38 轮
    serieATeams.forEach(t => { schedule.push(t.name); schedule.push(t.name); });
    shuffleArray(schedule);
    // 消除相邻重复（同一支队伍连续两场）
    for (let i = 0; i < schedule.length - 1; i++) {
        if (schedule[i] === schedule[i + 1]) {
            for (let j = i + 2; j < schedule.length; j++) {
                if (schedule[j] !== schedule[i]) {
                    [schedule[i + 1], schedule[j]] = [schedule[j], schedule[i + 1]];
                    break;
                }
            }
        }
    }
    // 第二赛季：第16轮必定对战亚特兰大（圣诞夜惊魂）
    if (gameStats.season === 2) {
        forceFixture(schedule, 16, '亚特兰大');
    }
    return schedule;
}

// 将指定球队固定到某一轮，并避免相邻重复
function forceFixture(schedule, round, teamName) {
    const idx = round - 1;
    if (schedule[idx] === teamName) return;
    const from = schedule.indexOf(teamName);
    if (from === -1) return;
    [schedule[idx], schedule[from]] = [schedule[from], schedule[idx]];
    // 若交换后在目标轮相邻处产生重复，则把相邻处的同名球队换到安全位置
    [idx - 1, idx + 1].forEach(adj => {
        if (schedule[adj] === teamName) {
            for (let j = 0; j < schedule.length; j++) {
                if (Math.abs(j - idx) <= 1) continue;
                if (schedule[j] !== teamName &&
                    schedule[j - 1] !== teamName && schedule[j + 1] !== teamName) {
                    [schedule[adj], schedule[j]] = [schedule[j], schedule[adj]];
                    break;
                }
            }
        }
    });
}

function drawOpponent() {
    if (scheduleIndex >= matchSchedule.length) {
        // 超出赛程（不应发生），退回随机（取当前意甲池，确保在 leagueTeams 中）
        return serieATeams[Math.floor(Math.random() * serieATeams.length)].name;
    }
    const name = matchSchedule[scheduleIndex++];
    lastOpponentName = name;
    return name;
}

// 解析 futureRandomEvents 条目为事件 ID
function resolveEventEntry(e) {
    return typeof e === 'object' ? e.eventId : e;
}

// 渲染赛季任务列表到指定容器
function renderTaskList(el, intro) {
    el.innerHTML = '';
    (typeof intro.tasks === 'function' ? intro.tasks() : intro.tasks).forEach(task => {
        const div = document.createElement('div');
        div.className = 'season-task-item';
        div.innerHTML = '· ' + formatBrackets(task); // 【】内容渲染为红色并去掉括号
        el.appendChild(div);
    });
}

// 重置事件按钮状态
function resetEventBtns(color = '') {
    eventBtns.forEach(btn => { btn.disabled = false; btn.style.backgroundColor = color; });
}

// ===== 转会市场 =====
const transferBuyPlayers = [
    // ===== 转会池（核心引援，tier 1）=====
    {
        id: 'lb_winger', name: '飞翼左后卫', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '攻守兼备的现代边卫，甚至十分擅长助攻。有人说他上场只会吃红牌，也许他性格暴躁，也许他只是渴望一个机会来证明自己。',
        effects: { player: 4, media: -2 }, cost: 2000, signIntent: 60
    },
    {
        id: 'winger_pt', name: '葡萄牙边锋', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '20岁，速度和盘带俱佳，不契合前教练的培养思路，表现出极强的可塑性。他的缺点都可以改正，他的优点却很难在其他球员身上发现。',
        effects: { player: 5 }, cost: 3500, signIntent: 60
    },
    {
        id: 'striker_fr', name: '法国中锋', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '以几乎白送的价格挂牌，有人说现代足球已经没有他的容身之地。他自称儿时的偶像是你曾经的队友，因此才想来到米兰。',
        effects: { player: 4, fans: 3 }, cost: 100, signIntent: 55
    },
    {
        id: 'cb_eng', name: '全能型工兵', tier: 1, tag: '即战力', tagColor: 'ready',
        desc: '35岁，出身于本土青训，他曾多次被租借，踢过边翼卫和中场，速度和身体早已不是巅峰，主教练信任他，更多是因为他的经验和稳定性。',
        effects: { player: 5 }, cost: 300, signIntent: 50
    },
    {
        id: 'gk_talent', name: '天才守门员', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '反应神速，几乎是一位无死角门将。没人相信一个新人能顶替刚刚离队的传奇门神，他的心态极佳，但是否适合米兰还未可知。',
        effects: { player: 5 }, cost: 1300, signIntent: 48
    },
    {
        id: 'maestro', name: '上帝的指挥', tier: 1, tag: '即战力', tagColor: 'ready', uclTag: true,
        desc: '他曾经口出狂言，如果他回到米兰，不是为了"养老"，而是为了夺冠。签下他意味着认可他在更衣室里的绝对权威。',
        effects: { player: 8, fans: 6, trust: -4 }, cost: 5500
    },
    {
        id: 'cm_youth_it', name: '意大利青训中场', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '22岁，本土培养。他是个不折不扣的米兰死忠。为了穿上这件红黑球衣，他主动要求降薪。只要你不出售他，他永远也不会要求转会。',
        effects: { player: 3, fans: 5, trust: 3 }, cost: 700, signIntent: 100
    },
    // 08 · 丹尼尔·马尔蒂尼（tier 0：仅建立球员，不进转会窗；经「同一个姓氏」事件晋升获取）
    {
        id: 'daniel_maldini', name: '丹尼尔·马尔蒂尼', tier: 0, tag: '青训', tagColor: 'potential',
        desc: '青年队里技术细腻的小将，青训教练认为他已有征战意甲的实力——他和你共用一个姓氏。',
        effects: { player: 3 }, cost: 1200, signIntent: 55
    },
    {
        id: 'belgian_star', name: '下一代新星', tier: 1, tag: '潜力股', tagColor: 'potential', uclTag: true,
        desc: '比利时人，高大、技术全面、年轻，球探报告将他称为下一代天才球员。',
        effects: { player: 6 }, cost: 3200, signIntent: 40
    },
    // ===== NPC池（其他目标，tier 2）=====
    {
        id: 'dm_cro', name: '克罗地亚铁腰', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '通过高效的比赛阅读能力覆盖整片中场，他的合同还剩最后一年，十分抢手，经纪人已经在和别的球队总监喝咖啡了。',
        effects: { player: 6 }, cost: 3500, signIntent: 35
    },
    {
        id: 'amf_fk', name: '任意球前腰', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '22岁，当打之年，在更衣室和队友打成一片，但他的经纪人胃口不小，谈判桌上他的眼睛总望着别处：米兰城不止一家球队。',
        effects: { player: 6, fans: 3 }, cost: 4000, signIntent: 35
    },
    {
        id: 'dm_pt', name: '葡萄牙后腰', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '拦截凶狠，身材高大，性格火爆。平均三场就会吃一次牌，曾有在更衣室和队友大打出手的传闻，辱骂过教练。如果管不住他，就别签下这个定时炸弹。',
        effects: { player: 7, trust: -5 }, cost: 3000, signIntent: 45
    },
    {
        id: 'winger_amateur', name: '业余的边锋', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '他踢过很长时间的低级别联赛，如果不是球探报告，你甚至不能确定他是一名职业球员。他愿意为任何赛场机会拼命，任何机会。',
        effects: { player: 2 }, cost: 550, signIntent: 58
    },
    {
        id: 'cb_control', name: '控制型中卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '195cm，33岁，沉稳可靠，他的经验足够帮助任何一家处在重建期的球队度过磨合期，但他的跑动能力下滑明显，防守技巧上也有一些短板。',
        effects: { player: 4 }, cost: 1800, signIntent: 48
    },
    {
        id: 'mid_bel', name: '进攻型中场', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '从顶级球队租借来的小个子，灵光一现的时候能在狭小空间里给出一脚直塞，但他大概会在租借期满后走人。',
        effects: { player: 6, fans: 4 }, cost: 2800, signIntent: 40
    },
    {
        id: 'striker_vet', name: '养老的前锋', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '35岁，昔日的世界级射手，拿着高额薪水被俱乐部无情抛弃，他的脚法和经验都还在，关键球的处理仍然不失水准，但他对任何俱乐部的热情都已经远去，签下他意味着承担高额的薪资。',
        effects: { player: 5, fans: 5, trust: -3 }, cost: 4500, signIntent: 38
    },
    {
        id: 'striker_ger', name: '德国攻击手', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '26岁，社交媒体有百万级别的粉丝，签下他意味着进一步扩大在社媒上的影响力，教练私下对你表示过轻微的怀疑，他的技术真的适配米兰吗？',
        effects: { player: 3, fans: 9, media: 5 }, cost: 5000, signIntent: 45
    },
    {
        id: 'mid_steady', name: '稳健型中场', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '33岁，既能扫荡又能后插，关键时刻总是不吝啬牺牲自己的体力，性格直爽，和更衣室关系良好。他的经纪人没有隐瞒球员的身体状况，正是这份体检报告让你犹豫。',
        effects: { player: 5, trust: 2 }, cost: 2000, signIntent: 50
    },
    {
        id: 'cb_den', name: '丹麦中卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '冷静、稳健，几乎不犯错。中规中矩的价格，中规中矩的描述。你也许就是需要这样一位没什么特点的后卫。',
        effects: { player: 4 }, cost: 2200, signIntent: 45
    },
    {
        id: 'rb_esp', name: '西班牙边卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '29岁，经验丰富，攻防两端都拿得出手，即插即用毫无磨合成本。问题是他名气大、要价高、且已经过了巅峰期。',
        effects: { player: 5 }, cost: 3800, signIntent: 42
    },
    {
        id: 'cb_eng_loan', name: '英格兰中卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '身体素质强硬，风格稳健。你们需要一位中卫，前东家的首发名单里没有他的位置，培养他之后，是否能留住他呢？',
        effects: { player: 5 }, cost: 2800, signIntent: 50
    },
    {
        id: 'striker_glass', name: '玻璃进攻手', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '25岁却已经有过三次大伤，状态好的时候能左右一场比赛，旧伤发作的时候一个赛季踢不了十场。出场频率和作用都是未知数。',
        effects: { player: 7 }, cost: 2000, signIntent: 45
    },
    // 23 ·（原 08）法国中后卫 → 移入 NPC 池（tier 2）
    {
        id: 'cb_fr_young', name: '法国中后卫', tier: 2, tag: '潜力股', tagColor: 'potential',
        desc: '他是个只有二十一岁的稚嫩球员，球队如何塑造他，决定了他会成为哪种球员。',
        effects: { player: 3 }, cost: 50, signIntent: 48
    }
];
// 01-09 号核心球员（tier 1）均带"欧冠"标签（第三赛季夏窗后才在转会窗显示）
transferBuyPlayers.forEach(p => { if (p.tier === 1) p.uclTag = true; });
const transferSellPlayers = [
    {
        id: 'veteran', name: '高薪老将',
        desc: '高薪，合同还有两年，出售可回血预算。',
        effects: { budget: 350, player: -4 }
    },
    {
        id: 'fan_fav', name: '球迷宠儿小将',
        desc: '青训出品，南看台最爱的本土才俊。',
        effects: { budget: 200, fans: -5 }
    }
];

const TM_PER_PAGE = 4;
let tmState = { slots: 0, initialSlots: 0, basePlayer: 0, purchased: new Set(), sold: new Set(), pool: [], page: 0 };

// 夏季转会窗牌池：第二赛季必出 01、02、19；第三赛季必出 09、23（08=丹尼尔不入窗）；其余 NPC 填充（已购入的不再出现）
// 首次出现的转会窗时间序号：第二夏=1，第二冬=2，第三夏=3，第三冬=4，第四夏=5（列入此表者保证首次出现、且在此之前不出现）
const coreDebut = {
    lb_winger: 1, winger_pt: 1,        // 01、02 第二赛季夏窗
    cb_den: 1,                         // 19 第二赛季夏窗（tier2 NPC，保证首次出现）
    maestro: 2,                        // 06 第二赛季冬窗
    cb_fr_young: 3, belgian_star: 3,   // 23(原08)、09 第三赛季夏窗（cb_fr_young 为 tier2 NPC，仍保证此窗首次出现）
    cm_youth_it: 4,                    // 07 第三赛季冬窗
    striker_fr: 5, gk_talent: 5,       // 03、05 第四赛季夏窗
    cb_eng: 6                          // 04 第四赛季冬窗
};
// 签下某核心球员 → 送达其本人私信（消息9–17；经 deliverEmail 幂等仅一次）
const signDMTrigger = {
    lb_winger: 'signTheo', winger_pt: 'signLeao', striker_fr: 'signGiroud',
    cb_eng: 'signFlorenzi', gk_talent: 'signMaignan', maestro: 'signIbra',
    cm_youth_it: 'signTonali', daniel_maldini: 'signDaniel', belgian_star: 'signDeket',
    mid_bel: 'signBrahim', cb_den: 'signKjaer', cb_eng_loan: 'signTomori', cb_fr_young: 'signKalulu'
};
// 私信发件人（球员本人）→ 球员id：回复其本人私信一次，该球员成长值 +1（`dmAnswerReply`）。多纳鲁马非在册球员、无成长值，不列入
const DM_SENDER_PLAYER = {
    '特奥': 'lb_winger', '莱奥': 'winger_pt', '吉鲁': 'striker_fr', '弗洛伦齐': 'cb_eng',
    '麦尼昂': 'gk_talent', '伊布拉希莫维奇': 'maestro', '托纳利': 'cm_youth_it', '丹尼尔': 'daniel_maldini',
    '德凯特拉雷': 'belgian_star', '迪亚斯': 'mid_bel', '克亚尔': 'cb_den', '托莫里': 'cb_eng_loan', '卡卢卢': 'cb_fr_young'
};

// ===== 球员成长值（1~10）=====
// 老将（03吉鲁/06伊布/10铁腰/19克亚尔）初始 5，其余青年球员初始 1；每赛季自然 +1，上限 10
const OLD_PLAYER_IDS = ['striker_fr', 'maestro', 'dm_cro', 'cb_den'];
function initPlayerGrowth(id) {
    if (gameStats.playerGrowth[id] == null) gameStats.playerGrowth[id] = OLD_PLAYER_IDS.includes(id) ? 5 : 1;
}
function playerGrowthOf(id) {
    return gameStats.playerGrowth[id] != null ? gameStats.playerGrowth[id] : (OLD_PLAYER_IDS.includes(id) ? 5 : 1);
}
// 求购/出售报价向上取整到百位（个位、十位归零）；不足百（仅个/十位）则取 1000
function roundUpOfferPrice(x) { return x < 100 ? 1000 : Math.ceil(x / 100) * 100; }
// 私信60（AAA专业球探·豪门求购）：已签「核心引援」(tier1、非老将)成长值≥5后，逐一收到求购短信；每赛季最多求购 2 人。
// 回复「我会考虑的」→ 终端球员档案出现「出售」按钮（按报价套现并永久移出转会窗）；回复「非卖品」→ 不再求购（本就每人仅一次）。
// 动态生成、带唯一 trigger 记送达时间，推入 gameStats.dynamicDMs（随存档持久化）。
const SCOUT_OFFER_GROWTH = 5;              // 成长值 ≥5 才被求购
const SCOUT_OFFER_MAX_PER_SEASON = 2;      // 每赛季最多求购 2 人（赛季初 scoutOfferSeasonCount 归零）
function maybeScoutOffer() {
    if (!gameStats.dynamicDMs) gameStats.dynamicDMs = [];
    if ((gameStats.scoutOfferSeasonCount || 0) >= SCOUT_OFFER_MAX_PER_SEASON) return; // 本赛季名额已满
    for (const id of gameStats.signedPlayers) {
        const p = transferBuyPlayers.find(b => b.id === id);
        if (!p || p.tier !== 1) continue;                     // 只求购「核心引援」(tier1；08丹尼尔 tier0，不在此列)
        if (OLD_PLAYER_IDS.includes(id)) continue;            // 老将不求购（03吉鲁/06伊布等）
        if (playerGrowthOf(id) < SCOUT_OFFER_GROWTH) continue; // 成长值 ≥5
        const key = 'scoutOffer_' + id;
        if (gameStats.deliveredEmails && gameStats.deliveredEmails[key]) continue; // 该球员已发过
        const paid = (gameStats.purchasePrice && gameStats.purchasePrice[id] != null) ? gameStats.purchasePrice[id] : p.cost;
        const price = roundUpOfferPrice(paid * 1.1);          // 实际成交价 +10%，向上取整到百位
        gameStats.dynamicDMs.push({
            from: 'AAA专业球探', unread: true, trigger: key, playerId: id,
            bubbles: [`马尔蒂尼先生。抱歉打扰您，有一只绝对可以称得上是豪门的球队求购米兰队伍中的${p.name}，他们第一轮出价${price}万欧元，您有这个意向吗？`],
            replies: [
                { text: '这名球员是米兰的非卖品。', answer: '好的，看起来您对第一轮报价不满意。' },
                { text: '我会考虑的。', answer: '别的球队如果有报价，我也会和您跟进。', sellable: true }
            ]
        });
        gameStats.scoutOfferSeasonCount = (gameStats.scoutOfferSeasonCount || 0) + 1; // 本赛季求购 +1
        deliverEmail(key);   // 记送达时间（供收件箱排序）+ 刷新红点
        return;              // 每轮最多一条，逐轮下发避免刷屏
    }
}

// 私信64（球探团队·引荐 NPC 池球员）：第二赛季起、空闲时逐轮随机引荐一名「未引荐过、未签下」的 NPC（tier 2），发其转会窗卡片。
// 选「感兴趣」→ 下一轮下发「球员条件」私信；答应任一条件 → 扣相应数值 + 解锁其签约「情报加持」(transferIntel) + 保证其下个转会窗出现(forceWindowPlayers)。
// 一名球员的交涉结束前（64a 选不感兴趣 / 64b 任一选项，均带 scoutDone 清 scout64ActiveId；或该球员在转会窗被签下）不引荐下一位；所有状态随 gameStats 跨赛季保留。
const SCOUT64_START_SEASON = 2;   // 第二赛季起
const SCOUT64_CHANCE = 0.1;       // 空闲时每轮引荐概率（可调）
const SCOUT64_MAX_PER_SEASON = 2; // 每赛季最多引荐人数（赛季初 scout64SeasonCount 归零）
function maybeScout64() {
    if (!gameStats.dynamicDMs) gameStats.dynamicDMs = [];
    if (!gameStats.scout64Offered) gameStats.scout64Offered = [];
    const scoutAns = '我们已获得球员的初步意向。';
    // 64b：选「感兴趣」后的下一轮，球探带回球员开出的条件
    if (gameStats.scout64Pending && gameStats.round > gameStats.scout64Pending.round) {
        const id = gameStats.scout64Pending.playerId;
        const bKey = 'scout64b_' + id;
        if (!(gameStats.deliveredEmails && gameStats.deliveredEmails[bKey])) {
            gameStats.dynamicDMs.push({
                from: '球探团队', unread: true, trigger: bKey, playerId: id,
                bubbles: ['球员提出了一些条件。'],
                replies: [
                    { text: '给球员更多广告分成。', cost: { label: '媒体声望', value: '-10' }, effects: { media: -10 }, grantIntel: true, scoutDone: true, answer: scoutAns },
                    { text: '答应以他为球队核心。', cost: { label: '球员状态', value: '-10' }, effects: { player: -10 }, grantIntel: true, scoutDone: true, answer: scoutAns },
                    { text: '承诺管理层无权干涉球员合同。', cost: { label: '管理层信任度', value: '-10' }, effects: { trust: -10 }, grantIntel: true, scoutDone: true, answer: scoutAns },
                    { text: '给球员一笔额外奖金。', cost: { label: '球队预算', value: '-500w' }, effects: { budget: -500 }, grantIntel: true, scoutDone: true, answer: scoutAns },
                    { text: '还是算了吧。', scoutDone: true, pass: true, answer: '好的，总监。' }
                ]
            });
            deliverEmail(bKey);
        }
        gameStats.scout64Pending = null;
    }
    // 64a：无进行中的交涉、本赛季名额未满时，第二赛季起每轮按概率引荐一名尚未引荐、未签下的 NPC
    if (!gameStats.scout64ActiveId && !gameStats.scout64Pending
        && gameStats.season >= SCOUT64_START_SEASON
        && (gameStats.scout64SeasonCount || 0) < SCOUT64_MAX_PER_SEASON
        && Math.random() < SCOUT64_CHANCE) {
        const pool = transferBuyPlayers.filter(p => p.tier === 2
            && !gameStats.signedPlayers.includes(p.id)
            && !gameStats.scout64Offered.includes(p.id)
            && !coreDebut[p.id]); // 不引荐带「首次出现」死规则的球员(19/23)，避免被 forceWindowPlayers 提前带入市场
        if (pool.length) {
            const p = pool[Math.floor(Math.random() * pool.length)];
            const aKey = 'scout64a_' + p.id;
            gameStats.scout64Offered.push(p.id);
            gameStats.scout64ActiveId = p.id;  // 交涉进行中：本流程结束前不再引荐下一位
            gameStats.scout64SeasonCount = (gameStats.scout64SeasonCount || 0) + 1; // 本赛季引荐 +1
            gameStats.dynamicDMs.push({
                from: '球探团队', unread: true, trigger: aKey, playerId: p.id,
                bubbles: ['Ciao, Paolo', '我们在市场上发现一些新球员。', { card: p.id }, '你觉得怎么样？'],
                replies: [
                    { text: '感兴趣。', answer: '好的，我们这就去接触球员。', interest: true },
                    { text: '不感兴趣。', answer: '我们有新消息再告诉你。', scoutDone: true }
                ]
            });
            deliverEmail(aKey);
        }
    }
}

// 欧冠胜率加成：所有已签「欧冠标签」球员成长值之和 × 每点 0.2%，封顶 +10%
const UCL_GROWTH_RATE = 0.002, UCL_GROWTH_CAP = 0.10;
function uclGrowthWinBonus() {
    let sum = 0;
    for (const id of gameStats.signedPlayers) {
        const p = transferBuyPlayers.find(b => b.id === id);
        if (p && p.uclTag) sum += playerGrowthOf(id);
    }
    return Math.min(UCL_GROWTH_CAP, sum * UCL_GROWTH_RATE);
}

// 当前转会窗时间序号
function windowTimeIndex(isWinter) { return (gameStats.season - 2) * 2 + (isWinter ? 2 : 1); }

// 已到首次出现时间、且尚未购买的核心球员（优先出现，直到被买走）
function availableCorePlayers(time) {
    const cards = [];
    for (const id of Object.keys(coreDebut)) {
        if (coreDebut[id] > time || gameStats.signedPlayers.includes(id) || (gameStats.soldPlayers || []).includes(id)) continue;
        if (id === 'cm_youth_it') {
            // 07：仅当"童年的马克杯Ⅰ"承诺过（标价>0）且未被移出球队
            if (!(gameStats.player07WinterCost > 0) || gameStats.player07Removed) continue;
            cards.push({ ...transferBuyPlayers.find(b => b.id === id), cost: gameStats.player07WinterCost });
        } else if (id === 'maestro') {
            const card = { ...transferBuyPlayers.find(b => b.id === id), tag: '回归', tagColor: 'return' };
            if (gameStats.winterReturnCost > 0) card.cost = gameStats.winterReturnCost;
            card.signIntent = gameStats.winterReturnIntent; // 初始意向随「曾经的传奇」选择（拨通电话100/经纪人40/放弃0）
            cards.push(card);
        } else {
            cards.push(transferBuyPlayers.find(b => b.id === id));
        }
    }
    return cards;
}

// 核心球员 + NPC 池补足到 8 人（已购入的不再出现）
function fillWithNpc(result) {
    const have = new Set(result.map(c => c.id));
    // 21（cb_eng_loan/托莫里）身价受"买断我！保罗！"事件折扣影响
    const applyDisc = p => (p.id === 'cb_eng_loan' && gameStats.player21Discount > 0)
        ? { ...p, cost: Math.max(0, p.cost - gameStats.player21Discount) } : p;
    const out = result.slice();
    // 买断我！保罗！ 后：下个转会窗保证 21 出现（仅这一窗，随后清除标记）
    if (gameStats.force21Window && !gameStats.signedPlayers.includes('cb_eng_loan') && !have.has('cb_eng_loan')) {
        const t21 = transferBuyPlayers.find(p => p.id === 'cb_eng_loan');
        if (t21) { out.push(applyDisc(t21)); have.add('cb_eng_loan'); }
        gameStats.force21Window = false;
    }
    // 消息64 球探引荐：被承诺的球员下个转会窗保证出现（仅这一窗，随后清空；情报另存 transferIntel 持久不清）
    if (gameStats.forceWindowPlayers && gameStats.forceWindowPlayers.length) {
        for (const fid of gameStats.forceWindowPlayers) {
            if (gameStats.signedPlayers.includes(fid) || have.has(fid) || (gameStats.soldPlayers || []).includes(fid) || coreDebut[fid]) continue; // coreDebut 球员只经 availableCorePlayers 在其首次出现窗登场，绝不被强制提前
            const fp = transferBuyPlayers.find(p => p.id === fid);
            if (fp) { out.push(applyDisc(fp)); have.add(fid); }
        }
        gameStats.forceWindowPlayers = [];
    }
    // 列入 coreDebut 的 NPC（19、23）只经 availableCorePlayers 在其首次出现窗起登场，故此处排除，避免提前出现/重复
    const npc = transferBuyPlayers.filter(p => p.tier === 2 && !gameStats.signedPlayers.includes(p.id)
        && !coreDebut[p.id] && !have.has(p.id) && !(gameStats.soldPlayers || []).includes(p.id));
    const picked = npc.slice().sort(() => Math.random() - 0.5).slice(0, Math.max(0, 8 - out.length)).map(applyDisc);
    return out.concat(picked);
}

// 夏季转会窗：优先列出所有已登场、未购买的核心球员，其余 NPC 填充
function drawTransferPool() {
    return fillWithNpc(availableCorePlayers(windowTimeIndex(false)));
}

// 意向谈判参数：默认起始意向（球员可加 signIntent 覆盖）、「立刻签约」达标阈值
const NEG_START = 45, NEG_THRESHOLD = 60;
// 各谈判选项提升的意向值（单一来源，选项文案与结算共用）
const NEG_DELTA = { raise: 15, raiseBig: 40, talkChamp: 20, talkStarter: 12, intel: 25 };

function openTransferMarket(slots, opts = {}) {
    const windowTitle = opts.windowTitle || '夏季转会窗';
    // nego=各球员谈判状态（点「意向签约」在同窗口内跳转谈判）；visitsLeft=「亲自登门」本窗剩余次数
    // 亲自登门次数：简单=每窗一次；中等=每赛季一次（冬夏窗共享，赛季初重置 homeVisitUsed）；困难=全程仅一次（从不重置）
    const homeVisits = gameStats.difficulty === 'easy' ? 1 : (gameStats.homeVisitUsed ? 0 : 1);
    tmState = { slots, initialSlots: slots, basePlayer: gameStats.player, purchased: new Set(), sold: new Set(), pool: opts.pool || drawTransferPool(), page: 0, windowTitle, nego: {}, visitsLeft: homeVisits };
    document.getElementById('tm-season-label').textContent = opts.label || `转会市场 · 第${gameStats.season}赛季`;
    document.getElementById('tm-window-title').textContent = windowTitle;
    renderTransferMarket();
    document.getElementById('transfer-market-modal').classList.remove('hidden');
}

// 冬季转会窗：优先列出所有已登场、未购买的核心球员（06=回归、07=马克杯标价），其余 NPC 填充
function drawWinterPool() {
    return fillWithNpc(availableCorePlayers(windowTimeIndex(true)));
}

function openWinterTransferMarket() {
    const slots = 1 + (gameStats.winterSlotBonus || 0);
    openTransferMarket(slots, {
        pool: drawWinterPool(),
        label: `转会市场 · 第${gameStats.season}赛季`,
        windowTitle: '冬季转会窗'
    });
}

const TM_TAG_CLASS = { potential: 'tm-tag-potential', ready: 'tm-tag-ready', risk: 'tm-tag-risk', return: 'tm-tag-return' };
// 剩余名额 = 总名额 − 已成功签下数（谈判进行中/失败不占名额）
function tmRemainingSlots() { return tmState.initialSlots - tmState.purchased.size; }

function tmStatsHtml(p, cost) {
    const labels = { player: '即战力', fans: '球迷满意度', trust: '董事会信任度', media: '媒体声望' };
    return Object.entries(p.effects).map(([k, v]) => {
        const cls = v > 0 ? 'tm-stat-pos' : 'tm-stat-neg';
        return `<div>${labels[k] || k}：<span class="${cls}">${v > 0 ? '+' : ''}${v}</span></div>`;
    }).join('') + `<div>身价：€${cost}万</div>`;
}
function tmCardHeadHtml(p) {
    return `<div class="tm-card-header">
                <div class="tm-player-name">${p.name}</div>
                <div class="tm-tags">
                    ${p.uclTag && gameStats.uclTagShown ? '<div class="tm-tag tm-tag-ucl">欧冠</div>' : ''}
                    <div class="tm-tag ${TM_TAG_CLASS[p.tagColor]}">${p.tag}</div>
                </div>
            </div>
            <div class="tm-card-desc">${p.desc}</div>`;
}

// 球员卡四态：谈判中(意向条+三选项) / 已签下 / 谈判破裂 / 待签(点意向签约即进入该球员谈判)
function tmRenderBuyCard(card, p) {
    const n = tmState.nego[p.id];
    const signed = tmState.purchased.has(p.id);
    let btnHtml, cardCls = 'tm-player-card', cost = p.cost, canStart = false;
    if (signed) {
        cost = p.cost + ((n && n.extraOffer) || 0);
        cardCls += ' tm-bought';
        btnHtml = '<button class="tm-sign-btn" disabled>已签下</button>';
    } else {
        let btnText = n ? '继续谈判' : '意向签约', dis = false; // 谈过未签 → 继续谈判（进度保留）
        if (tmRemainingSlots() <= 0) { btnText = '名额已满'; dis = true; }
        else if (p.cost > gameStats.budget) { btnText = '预算不足'; dis = true; }
        canStart = !dis;
        btnHtml = `<button class="tm-sign-btn"${dis ? ' disabled' : ''}>${btnText}</button>`;
    }
    card.className = cardCls;
    card.innerHTML = `${tmCardHeadHtml(p)}
        <div class="tm-card-stats">${tmStatsHtml(p, cost)}</div>
        ${btnHtml}`;
    if (canStart) card.querySelector('.tm-sign-btn').addEventListener('click', () => tmStartNego(p));
}

// 初始意向：现在每名球员数据都带固定 signIntent（见 transferBuyPlayers），按角色设定手工定值；06=伊布浮动（winterReturnIntent，随「曾经的传奇」选择）
// 无 signIntent 时才回退到 35–55 随机（中心约 NEG_START=45）；仅在创建 nego 状态时调用一次，结果锁入 tmState.nego[id].intent，本窗口内稳定
// 困难模式：全体初始意向统一 −10（含随机兜底），下限 0；例外：07(cm_youth_it)恒 100、06伊布(maestro)浮动值均不下调
const HARD_INTENT_KEEP = ['cm_youth_it', 'maestro'];
function tmInitIntent(p) {
    const base = p.signIntent != null ? p.signIntent : 35 + Math.floor(Math.random() * 21);
    return gameStats.difficulty === 'hard' && !HARD_INTENT_KEEP.includes(p.id) ? Math.max(0, base - 10) : base;
}
function tmHasIntel(p) { return (gameStats.transferIntel || []).includes(p.id); }

let signNego = null; // 当前正在谈判的球员
// 点「意向签约 / 继续谈判」→ 同一窗口内跳转到签约谈判视图（保留已有进度，可中途返回再续）
function tmStartNego(p) {
    if (!tmState.nego[p.id]) tmState.nego[p.id] = { intent: tmInitIntent(p), extraOffer: 0, lastDelta: null, champUsed: false, starterUsed: false, intelUsed: false };
    signNego = p;
    document.getElementById('tm-market-view').classList.add('hidden');
    document.getElementById('tm-sign-view').classList.remove('hidden');
    renderSignNego();
}

// 渲染签约谈判视图（与转会窗同尺寸）：表头 + 球员卡 + 意向条 + 选项 + 底部「回到转会窗 / 立刻签约」
function renderSignNego() {
    const p = signNego, n = tmState.nego[p.id];
    const finalCost = p.cost + n.extraOffer;
    const intent = Math.max(0, Math.min(100, n.intent));
    const ready = intent >= NEG_THRESHOLD; // 达标即可「立刻签约」
    const inc20 = Math.round(p.cost * 0.20), inc50 = Math.round(p.cost * 0.50);
    const lastTxt = n.lastDelta != null ? `（上一步 意向 ${n.lastDelta > 0 ? '+' : ''}${n.lastDelta}）` : '';
    // 全部选项均列出；不满足条件的置灰(dis)，不隐藏
    const opts = [
        { opt: 'visit',       name: `亲自登门（意向→100）`,            sub: `“我想把你带到米兰。”（剩余：${tmState.visitsLeft}）`, dis: tmState.visitsLeft <= 0 },
        { opt: 'raise',       name: `提高报价（意向+${NEG_DELTA.raise}）`,    sub: `签约价 +20%（+€${inc20}万）`, dis: finalCost + inc20 > gameStats.budget },
        { opt: 'raiseBig',    name: `大幅提高报价（意向+${NEG_DELTA.raiseBig}）`, sub: `签约价 +50%（+€${inc50}万）`, dis: finalCost + inc50 > gameStats.budget },
        { opt: 'talkChamp',   name: `话术谈判（意向+${NEG_DELTA.talkChamp}）`,  sub: `“你能在这里获得更多冠军。”`, dis: n.champUsed || !gameStats.lastSeasonWonUcl },
        { opt: 'talkStarter', name: `许诺首发位置（意向+${NEG_DELTA.talkStarter}）`, sub: `“我们会给你首发的位置。”`,   dis: n.starterUsed },
        { opt: 'intel',       name: `情报加持（意向+${NEG_DELTA.intel}）`,    sub: `“我们有关于你的其他消息。”`, dis: n.intelUsed || !tmHasIntel(p) }
    ];
    const optsHtml = opts.map(o =>
        `<button class="tm-neg-btn" data-opt="${o.opt}"${o.dis ? ' disabled' : ''}>
            <span class="tm-neg-name">${o.name}</span><span class="tm-neg-sub">${o.sub}</span>
        </button>`).join('');
    document.getElementById('tm-sign-view').innerHTML = `
        <div class="tm-header">
            <div class="tm-header-left">
                <div class="tm-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg></div>
                <div>
                    <div class="tm-season-label">球员签约谈判</div>
                    <div class="tm-window-title">${p.name}</div>
                </div>
            </div>
            <div class="tm-header-right">
                <div class="tm-stat-chip"><div class="tm-chip-label">剩余预算</div><div class="tm-chip-value">€${gameStats.budget}万</div></div>
                <div class="tm-stat-chip"><div class="tm-chip-label">当前成交价</div><div class="tm-chip-value">€${finalCost}万</div></div>
            </div>
        </div>
        <div class="sn-body">
            <div class="sn-card">
                ${tmCardHeadHtml(p)}
                <div class="tm-card-stats">${tmStatsHtml(p, finalCost)}</div>
                <div class="tm-intent">
                    <div class="tm-intent-bar"><div class="tm-intent-fill${ready ? ' tm-intent-ok' : ''}" style="width:${intent}%"></div><div class="tm-intent-th" style="left:${NEG_THRESHOLD}%"></div></div>
                    <div class="tm-intent-label">意向 ${intent} / 100（达标线 ${NEG_THRESHOLD}）${lastTxt}</div>
                </div>
                <div class="tm-neg-opts">${optsHtml}</div>
            </div>
        </div>
        <div class="sn-footer">
            <button class="sn-back-btn" id="sn-back">回到转会窗</button>
            <button class="sn-sign-btn" id="sn-sign"${ready ? '' : ' disabled'}>立刻签约</button>
        </div>`;
    const view = document.getElementById('tm-sign-view');
    view.querySelectorAll('.tm-neg-btn').forEach(b => { if (!b.disabled) b.addEventListener('click', () => signNegoOption(b.dataset.opt)); });
    document.getElementById('sn-back').addEventListener('click', closeSignNego);
    const signBtn = document.getElementById('sn-sign');
    if (!signBtn.disabled) signBtn.addEventListener('click', () => tmFinalizeSign(p));
}

// 选项结算：亲自登门=必定成功（简单每窗一次/中等每赛季一次/困难全程一次）；提高/大幅报价=加价并提意向；话术/情报=提意向（各一次）
function signNegoOption(opt) {
    const p = signNego, n = tmState.nego[p.id];
    let delta = 0;
    if (opt === 'visit') {
        if (tmState.visitsLeft <= 0) return;
        tmState.visitsLeft--;
        if (gameStats.difficulty !== 'easy') gameStats.homeVisitUsed = true; // 中等/困难：记为已用（中等赛季初重置，困难全程保留）
        delta = 100 - n.intent;       // 意向直接拉满到 100；仍需玩家点「立刻签约」
        n.intent = 100;
        n.lastDelta = delta;
        renderSignNego();
        return;
    } else if (opt === 'raise') {
        const inc = Math.round(p.cost * 0.20);
        if (p.cost + n.extraOffer + inc > gameStats.budget) return;
        n.extraOffer += inc; delta = NEG_DELTA.raise;
    } else if (opt === 'raiseBig') {
        const inc = Math.round(p.cost * 0.50);
        if (p.cost + n.extraOffer + inc > gameStats.budget) return;
        n.extraOffer += inc; delta = NEG_DELTA.raiseBig;
    } else if (opt === 'talkChamp') {
        if (n.champUsed || !gameStats.lastSeasonWonUcl) return;
        n.champUsed = true; delta = NEG_DELTA.talkChamp;
    } else if (opt === 'talkStarter') {
        if (n.starterUsed) return;
        n.starterUsed = true; delta = NEG_DELTA.talkStarter; // 仅标记本次谈判用过；最终签下才记入 starterPromise
    } else if (opt === 'intel') {
        if (n.intelUsed || !tmHasIntel(p)) return;
        n.intelUsed = true; delta = NEG_DELTA.intel;
    }
    n.intent = Math.max(0, Math.min(100, n.intent + delta));
    n.lastDelta = delta;
    renderSignNego();
}

// 立刻 / 必定签约：成交（扣最终成交价、加成、入队）→ 回到转会窗
function tmFinalizeSign(p) {
    const n = tmState.nego[p.id];
    // 用过「许诺首发位置」且最终签下 → 记入 starterPromise（终端球员档案显示淡红「首发」）
    if (n && n.starterUsed && !gameStats.starterPromise.includes(p.id)) gameStats.starterPromise.push(p.id);
    signPlayerFinal(p, p.cost + n.extraOffer);
    closeSignNego();
}

// 回到转会窗视图（未签球员的谈判进度保留，可再点「继续谈判」续上）
function closeSignNego() {
    document.getElementById('tm-sign-view').classList.add('hidden');
    document.getElementById('tm-market-view').classList.remove('hidden');
    signNego = null;
    renderTransferMarket();
}

// 谈判成功签约：入队、扣最终成交价、加成、私信/新闻、决策记录
function signPlayerFinal(p, finalCost) {
    tmState.purchased.add(p.id);
    if (!gameStats.signedPlayers.includes(p.id)) gameStats.signedPlayers.push(p.id);
    if (!gameStats.purchasePrice) gameStats.purchasePrice = {};
    gameStats.purchasePrice[p.id] = finalCost; // 记实际成交价（含谈判加价），供消息60求购报价
    initPlayerGrowth(p.id); // 签下即设初始成长值（老将5/青年1）
    if (signDMTrigger[p.id]) deliverEmail(signDMTrigger[p.id]); // 签下 → 其本人私信
    if (p.id === 'maestro' && !gameStats.news01Done) gameStats.news01Pending = true;
    if (p.id === 'winger_pt' && !gameStats.leaoNewsDone) gameStats.leaoNewsPending = true;
    // 消息64：签下的正是球探正在交涉的球员 → 交涉结束（清 busy、取消待发 64b），放行下一位；若 DM 尚未回复，回复时球探恭贺（见 dmAnswerReply）
    if (gameStats.scout64ActiveId === p.id) gameStats.scout64ActiveId = null;
    if (gameStats.scout64Pending && gameStats.scout64Pending.playerId === p.id) gameStats.scout64Pending = null;
    updateBudget(-finalCost);
    Object.entries(p.effects).forEach(([k, v]) => updateStat(k, v));
    choiceHistory.push({
        round: gameStats.round, eventName: '转会引援',
        optionText: `签下${p.name}（成交价 €${finalCost}万）`,
        effects: p.effects, roundLabel: tmState.windowTitle, kind: 'special'
    });
}

function renderTransferMarket() {
    document.getElementById('tm-budget').textContent = `€${gameStats.budget}万`;
    document.getElementById('tm-slots').textContent = `${tmRemainingSlots()}/${tmState.initialSlots}`;
    document.getElementById('tm-strength-before').textContent = tmState.basePlayer;
    document.getElementById('tm-strength-after').textContent = Math.max(0, Math.min(100, gameStats.player));

    // 可签入球员：每页 4 名；不足 4 张补「空占位卡」，保证每页面板高度一致
    const buyEl = document.getElementById('tm-buy-players');
    buyEl.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(tmState.pool.length / TM_PER_PAGE));
    if (tmState.page > totalPages - 1) tmState.page = totalPages - 1;
    const pageStart = tmState.page * TM_PER_PAGE;
    const pageCards = tmState.pool.slice(pageStart, pageStart + TM_PER_PAGE);
    pageCards.forEach(p => {
        const card = document.createElement('div');
        tmRenderBuyCard(card, p);
        buyEl.appendChild(card);
    });
    for (let i = pageCards.length; i < TM_PER_PAGE; i++) { // 占位卡（不可见，仅撑满版面）
        const ph = document.createElement('div');
        ph.className = 'tm-player-card tm-card-empty';
        buyEl.appendChild(ph);
    }

    // 翻页控件（右下角）
    const pageEl = document.getElementById('tm-buy-pagination');
    if (totalPages <= 1) {
        pageEl.innerHTML = '';
    } else {
        pageEl.innerHTML = `
            <button class="tm-page-btn" id="tm-page-prev"${tmState.page === 0 ? ' disabled' : ''}>‹</button>
            <span class="tm-page-indicator">${tmState.page + 1} / ${totalPages}</span>
            <button class="tm-page-btn" id="tm-page-next"${tmState.page >= totalPages - 1 ? ' disabled' : ''}>›</button>
        `;
        const prevBtn = document.getElementById('tm-page-prev');
        const nextBtn = document.getElementById('tm-page-next');
        if (!prevBtn.disabled) prevBtn.addEventListener('click', () => { tmState.page--; renderTransferMarket(); });
        if (!nextBtn.disabled) nextBtn.addEventListener('click', () => { tmState.page++; renderTransferMarket(); });
    }

    // 可出售套现
    const sellEl = document.getElementById('tm-sell-players');
    sellEl.innerHTML = '';
    transferSellPlayers.forEach(p => {
        const sold = tmState.sold.has(p.id);
        const gain = p.effects.budget;
        const sideEffects = Object.entries(p.effects)
            .filter(([k]) => k !== 'budget')
            .map(([k, v]) => {
                const labels = { player: '即战力', fans: '球迷满意度', trust: '董事会信任度' };
                return `${labels[k] || k}${v > 0 ? '+' : ''}${v}`;
            }).join('，');

        const row = document.createElement('div');
        row.className = 'tm-sell-row' + (sold ? ' tm-sold' : '');
        row.innerHTML = `
            <div class="tm-sell-info">
                <div class="tm-sell-name">${p.name}</div>
                <div class="tm-sell-effect">回收€${gain}万${sideEffects ? '，' + sideEffects : ''}</div>
            </div>
            <button class="tm-sell-btn"${sold ? ' disabled' : ''}>${sold ? '已出售' : '出售'}</button>
        `;
        if (!sold) {
            row.querySelector('.tm-sell-btn').addEventListener('click', () => {
                tmState.sold.add(p.id);
                Object.entries(p.effects).forEach(([k, v]) => {
                    if (k === 'budget') updateBudget(v);
                    else updateStat(k, v);
                });
                renderTransferMarket();
            });
        }
        sellEl.appendChild(row);
    });
}

document.getElementById('tm-close-btn').addEventListener('click', () => {
    document.getElementById('transfer-market-modal').classList.add('hidden');
    resetAfterMatch();
});

// ===== 续约谈判（球员谈判页面，样式同转会窗）=====
let negState = null;
let pendingNegotiations = [];

// 文案/数值为占位，可后续调整。delta 为该选项对续约意向值的增减；desc 为该选项的权衡说明
// ===== negotiationScripts（续约谈判文案）已拆分至 negotiationContent.js（须先于 script.js 引入）=====

// 续约意向阈值：<40 谈崩，≥70 续约，其间拉锯
function negZone(v) { return v >= 70 ? 'renew' : v < 40 ? 'break' : 'tug'; }

// 上一轮选择后的旁白（按意向增减给出）
function negDeltaNarration(delta) {
    if (delta >= 12) return '你的诚意让对方明显动容';
    if (delta >= 1)  return '对方的态度略有松动';
    if (delta === 0) return '谈判桌上一阵沉默';
    if (delta > -7)  return '经纪人放话施压';
    return '经纪人拍案而起，几乎要离席';
}

// 选项右侧的意向徽章样式
function negBadge(delta) {
    if (delta < 0)   return { cls: 'neg-badge-red',   text: `意向 ${delta} / 高风险` };
    if (delta >= 10) return { cls: 'neg-badge-green', text: `意向 +${delta}` };
    return { cls: 'neg-badge-tan', text: `意向 +${delta}` };
}

function startNextNegotiation() {
    if (pendingNegotiations.length === 0) { resetAfterMatch(); return; }
    const key = pendingNegotiations.shift();
    if (key === 'donnarumma') { openDonnaNego(); return; } // 多纳鲁马走详细分支谈判页
    openNegotiation(key);
}

function openNegotiation(key) {
    const sc = negotiationScripts[key];
    negState = { key, round: 0, value: sc.start, lastDelta: null, pendBudget: 0 };
    negShowChrome(true);
    document.getElementById('neg-title').textContent = `续约谈判 · 第${toChineseNum(gameStats.season)}赛季`;
    document.getElementById('neg-subtitle').textContent = sc.sub;
    renderNegotiation();
    document.getElementById('negotiation-modal').classList.remove('hidden');
}

function updateNegBar(v) {
    document.getElementById('neg-marker').style.left = v + '%';
    document.getElementById('neg-value').textContent = `${v} / 100`;
}

function renderNegotiation() {
    const sc = negotiationScripts[negState.key];
    const v = Math.max(0, Math.min(100, negState.value));
    updateNegBar(v);
    document.getElementById('neg-round').textContent = `回合 ${negState.round + 1} / 4`;
    const rd = sc.rounds[negState.round];
    document.getElementById('neg-agent').textContent = rd.agent;

    // 上一轮意向变化提示（首回合不显示）
    const deltaEl = document.getElementById('neg-delta');
    if (negState.lastDelta === null) {
        deltaEl.classList.add('hidden');
        deltaEl.textContent = '';
    } else {
        const d = negState.lastDelta;
        deltaEl.classList.remove('hidden');
        deltaEl.classList.toggle('pos', d >= 0);
        deltaEl.classList.toggle('neg', d < 0);
        deltaEl.textContent = `${d >= 0 ? '↗' : '↘'} 上一轮${negDeltaNarration(d)}，意向 ${d >= 0 ? '+' : ''}${d}`;
    }

    // 谈判中已承诺的预算（续约成功后才结算，拉锯/破裂不扣）
    const pendEl = document.getElementById('neg-pending');
    pendEl.textContent = negState.pendBudget ? `续约成功后，待结算：预算 ${negState.pendBudget > 0 ? '+' : ''}${negState.pendBudget}w` : '';

    const oc = document.getElementById('neg-options');
    oc.innerHTML = '';
    rd.options.forEach(opt => {
        // 引号台词作为灰色小字显示在选项动作文字下方
        const qi = opt.text.indexOf('“');
        const action = qi >= 0 ? opt.text.slice(0, qi).trim() : opt.text;
        const quote = qi >= 0 ? opt.text.slice(qi) : '';
        const badges = [];
        if (opt.budget) badges.push({ cls: opt.budget < 0 ? 'neg-badge-red' : 'neg-badge-green', text: `预算 ${opt.budget > 0 ? '+' : ''}${opt.budget}w` });
        const ib = negBadge(opt.delta);
        badges.push({ cls: ib.cls, text: ib.text });
        const b = document.createElement('button');
        b.className = 'neg-option';
        b.innerHTML = `<div class="neg-opt-text">${action}</div>`
            + (quote ? `<div class="neg-opt-quote">${quote}</div>` : '')
            + `<div class="neg-opt-badges">${badges.map(x => `<span class="neg-opt-badge ${x.cls}">${x.text}</span>`).join('')}</div>`;
        b.addEventListener('click', () => negChoose(opt));
        oc.appendChild(b);
    });
}

function negChoose(opt) {
    negState.value = Math.max(0, Math.min(100, negState.value + opt.delta));
    negState.lastDelta = opt.delta;
    if (opt.budget) negState.pendBudget += opt.budget;
    negState.round++;
    if (negState.round >= 4) { showNegFeedback(); return; }
    renderNegotiation();
}

function showNegFeedback() {
    const sc = negotiationScripts[negState.key];
    const v = Math.max(0, Math.min(100, negState.value));
    const zone = negZone(v);
    // 恰尔汗奥卢谈判未谈拢/破裂（tug/break）→ 离队，记回合供邮件26（转投国米）
    if (negState.key === 'calhanoglu' && (zone === 'tug' || zone === 'break')) { gameStats.calhaLeftRound = gameStats.round; deliverEmail('calhaInter'); } // 邮件26 转投国米：谈判破裂/未谈拢立刻送达
    const fb = sc.feedback[zone];
    negShowChrome(false); // 结算页去掉空发言框与意向条
    document.getElementById('neg-pending').textContent = '';
    document.getElementById('neg-round').textContent = '谈判结束';
    const deltaEl = document.getElementById('neg-delta');
    deltaEl.classList.remove('hidden', 'pos');
    deltaEl.classList.add('neg');
    if (negState.lastDelta !== null) {
        const d = negState.lastDelta;
        deltaEl.classList.toggle('pos', d >= 0);
        deltaEl.classList.toggle('neg', d < 0);
        deltaEl.textContent = `${d >= 0 ? '↗' : '↘'} 上一轮${negDeltaNarration(d)}，意向 ${d >= 0 ? '+' : ''}${d}`;
    } else {
        deltaEl.classList.add('hidden');
    }

    const oc = document.getElementById('neg-options');
    oc.innerHTML = `<div class="neg-feedback"><b>${fb.title}</b><br>${fb.text}</div>`;
    const btn = document.createElement('button');
    btn.className = 'neg-confirm';
    btn.textContent = '确认';
    // 续约成功才结算已承诺的预算（拉锯/破裂不扣报价预算）
    const eff = { ...fb.effects };
    if (zone === 'renew' && negState.pendBudget) eff.budget = (eff.budget || 0) + negState.pendBudget;
    btn.addEventListener('click', () => {
        Object.entries(eff).forEach(([k, val]) => updateStat(k, val));
        choiceHistory.push({
            round: gameStats.round,
            eventName: `续约谈判·${sc.name}`,
            optionText: { renew: '成功续约', tug: '谈判拉锯，暂时留队', break: '谈判破裂，球员离队' }[zone],
            effects: eff,
            kind: 'special'
        });
        document.getElementById('negotiation-modal').classList.add('hidden');
        startNextNegotiation();
    });
    oc.appendChild(btn);
}

// ===== 多纳鲁马续约谈判（分支对话树，第四赛季第二轮）=====
// 预算 / 球员状态在三回合后一起结算；谈判失败（未续约）则不扣除报价中的预算。
// ===== donnaNego（多纳鲁马专属谈判文案）已拆分至 negotiationContent.js（须先于 script.js 引入）=====
let donnaState = null;

// 结算页只保留结语：隐藏经纪人发言框与意向条
function negShowChrome(show) {
    const box = document.querySelector('#negotiation-modal .neg-agent-box');
    const bar = document.querySelector('#negotiation-modal .neg-bar-area');
    if (box) box.style.display = show ? '' : 'none';
    if (bar) bar.style.display = show ? '' : 'none';
}

function openDonnaNego() {
    donnaState = { nodeId: donnaNego.root, intent: donnaNego.start, round: 1, pendBudget: 0, pendPlayer: 0, lastIntent: null };
    negShowChrome(true);
    document.getElementById('neg-title').textContent = `续约谈判 · 第${toChineseNum(gameStats.season)}赛季`;
    document.getElementById('neg-subtitle').textContent = donnaNego.subtitle;
    renderDonnaNego();
    document.getElementById('negotiation-modal').classList.remove('hidden');
}

function donnaOptBadges(opt) {
    const badges = [];
    if (opt.budget) badges.push({ cls: opt.budget < 0 ? 'neg-badge-red' : 'neg-badge-green', text: `预算 ${opt.budget > 0 ? '+' : ''}${opt.budget}w` });
    if (opt.player) badges.push({ cls: opt.player < 0 ? 'neg-badge-red' : 'neg-badge-green', text: `球员状态 ${opt.player > 0 ? '+' : ''}${opt.player}` });
    badges.push({ cls: opt.intent >= 0 ? 'neg-badge-green' : 'neg-badge-red', text: `意向 ${opt.intent >= 0 ? '+' : ''}${opt.intent}` });
    return badges.map(b => `<span class="neg-opt-badge ${b.cls}">${b.text}</span>`).join('');
}

function renderDonnaNego() {
    const node = donnaNego.nodes[donnaState.nodeId];
    const v = Math.max(0, Math.min(100, donnaState.intent));
    document.getElementById('neg-marker').style.left = v + '%';
    document.getElementById('neg-value').textContent = `${v} / 100`;
    document.getElementById('neg-round').textContent = `回合 ${donnaState.round} / 3`;
    document.getElementById('neg-agent').textContent = node.agent;

    const deltaEl = document.getElementById('neg-delta');
    if (donnaState.lastIntent === null) { deltaEl.classList.add('hidden'); deltaEl.textContent = ''; }
    else {
        const d = donnaState.lastIntent;
        deltaEl.classList.remove('hidden');
        deltaEl.classList.toggle('pos', d >= 0); deltaEl.classList.toggle('neg', d < 0);
        deltaEl.textContent = `${d >= 0 ? '↗' : '↘'} 上一轮意向 ${d >= 0 ? '+' : ''}${d}`;
    }

    const pendEl = document.getElementById('neg-pending');
    const parts = [];
    if (donnaState.pendBudget) parts.push(`预算 ${donnaState.pendBudget > 0 ? '+' : ''}${donnaState.pendBudget}w`);
    if (donnaState.pendPlayer) parts.push(`球员状态 ${donnaState.pendPlayer > 0 ? '+' : ''}${donnaState.pendPlayer}`);
    pendEl.textContent = parts.length ? `谈判成功后，待结算：${parts.join('，')}` : '';

    const oc = document.getElementById('neg-options');
    oc.innerHTML = '';
    node.options.forEach(opt => {
        // 拆分：引号台词作为灰色小字显示在选项主文字下方
        const qi = opt.text.indexOf('“');
        const action = qi >= 0 ? opt.text.slice(0, qi).trim() : opt.text;
        const quote = qi >= 0 ? opt.text.slice(qi) : '';
        const btn = document.createElement('button');
        btn.className = 'neg-option';
        btn.innerHTML = `<div class="neg-opt-text">${action}</div>`
            + (quote ? `<div class="neg-opt-quote">${quote}</div>` : '')
            + `<div class="neg-opt-badges">${donnaOptBadges(opt)}</div>`;
        btn.addEventListener('click', () => donnaChoose(opt));
        oc.appendChild(btn);
    });
}

function donnaChoose(opt) {
    donnaState.intent = Math.max(0, Math.min(100, donnaState.intent + opt.intent));
    donnaState.lastIntent = opt.intent;
    if (opt.budget) donnaState.pendBudget += opt.budget;
    if (opt.player) donnaState.pendPlayer += opt.player;
    if (opt.end) { settleDonnaNego(opt.end); return; }
    if (opt.next) { donnaState.nodeId = opt.next; donnaState.round++; renderDonnaNego(); return; }
    settleDonnaNego(null); // 第三回合终端
}

function settleDonnaNego(forced) {
    const v = donnaState.intent;
    let outcome, title, text;
    const eff = {};
    if (forced === 'sold') {
        outcome = 'sold'; title = '收下转会费，放人';
        text = '你坚持要一笔转会费。多纳鲁马被卖到了别处——至少米兰没有人财两空，账面上还多了一笔进账。';
        if (donnaState.pendBudget) eff.budget = donnaState.pendBudget;
        eff.fans = -4;
    } else if (v >= 70) {
        outcome = 'renew'; title = '续约成功！';
        text = '多纳鲁马在新合同上签下名字，戴上了米兰的队长袖标。这一场转会风波以高额代价平息了。';
        if (donnaState.pendBudget) eff.budget = donnaState.pendBudget;
        if (donnaState.pendPlayer) eff.player = donnaState.pendPlayer;
        eff.fans = 8; eff.trust = 4;
    } else if (v >= 40) {
        outcome = 'tug'; title = '没能谈拢';
        text = '拖到最后，双方还是没能在合同上达成一致。多纳鲁马合同到期后以自由身离开，球迷为之惋惜。（报价中的预算并未扣除）';
        eff.fans = -6; eff.player = -3;
    } else {
        outcome = 'break'; title = '谈判破裂';
        text = '谈判彻底破裂，多纳鲁马愤而离队，临走前没给米兰留下一句好话。（报价中的预算并未扣除）';
        eff.fans = -9; eff.player = -4; eff.media = -3;
    }
    // 多纳鲁马自由身离队（未续约/未卖出，tug/break）→ 4 轮后邮件25（麦尼昂）
    if (outcome === 'tug' || outcome === 'break') gameStats.donnaLeftFreeRound = gameStats.round;
    Object.entries(eff).forEach(([k, val]) => { if (val) updateStat(k, val); });
    choiceHistory.push({
        round: gameStats.round, eventName: '续约谈判·多纳鲁马',
        optionText: { sold: '收转会费放人', renew: '成功续约并任命队长', tug: '未谈拢，自由身离队', break: '谈判破裂离队' }[outcome],
        effects: eff, kind: 'special'
    });
    negShowChrome(false); // 结算页去掉空发言框与意向条
    document.getElementById('neg-delta').classList.add('hidden');
    document.getElementById('neg-pending').textContent = '';
    document.getElementById('neg-round').textContent = '谈判结束';
    const oc = document.getElementById('neg-options');
    oc.innerHTML = `<div class="neg-feedback"><b>${title}</b><br>${text}</div>`;
    const btn = document.createElement('button');
    btn.className = 'neg-confirm'; btn.textContent = '确认';
    btn.addEventListener('click', () => {
        document.getElementById('negotiation-modal').classList.add('hidden');
        startNextNegotiation(); // 若是"同时谈判"则继续下一位，否则结束本轮
    });
    oc.appendChild(btn);
}

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
    // 私信29（AC米兰·再见面的那天）：第五赛季第38轮送达
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
        // God Bye（第36轮，需 06 伊布在队）：伊布退役仪式
        if (gameStats.round >= 36 && gameStats.signedPlayers.includes('maestro') && !gameStats.godByeDone) {
            gameStats.godByeDone = true;
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
            if (option.suspicion) { gameStats.suspicion += option.suspicion; updateSuspicionCard(); }
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
    if (gameStats.ranking === 1) gameStats.scudettoCount++; // 本赛季联赛夺冠，累计意甲冠军数
    if (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion') gameStats.uclTitleCount++; // 累计欧冠冠军数
    if (gameStats.season === 4 && gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion') gameStats.s4WonUcl = true; // 第四赛季欧冠夺冠快照，供邮件28/29二选一
    gameStats.lastSeasonWonUcl = (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion'); // 记「上赛季是否夺欧冠」，供下赛季签约谈判话术
    if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) {
        // 隐藏结局：任期内至少 4 次意甲冠军 + 至少 1 次欧冠冠军，优先于任务判定
        if (gameStats.scudettoCount >= 4 && gameStats.uclTitleCount >= 1) { showEnding('tomorrow'); return; }
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

// ===== 测试面板（调试用，完成后整体删除：含 index.html #test-panel 与 style.css 对应样式）=====
document.getElementById('test-panel-btn').addEventListener('click', () => {
    document.getElementById('test-panel').classList.toggle('hidden');
});
document.getElementById('test-panel-close').addEventListener('click', () => {
    document.getElementById('test-panel').classList.add('hidden');
});
// 1. 四项数值 +10、预算 +1000
document.getElementById('test-add-stats').addEventListener('click', () => {
    ['trust', 'media', 'fans', 'player'].forEach(s => updateStat(s, 10));
    updateBudget(1000);
});
// 2. 当前回合 +2（视作已到达该回合点：此前应触发的强制事件/邮件一次性「视作已触发」，不再弹出）
document.getElementById('test-add-round').addEventListener('click', () => {
    gameStats.round = Math.min(38, gameStats.round + 2);
    testConsumePendingEvents();
    updateScoreboard();
});
// 把当前回合点之前应触发的强制/定时事件与邮件全部「视作已触发」（标记完成、送达邮件，不弹窗、不抽随机事件）
function testConsumePendingEvents() {
    const savedPity = gameStats.randomPity;
    ffSkipRandom = true;
    try {
        for (let guard = 0; guard < 300; guard++) {
            const evs = selectRandomEvents(); // 邮件在函数顶部幂等送达；强制事件返回即已置 *Done
            if (!evs || evs.length === 0) break;
            // mainline 池事件正常在选项结算时才标记 used，这里手动标记，避免快进循环重复返回同一事件
            for (const id of evs) {
                if ((mainlineEventPools[gameStats.season] || []).includes(id) &&
                    !gameStats.usedMainlineEvents.includes(id)) {
                    gameStats.usedMainlineEvents.push(id);
                }
            }
        }
    } finally {
        ffSkipRandom = false;
        gameStats.randomPity = savedPity; // 还原保底计数，不因快进虚高
    }
}
// 3. 跳转下一章（保留当前数值直接进下一赛季）
document.getElementById('test-next-season').addEventListener('click', () => {
    if (gameStats.season >= 5) return;
    document.getElementById('test-panel').classList.add('hidden');
    document.getElementById('ending-modal').classList.add('hidden');
    gameStats.gameEnded = false;
    startNewSeason();
});
// 4. 直接跳转到结局
document.getElementById('test-goto-ending').addEventListener('click', () => {
    document.getElementById('test-panel').classList.add('hidden');
    showEnding(resolveCurrentEndingKey());
});

// 重新开始游戏
document.getElementById('restart-game').addEventListener('click', function() {
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
    difficultySelection.classList.add('hidden');
    document.getElementById('test-notice-modal').classList.add('hidden');
    eventModal.classList.remove('hidden'); // 重新开始跳过创作者声明，直接到马尔蒂尼上任
});

// 开始比赛
startMatchBtn.addEventListener('click', function() {
    // 第 38 轮收尾：按钮已变"结束赛季"，点击进入赛季结算而非打比赛
    if (seasonEndPending) {
        seasonEndPending = false;
        startMatchBtn.textContent = '开始比赛';
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
            <div class="tm-player-line"><span class="tm-player-name">${p.name}${tagsHtml}</span>${sellBtn}</div>
            <div class="tm-growth">
                <span class="tm-growth-label">成长值 ${g}/10</span>
                <div class="tm-growth-bar">${growthBarHtml(g)}</div>
            </div>
        </div>`;
    }).join('') + '</div>';
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
    dmThreadGroups = dmGroups();
    const rows = dmThreadGroups.map((g, gi) => {
        const last = g.latest.m;
        return `<button class="mail-row${g.anyUnread ? ' mail-unread' : ''}" data-i="${gi}">
            ${dmAvatar(g.from)}
            <span class="mail-row-main">
                <span class="mail-row-from">${g.from}${g.anyUnread ? '<span class="dm-dot"></span>' : ''}</span>
                <span class="mail-row-line2"><span class="mail-row-snippet">${dmSnippet(last.body || (last.bubbles && last.bubbles[0]) || '')}</span></span>
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
const dmTypingHTML = '<div class="dm-bubble dm-in dm-typing"><span></span><span></span><span></span></div>';
// answer 归一化为数组（字符串→单条；数组→多条；空→无回复）
const dmAnswerList = answer => Array.isArray(answer) ? answer : (answer ? [answer] : []);
// 一条消息的对方气泡（bubbles 优先，否则旧格式 body 拆段）
const dmIncoming = m => m.bubbles || (m.body || '').split(/\n{2,}/).filter(Boolean);

// 私信内嵌的球员转会窗卡片（球探引荐用，见消息64）
function dmScoutCardHTML(p) {
    const labels = { player: '即战力', fans: '球迷', trust: '信任', media: '媒体' };
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
    screen.innerHTML =
        `<div class="mail-detail-head"><button class="mail-back" aria-label="返回私信"><span class="mail-back-arrow">‹</span>私信</button></div>
        <div class="dm-chat-head">${dmAvatar(group.from)}<span class="dm-chat-name">${group.from}</span></div>
        <div class="dm-chat" id="dm-chat"></div>`;
    screen.querySelector('.mail-back').addEventListener('click', renderDMInbox);
    renderDMThread(screen, group);
    screen.scrollTop = screen.scrollHeight; // 打开时锁定到最后一条消息（最下）
    buildTerminalTabbar('dm');
    updateTeamNewsDot(); // 读私信 → 未读减少，刷新红点
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
                block.insertAdjacentHTML('beforeend', dmBubbleOut(r.text));
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
    block.insertAdjacentHTML('beforeend', dmBubbleOut(r.text));
    const answers = dmAnswerList(answer);
    const screen = document.getElementById('terminal-screen');
    if (screen) screen.scrollTop = screen.scrollHeight;
    const reveal = j => {
        if (j >= answers.length || !block.isConnected) return;
        block.insertAdjacentHTML('beforeend', dmTypingHTML);
        if (screen) screen.scrollTop = screen.scrollHeight;
        setTimeout(() => {
            const t = block.querySelector('.dm-typing');
            if (!t || !block.isConnected) return;
            t.remove();
            block.insertAdjacentHTML('beforeend', dmBubbleIn(answers[j]));
            if (screen) screen.scrollTop = screen.scrollHeight;
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
        from: TERMINAL_CONTENT.forumPool.broadcaster,
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
// 欧冠赛果帖：淘汰赛用 uclWin/uclLose；决赛(isFinal)用 uclFinalWin/uclFinalLose(待补，未提供则不发帖)。hasNext=是否还有下一轮
function addUclForumThread(oppName, win, score, hasNext, isFinal) {
    const pool = TERMINAL_CONTENT.forumPool;
    if (!pool) return;
    const suffix = win ? 'Win' : 'Lose';
    let key = (isFinal ? 'uclFinal' : 'ucl') + suffix;
    if (isFinal && oppName === '国际米兰' && pool['uclFinalDerby' + suffix]) key = 'uclFinalDerby' + suffix; // 决赛打国米走德比专用池
    pushForumThread(pool[key], forumCtx(oppName, score, { hasNext: !!hasNext }), { ucl: true });
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
    if (sec.isPlayers) screen.querySelectorAll('.tm-sell-btn').forEach(btn =>
        btn.addEventListener('click', () => sellScoutPlayer(btn.dataset.sell)));
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

// ===== 存档（三槽位）=====
const SAVE_PREFIX = 'acm_save_v2_slot';

function getSlotSave(slot) {
    try { return JSON.parse(localStorage.getItem(SAVE_PREFIX + slot)); } catch { return null; }
}

function buildSaveData() {
    return {
        gameStats: JSON.parse(JSON.stringify(gameStats)),
        matchSchedule, scheduleIndex,
        matchHistory, choiceHistory,
        decisionPoints, pendingTransferSlots,
        leagueTeams: leagueTeams.map(t => ({ name: t.name, category: t.category, points: t.points })),
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
        saveBtn.addEventListener('click', () => {
            const data = buildSaveData();
            const existing = getSlotSave(slot);
            if (existing && existing.name) data.name = existing.name; // 覆盖保存时保留原存档名
            localStorage.setItem(SAVE_PREFIX + slot, JSON.stringify(data));
            renderArchiveSlots();
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
function updateMagicPhoneBtn() {
    const btn = document.getElementById('magic-phone-btn');
    if (gameStats.magicPhoneUnlocked) btn.classList.remove('hidden');
    else btn.classList.add('hidden');
}

function renderMagicCard(title, html, options) {
    randomEventModal.classList.remove('warning', 'mainline', 'news', 'ucl');
    randomEventModal.classList.add('magic');
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

function useMagicPhone() {
    randomEventModal.classList.remove('magic');
    randomEventModal.classList.add('hidden');
    if (gameStats.magicPhoneUses >= 3) { showEnding('sheCame'); return; } // 第4次使用 → 结局
    gameStats.magicPhoneUses++;
    // 为当前四项数值中最低的一项 +15
    const stats = ['trust', 'media', 'fans', 'player'];
    let lowest = stats[0];
    for (const s of stats) { if (gameStats[s] < gameStats[lowest]) lowest = s; }
    updateStat(lowest, 15);
}

document.getElementById('magic-phone-btn').addEventListener('click', () => {
    renderMagicCard('魔力电话', '您确定要使用此道具吗？', [
        { text: '确认', onClick: useMagicPhone },
        { text: '返回', onClick: () => { randomEventModal.classList.remove('magic'); randomEventModal.classList.add('hidden'); } }
    ]);
});