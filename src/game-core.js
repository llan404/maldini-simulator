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
    dmThreadBg: {},              // 私信对话串解锁的 CG 背景 发件人名→图片路径（由回复的 dmBg 字段写入，见 dmAnswerReply）
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
    scudettoSeasons: [], // 夺得意甲冠军的赛季号列表（1~5），供官方公告卡差分文案用
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
// 随机事件 → eventContent.js；主线/新闻 → mainlineContent.js（Object.assign 追加）。两者须先于运行时系统引入。

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

// ===== endings（结局文案）位于 endingContent.js（须先于运行时系统引入）=====

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
    const directorSeasonEl = document.getElementById('director-season');
    const directorRoundEl = document.getElementById('director-round');
    if (directorSeasonEl) directorSeasonEl.textContent = Number.isFinite(gameStats.season) ? gameStats.season : 1;
    if (directorRoundEl) directorRoundEl.textContent = Number.isFinite(gameStats.round) ? gameStats.round : 0;
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

// ===== 界面版本切换（新/旧）=====
// 「旧界面」用的是改版前那份原始 markup（存在 index.html 的 <template id="ui-old-main"> 里），
// 由 index.html 末尾的内联脚本在**本文件执行之前**替换进 #main-interface —— 因为下面第 7 行
// 的 eventBtns 等引用是在加载时缓存的，换晚了会指向已被移除的节点。
// 所以切换必须走「写 localStorage + 刷新页面」，不能就地切。
const UI_MODE_KEY = 'acm_ui_mode_v1';
const UI_JUMP_KEY = 'acm_ui_jump_v1';   // 因切界面而刷新时，跳过开场直接回到难度页
function currentUiMode() {
    try { return localStorage.getItem(UI_MODE_KEY) === 'old' ? 'old' : 'new'; } // 默认新界面
    catch { return 'new'; }
}
// 滑块位置由容器上的 data-active 驱动（见 style.css 的 .ui-switch[data-active="old"]）
const uiSwitchEl = document.getElementById('ui-switch');
if (uiSwitchEl) uiSwitchEl.setAttribute('data-active', currentUiMode());
document.querySelectorAll('.ui-switch-btn').forEach(btn => {
    btn.classList.toggle('is-active', btn.getAttribute('data-ui') === currentUiMode());
    btn.addEventListener('click', function () {
        const mode = this.getAttribute('data-ui');
        if (mode === currentUiMode()) return;              // already active，不必刷新
        // 先让滑块滑过去，再刷新——否则点击后毫无反馈就整页重载
        if (uiSwitchEl) uiSwitchEl.setAttribute('data-active', mode);
        document.querySelectorAll('.ui-switch-btn').forEach(b =>
            b.classList.toggle('is-active', b.getAttribute('data-ui') === mode));
        try {
            localStorage.setItem(UI_MODE_KEY, mode);
            sessionStorage.setItem(UI_JUMP_KEY, '1');
        } catch {}
        setTimeout(() => location.reload(), 280); // 等滑块动画走完（与 CSS 的 0.28s 对齐）再重载
    });
});
// 刷新回来后直接落到难度选择页，省去重看开场两屏
try {
    if (sessionStorage.getItem(UI_JUMP_KEY)) {
        sessionStorage.removeItem(UI_JUMP_KEY);
        document.getElementById('test-notice-modal').classList.add('hidden');
        eventModal.classList.add('hidden');
        difficultySelection.classList.remove('hidden');
    }
} catch {}

// 进入 / 离开主界面时切换 in-main（决定是否启用方格纸背景，见 style.css）
function setInMain(on) { document.body.classList.toggle('in-main', !!on); }

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
            setInMain(true);
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
        setInMain(true);
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
let endingImageTimer = null;
let endingImageSequenceId = 0;

function stopEndingImageSequence() {
    endingImageSequenceId += 1;
    if (endingImageTimer !== null) {
        clearTimeout(endingImageTimer);
        endingImageTimer = null;
    }
}

function startEndingImageSequence(imgEl, sequence) {
    stopEndingImageSequence();
    const frames = sequence.filter(frame =>
        frame && typeof frame.src === 'string' && Number.isFinite(frame.duration) && frame.duration > 0
    );
    if (!frames.length) return false;

    // 提前解码后续帧，避免第一次切换时出现空白或闪动。
    frames.slice(1).forEach(frame => {
        const preload = new Image();
        preload.src = frame.src;
    });

    const sequenceId = endingImageSequenceId;
    let frameIndex = 0;
    const showFrame = () => {
        if (sequenceId !== endingImageSequenceId) return;
        const frame = frames[frameIndex];
        imgEl.src = frame.src;
        endingImageTimer = setTimeout(() => {
            frameIndex = (frameIndex + 1) % frames.length;
            showFrame();
        }, frame.duration);
    };
    showFrame();
    return true;
}

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
    const imageSequence = Array.isArray(ending.imageSequence) ? ending.imageSequence : [];
    const firstSequenceFrame = imageSequence.find(frame => frame && typeof frame.src === 'string');
    const firstImage = firstSequenceFrame ? firstSequenceFrame.src : ending.image;
    stopEndingImageSequence();
    if (firstImage) {
        // 用宽高比预留高度，弹窗一打开就占好位，图片解码完不再撑高回流
        if (ending.imageW && ending.imageH) {
            imgEl.setAttribute('width', ending.imageW);
            imgEl.setAttribute('height', ending.imageH);
        } else {
            imgEl.removeAttribute('width'); imgEl.removeAttribute('height');
        }
        imgEl.src = firstImage;
        imgEl.classList.remove('hidden');
        if (imageSequence.length) startEndingImageSequence(imgEl, imageSequence);
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
    gameStats = { trust: initVal, media: initVal, fans: initVal, player: initVal, budget: 1000, points: 0, ranking: 1, round: 0, lastScore: '', lastOpponentDisplay: '', consecutiveNonWins: 0, consecutiveLosses: 0, usedRandomEvents: [], southStandEventUsed: false, betKingEventUsed: false, rebateEventCount: 0, randomPity: 0, transferEventUsed: false, carCrashEventUsed: false, sinkOrSwimEventUsed: false, bigDataEventUsed: false, derbyLossEventPending: false, derbyWinEventPending: false, warningEventShown: false, gameEnded: false, season: 1, deliveredEmails: {}, architectureRound: 0, notifyPrefs: { email: true, dm: true, forum: true, players: true }, futureRandomEvents: [], usedMainlineEvents: [], newCoachDone: false, xmasDone: false, oldFriendDone: false, winterWindowDone: false, winterSlotBonus: 0, winterNoBudget: false, winterReturnCost: 0, winterReturnIntent: 0, signedPlayers: [], news01Pending: false, news01Done: false, ibraNewsPending: false, ibraNewsDone: false, effectiveDone: false, lockerBrawlPending: false, lockerBrawlDone: false, supportTaskActive: false, zlatanSupport: 0, wonScudetto1: false, hasUCL: false, uclBanNextSeason: false, uclFixtures: null, uclStage: null, uclQualified: false, uclGroupPos: 0, uclOutRound: 0, euroType: 'ucl', lastSeasonRanking: 0, uclTagShown: false, mug1Done: false, mug2Done: false, mugPactDone: false, mugPactPending: false, eslDone: false, esl2Pending: false, esl2Done: false, eslResolution: '', eslResolutionDone: false, sameNameDone: false, player07WinterCost: 0, player07Trust: 0, player07Removed: false, player01Trust: 0, emoOutburstDone: false, nextLeftBack3Done: false, transferRumorDone: false, donnaNegoDone: false, summerWarnShown: false, winterWarnShown: false, player21Discount: 0, force21Window: false, forceWindowPlayers: [], scout64Pending: null, scout64ActiveId: null, scout64Offered: [], scout64SeasonCount: 0, scoutOfferSeasonCount: 0, donnaLeftFreeRound: 0, calhaLeftRound: 0, s4WonUcl: false, lastSeasonWonUcl: false, transferIntel: [], starterPromise: [], playerGrowth: {}, forumPosts: [], dynamicDMs: [], dmThreadBg: {}, purchasePrice: {}, scoutSellable: [], soldPlayers: [], buyoutTomoriDone: false, overtimeFineUsed: false, homeVisitUsed: false, leaoNewsPending: false, leaoNewsDone: false, betKing1Done: false, betKing2Done: false, betKing3Done: false, betKingSkip: false, betKingResolved: false, farCallDone: false, magicPhoneUnlocked: false, magicPhoneUses: 0, scudettoCount: 0, scudettoSeasons: [], uclTitleCount: 0, season4TitlesBefore: 0, uclReachedFinal: false, uclFinalCount: 0, suspicion: 0, hesitantContract1Done: false, hesitantContract2Done: false, hesitantContract2Pending: false, omniscient1Done: false, omniscient2Done: false, pressOfficerDone: false, nextLeftBack4Done: false, leftBack4Resolved: false, southStandTalkDone: false, southStandPending: false, footballDisputeDone: false, deadEndDone: false, godByeDone: false, lastMatchLost: false, shownWarnings: { trustCrisis: false, trustCritical: false, mediaCrisis: false, mediaCritical: false, playerCrisis: false, playerCritical: false, fansCrisis: false, fansCritical: false }, difficulty };
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
    resetTerminalMsgState(); // 复位静态邮件/私信的每局可变态（已读/回复选择），避免二周目残留
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
    const helpHost = card.querySelector('.stat-card-head') || card;
    helpHost.appendChild(help);
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

