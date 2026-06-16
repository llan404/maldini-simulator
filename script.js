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
    consecutiveNonWins: 0,
    southStandEventUsed: false,
    betKingEventUsed: false,
    rebateEventCount: 0,
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
    winterReturnCost: 0,
    signedPlayers: [],
    news01Pending: false,
    news01Done: false,
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
    player04Discount: 0,
    buyoutTomoriDone: false,
    overtimeFineUsed: false,
    tomoriNewsPending: false,
    tomoriNewsDone: false,
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
    suspicion: 0,
    hesitantContract1Done: false,
    hesitantContract2Done: false,
    omniscient1Done: false,
    omniscient2Done: false,
    pressOfficerDone: false,
    nextLeftBack4Done: false,
    leftBack4Resolved: false,
    southStandTalkDone: false,
    southStandPending: false,
    footballDisputeDone: false,
    deadEndDone: false,
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

const randomEvents = {
    1: {
        title: "舆论风波",
        description: "某球员的状态持续下滑，你知道这是因为他和教练爆发了冲突。媒体却觉得这是因为更衣室里有不可调和的矛盾，球迷认为是这名球员居功自傲，因此在场上不愿意跑动，你选择：",
        options: [
            { text: "向媒体解释事情的原委，承诺会尽全力充当球员和教练之间的润滑剂。", effects: { media: 5, trust: -3 } },
            { text: "向球迷解释这个赛季的战术体系，希望他们多给球员一些时间。", effects: { fans: 5, player: -3 } },
            { text: "缄口不言，力挺教练，教练这么做一定有他自己的考虑。", effects: { player: 5, media: -4 } }
        ]
    },
    2: {
        title: "南看台的问候",
        description: "对于近日球队的表现，南看台很不满意，作为一只球队的死忠球迷，付出了门票和时间，居然遭受这样的对待！他们无法忍受球队继续输球了，如果让AC米兰继续这样输下去，难道要连输五场吗？南看台要求更换教练！你选择：",
        options: [
            { text: "在媒体面前表达对胜利的决心，并声明现在不是换教练的好时机。", effects: { media: 5, fans: -3 } },
            { text: "跟南看台爆了！你以为球队是你家开的？（结局）", effects: { fans: -100 } },
            { text: "遵循南看台的意见，和管理层商量换教练的事。", effects: { fans: 5, trust: -5 } }
        ]
    },
    4: {
        title: "更衣室领袖",
        description: "米兰的队长最近在训练中的情绪越来越差，你发现他对教练组安排的轮换制度极其不满。在一次训练赛结束后，他甚至当着所有人的面摔了球衣。媒体已经得到了内鬼的小道消息，他们认为更衣室内部即将爆炸，你选择：",
        options: [
            { text: "私下安抚队长，承诺会和教练组沟通他的出场时间。", effects: { player: 5, trust: -5 } },
            { text: "支持教练的决定，没有任何球员可以凌驾于战术体系之上。", effects: { trust: 5, player: -5 } },
            { text: "让队长上替补席，谁闹情绪谁就别上场。", effects: { trust: 5, player: -5, fans: -5 } }
        ]
    },
    5: {
        title: "回扣风波",
        description: "突发新闻！你被内幕人士指责在转会市场上搅弄风云，为自己疯狂敛财。他们指出你故意买来一些根本不值昂贵身价的球员，然后从他们的经纪人那里收取回扣。对此，你的解释是：",
        options: [
            { text: "转会市场五百万的预算，你们要三个前锋五个后卫，我拿点钱怎么了", effects: { trust: -6, media: -4 } },
            { text: "解释这么点回扣不够自己拿的。", effects: { trust: 5, budget: -400 } },
            { text: "私下追查所谓的内幕人士究竟是谁。", effects: { media: -5, player: -3 } }
        ]
    },
    6: {
        title: "青训天才",
        description: "青年队最近冒出来一个极具潜力的球员，在青年队中大杀四方，甚至已经有球迷开始拿他和传奇名宿比较。但问题是，他最近越来越不拿教练当回事了，训练迟到、拒绝加练，甚至还在采访里说\"一线队的防守也就那样\"，你选择：",
        options: [
            { text: "直接提拔进一线队，让他知道职业足球到底是什么强度。", effects: { player: 7, trust: -5 } },
            { text: "让青年队教练狠狠敲打他。", effects: { player: 3, fans: -3 } },
            { text: "既然这么狂，那就租借出去吃点苦头。", effects: { budget: 400, player: -4, fans: -3 } }
        ]
    },
    7: {
        title: "经纪人来访",
        description: "某主力球员的经纪人突然联系你，他认为自己的客户配得上更高的工资和更多的战术地位。如果球队不能满足要求，他不排除在下个转会窗推动转会。更麻烦的是，这件事已经被媒体知道了，你选择：",
        options: [
            { text: "尝试提前续约，稳定更衣室情绪。", effects: { budget: -600, player: 6, media: 3 } },
            { text: "我们没有更多的预算，很抱歉。", effects: { player: -6, media: -4 } },
            { text: "答应他的要求，如果留不住人，至少也要留住一笔钱。", effects: { budget: 600, player: -4, media: -3 } }
        ]
    },
    8: {
        title: "名宿声援",
        description: "球队的名宿在节目中力挺你对球队的付出，称你为’真正的米兰人’。管理层对此颇有微词，他们认为球队不应该听名宿的话，毕竟这是一家现代化的球队。",
        options: [
            { text: "我管不了所有名宿的嘴。", effects: { trust: -6, fans: 6 } },
            { text: "收集一些赞美管理层的新闻。", effects: { trust: 6, fans: -6 } },
            { text: "在节目上表示自己要学的还有很多。", effects: { media: 5, trust: -3 } }
        ]
    },
    9: {
        title: "裁判的哨子",
        description: "球队连续两场比赛没有在某位知名裁判手中得到公正的判罚，球迷认为无论如何不能让他继续当米兰比赛的裁判了，你选择：",
        options: [
            { text: "保持克制，相信裁判会给出合理的解释。", effects: { media: 5, fans: -5 } },
            { text: "在媒体采访时对裁判开炮。", effects: { fans: 5, budget: -200 } },
            { text: "拒绝讨论裁判，希望球迷更加关注球员的表现。", effects: { fans: -5, player: 5 } },
            { text: "向你熟悉的媒体求助，究竟哪里惹着这位裁判了？", effects: { fans: 5, player: 5 }, condition: () => gameStats.media > 80 }
        ]
    },
    10: {
        title: "天价转会",
        description: "利雅得新月报价米兰的头号射手，他们开出了2000w欧的价格，管理层认为这是不可多得的好买卖，而球迷则希望你能尽力留下他，你选择：",
        options: [
            { text: "公开表示球队会尽全力留下核心球员。", effects: { fans: 5, trust: -5 } },
            { text: "向媒体解释这名球员不属于米兰考虑出售的球员之一。", effects: { trust: -5, player: 5 } },
            { text: "提前联系替代者，并询问球员团队的意向。", effects: { budget: 1000, fans: -10, player: -10 } }
        ]
    },
    11: {
        title: "豪车事故",
        description: "球队的一位年轻球员凌晨开着法拉利撞上了路边护栏，幸好人没事，但照片已经传疯了。球迷们认为这名球员可能是酒驾或毒驾，赞助商问你球员发生车祸的时候怎么还穿着球衣呢？他以为他是勒克莱尔吗？这多破坏我们品牌的形象。你选择：",
        options: [
            { text: "让球员公开道歉，并承担全部责任。", effects: { media: 6, player: -5 } },
            { text: "内部低调处理，尽量别再扩大影响。", effects: { media: 3, trust: -5, budget: -400 } },
            { text: "直接罚款停训。", effects: { fans: 6, player: -5 } }
        ]
    },
    12: {
        title: "汇报之争",
        description: "你在转会决策和球队建设上几乎没有话语权，富尔拉尼要求你跟他直线汇报，卡尔迪纳莱坚持只说英语，同一个球员的引援，你做了三份报告，第一份发给富尔拉尼，第二份发给卡尔迪纳莱，第三份解释为什么这两份报告的侧重点不同，你选择：",
        options: [
            { text: "将富尔拉尼作为主汇报人。", effects: { trust: 5, budget: 200 } },
            { text: "将卡尔迪纳莱作为主汇报人。", effects: { trust: 5, budget: 200 } },
            { text: "不做单线汇报，只在他们都在场的时候说事。", effects: { media: 3 } }
        ]
    },
    13: {
        title: "断尾求生",
        description: "球队在本赛季的预算即将见底！某个传统豪门俱乐部以一个不算太高的价格报价你们的主力前锋，如果卖掉他，在下个转会窗你们将非常被动，可是如果不卖他，很有可能你们连这个赛季末都撑不过去。你选择：",
        options: [
            { text: "相信球员的凝聚力，拒绝出售。", effects: { player: 3 } },
            { text: "答应对方的报价，先解决燃眉之急再说。", effects: { player: -5, budget: 500 } },
            { text: "只值这么点钱？要求对方提高报价。", effects: { player: -3 }, chain: { eventId: 'sinkOrSwim2', probability: 1.0 } }
        ]
    },
    sinkOrSwim2: {
        title: "断尾求生Ⅱ",
        description: "之前报价的豪门俱乐部稍微提高了一点价格，虽然他们不知道现在你们还是否需要，在加价的基础上，他们愿意将刚买来的小将放在米兰租借两年，你选择：",
        options: [
            { text: "比起人我们更需要钱，继续要求抬高价格。（谈判破裂，无影响）", effects: {} },
            { text: "敲定合同，迅速出售。", effects: { budget: 600, player: -5 } },
            { text: "这名球员对我们来说不可替代。", effects: { player: 2 } }
        ]
    },
    14: {
        title: "票价上涨",
        description: "管理层希望能够提高门票的价格，我们门票的收入只有其他豪门的五分之一！现在最便宜的票才五欧元，从这方面我们根本赚不到钱。你选择：",
        options: [
            { text: "保持现在的票价，再上涨没人来看球了。", effects: { fans: 5 } },
            { text: "略微上调票价，毕竟翻修球场也是需要钱的。", effects: { fans: -2, budget: 200 } },
            { text: "大幅度上调票价，豪门就要有豪门的价格！", effects: { fans: -10, trust: 2, budget: 500 } }
        ]
    },
    15: {
        title: "大数据时代",
        description: "管理层引入了'魔球系统'来帮助决策在转会窗要如何操作，你试用了这套系统，发现漏洞百出，基本是科技公司用来骗老板钱的，你选择：",
        options: [
            { text: "缄口不言，转会窗时根据系统的提示操作。", effects: { trust: 5, budget: 100, player: -2 } },
            { text: "提醒管理层现在还没有智能AI。", effects: { trust: -5 } },
            { text: "询问管理层为什么不自己下载一个足球经理玩。（结局）", effects: {}, ending: 'seasonTrust' }
        ]
    },
    16: {
        title: "翻修草坪",
        description: "草坪实在是太硬了，队医跟你沟通这样的球场很不适合球员进行高强度的跑动，并且现在球员摔伤也是个大问题。翻修一下可能会花掉一大笔预算，你选择：",
        options: [
            { text: "草坪都斑秃了必须要修。", effects: { budget: -200, player: 3 } },
            { text: "还可以对付着用一段时间。", effects: { player: -2 } },
            { text: "把账单发给国际米兰，让对方也出一部分。", effects: { budget: -100, player: 2 } }
        ]
    },
    18: {
        title: "干扰训练",
        description: "你在训练场旁边陪伴球员训练的照片被拍了下来，照片里，你神情严肃地跟另外一名球员在说些什么。媒体认为你是因为训练效果不佳训斥球员，部分球迷说你站在场边是在给教练施压干扰训练，你选择：",
        options: [
            { text: "以后不去训练场了。", effects: { trust: -5, fans: -5 } },
            { text: "冷淡回应，以后和球员单独聊天时回避镜头。", effects: { media: -5 } },
            { text: "干脆不回应。", effects: { fans: -3 } }
        ]
    },
    19: {
        title: "超时罚款",
        description: "米兰在客场对阵其他球队的比赛，因为无正当理由将开场时间推迟了两分钟。意大利足协按照规定，将对米兰处以罚款50w欧的惩罚。",
        options: [
            { text: "确认", effects: { budget: -50 } }
        ]
    },
    20: {
        title: "聘请新闻官",
        description: "随着球队在赛后接受的采访越来越多，独家媒体、当地体育报、其他联赛外派意甲的记者都想单独跟你们聊上几句。你分身乏术，只好请求管理层聘请一位专业的新闻发言人，让球队更好地处理和媒体的关系，管理层却认为没这个必要。“如果你愿意自己出钱的话，我不介意米兰内洛多一个人。”CEO这样回复你，你选择：",
        options: [
            { text: "我的钱就是球队的钱，拿工资聘请一位新闻发言人。", effects: { media: 3 }, suspicion: 1 },
            { text: "谁上班给公司贴钱，不再提出聘请新闻发言人的事。", effects: { trust: -3 } },
            { text: "没有新闻发言人，那只能把球员推出去当发言人了。", effects: { media: -2, player: -2 } }
        ]
    },
    17: {
        title: "德比失利",
        warningStyle: true,
        description: "输给国际米兰！这是谁都不愿意看到的事，球迷对球队的支持大幅度下降了，媒体却津津乐道，在接下来的一周，这场比赛中能被清算的还有很多。",
        note: "（发生此事件时球迷满意度-5，媒体声望-3）",
        options: [
            { text: "继续", effects: { fans: -5, media: -3 } }
        ]
    },
    derbyWin: {
        title: "德比获胜！",
        description: "你们赢下了万众瞩目的米兰城德比，球迷们非常高兴，球队的影响力也上升了。",
                note: "（发生此事件时球迷满意度+5，媒体声望+3）",
        options: [
            { text: "继续", effects: { fans: 5, media: 3 } }
        ]
    },
    unknownOneI: {
        title: "无名小卒Ⅰ",
        mainline: true,
        description: "夏天开始，你升任了技术总监，提交了一份让董事会皱眉的引援名单，上面没有一个他们熟悉的名字，全是在中下游球队踢球、二十多岁的年轻人。一个葡萄牙边锋、一个法国左后卫……你和球探都认为他们天赋异禀，但管理层颇为不满，他们认为这是一笔回不了本的投资。就连那些信任你的同事也产生了怀疑，如果你们要购入这些年轻人，就意味着队里那些受球迷喜爱的小将不得不被清洗腾出位置的时候了。",
        options: [
            { text: "力排众议，全力押宝年轻人。", effects: { trust: -5 }, unknownOptNum: 1 },
            { text: "只买几个年轻人，留住老将。", effects: { fans: 5 }, unknownOptNum: 2 },
            { text: "听管理层的，买已经被验证过的球员。", effects: { trust: 5, fans: 5 } }
        ]
    },
    transferRightsA: {
        title: "转会操作权",
        mainline: true,
        description: "你花了一个周末的时间制作了更详尽的方案，由于你在上个赛季的表现深得管理层的信任，他们为你增加了一点预算，你可以在本次夏窗购入最多【四名】球员。本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { budget: 500 }, transferSlots: 4 }]
    },
    transferRightsB: {
        title: "转会操作权",
        mainline: true,
        description: "你留下了一部分老将，由于你在上个赛季的表现深得管理层的信任，他们为你增加了一点预算你可以在本次夏窗最多购入【两名】球员。本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { budget: 500 }, transferSlots: 2 }]
    },
    transferRightsC: {
        title: "转会操作权",
        mainline: true,
        description: "你的决定在球迷中引起了一部分讨论，他们倍受喜爱的球员有可能在夏窗被出售，他们在球员的社交媒体下疯狂发消息。他们的态度如何变化，就要看这个夏天你签下的球员是否能让他们满意了。你可以在本次夏窗最多购入【三名】球员。本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { fans: -1 }, transferSlots: 3 }]
    },
    transferRightsD: {
        title: "转会操作权",
        mainline: true,
        description: "在新人和老将之间做取舍是一个痛苦的决定，你认为不能大刀阔斧的变革，仅仅清理一部分不适合的球员就够了。这个夏窗，你暂时没有太多的决定权。你可以在本次夏窗最多购入【一名】球员。本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: {}, transferSlots: 1 }]
    },
    ffp1: {
        title: "FFP的绞索Ⅰ",
        mainline: true,
        description: "金元足球的热量褪去后，给你们带来了数不清的烂摊子，这笔烂账之前不关你事，但要是这个赛季结束后还缠在你的脖子上，那么欧足联就要给你找大麻烦了。欧足联的审计员皮笑肉不笑地坐在你的办公室里，你选择：",
        options: [
            { text: "召集另一个审计团队，想方设法凑出利润来。", effects: { trust: 5, budget: -200 }, chain: { eventId: 'ffp2', probability: 1.0, minRound: 16 } },
            { text: "私下谈谈欧足联的口风，寻求和解的可能。", effects: {}, chain: { eventId: 'ffp2', probability: 1.0, minRound: 16 } },
            { text: "强硬宣称FFP规则不公，保护的是豪门，而非我们这种需要重建的球队。", effects: { trust: -10, media: 3, budget: -500 }, chain: { eventId: 'ffp2', probability: 0.5, minRound: 16 } }
        ]
    },
    ffp2: {
        title: "FFP的绞索Ⅱ",
        mainline: true,
        description: "财务团队给你的答案只有一个，靠正常经营，哪怕一线队加上教练都去卖沟子这账也平不了。你们只会陷入更深的漩涡：没钱买球员，只能不断地卖人，你选择：",
        options: [
            { text: "主动认罚，放弃一年欧战，获得喘息的机会。", effects: { budget: 800, media: -5 }, euroBan: true, chain: { eventId: 'ffp3', probability: 1.0, immediate: true } },
            { text: "打包三位主力球员一起买了，获得更多预算。", effects: { budget: 1500, fans: -5, player: -10 } },
            { text: "拒绝认罚，赌欧足联不会真的禁赛两年。（概率结局）", effects: {}, endingChance: { endingId: 'hardClash', probability: 0.5 } }
        ]
    },
    ffp3: {
        title: "处罚结果",
        mainline: true,
        description: () => {
            const base = '你和主教练走进更衣室向球员们宣布了欧足联的处罚决定：下赛季米兰将不得参加所有的欧战赛事，更衣室的气氛有短暂的停滞。';
            if (gameStats.player >= 60 && gameStats.ranking <= 3) {
                return base + '队长在此时站出来说，那么，我们就拿下那个该死的意甲冠军！更衣室重新开始骚动起来，你们的确离这个目标很近，部分球员受到了鼓舞。（【球员状态】+2）';
            }
            return base;
        },
        options: [
            { text: '确认', effects: {},           condition: () => !(gameStats.player >= 60 && gameStats.ranking <= 3) },
            { text: '确认', effects: { player: 2 }, condition: () => gameStats.player >= 60 && gameStats.ranking <= 3 }
        ]
    },
    euroNight1: {
        title: "欧联之夜Ⅰ",
        mainline: true,
        description: "小组赛之夜，你们踢得毫无章法，前锋暴力射门，后防却门洞大开。加图索在场边心急如焚，球员们却跟无头苍蝇一样乱窜。比赛结束，你们在小组赛出局了，CEO给你发了条消息：\"我们要谈谈换教练的事。\"",
        options: [
            { text: "向媒体和管理层公开揽责，宣称是自己的问题。", effects: { trust: -5, media: 3 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } },
            { text: "自己和教练都是一根绳上的的蚂蚱，等待管理层的安排。", effects: { trust: 2 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } },
            { text: "暗示主要是教练的责任，提出想换帅。", effects: { media: 3, player: -5 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } }
        ]
    },
    euroNight2: {
        title: "欧联之夜Ⅱ",
        mainline: true,
        description: "上一次欧战给你们的打击还没有过去，联赛多轮不胜又来了，外界对于换帅的呼声越来越高。你看向这位米兰名宿，你和加图索曾是关系紧密的队友。你深知他的性格，已经做了能为米兰做的一切，你选择：",
        options: [
            { text: "替他担保，认为他再干一个赛季会更好。", effects: { trust: -2 }, chain: { eventId: 'farewell', probability: 1.0, minRound: 38 } },
            { text: "体面换帅，向媒体直言他已经做到最好。", effects: { trust: 2, media: 2 }, chain: { eventId: 'farewell', probability: 0.5, minRound: 38 } },
            { text: "下最后通牒，给他时间证明自己。", effects: { trust: 5, player: -3 } }
        ]
    },
    farewell: {
        title: "告别",
        mainline: true,
        description: "加图索最终还是离开了，在多方压力下，拿着一只受FFP约束、临时拼凑的球队，以惨败的结局收场。他没有要遣散费。这是我能留给米兰的最后一笔钱了。离开之前，他感谢了你在这个赛季对他的帮助。",
        options: [
            { text: "确认", effects: {} }
        ]
    },
    reputation: {
        title: "风评",
        mainline: true,
        description: "你在第一赛季的表现获得了球迷的尊重和管理层的认可，球迷满意度和董事会信任度提升了。（【球迷满意度】+10，【董事会信任度】+10）",
        options: [
            { text: "确认", effects: { fans: 10, trust: 10 } }
        ]
    },
    scudetto1: {
        title: "去他的FFP，我们是冠军！",
        mainline: true,
        description: "没人相信你们能成功，在FFP和换帅危机给予的巨大压力下，你们在关键局扳平意想不到的强队。这只米兰的战术水平和身体素质在你和主教练的操练下达到了巅峰状态，不止一个球员给你发过消息：我们真的有可能获得意甲冠军吗？现在你可以回答了，是的，完全有可能。\n这是米兰所有球员梦寐以求的时刻，他们把你视作一切的转机，认为你才是力挽狂澜的那个人。你将如球员时代一样登上庆祝的花车，球员将你环绕时你甚至有些呼吸急促，尽情庆祝吧！",
        options: [
            { text: "确认", effects: {} }
        ]
    },
    newCoach: {
        title: "新教练",
        mainline: true,
        description: "新来的教练皮奥利试图引进与前教练不同的编排，他以4-4-2作为球队主要的阵型，而这种阵型并不适配米兰目前的板凳厚度。教练上任初期需要来自你的支持，你选择：",
        options: [
            { text: "支持教练，米兰不适合频繁换帅。", effects: { player: 3 } },
            { text: "和教练沟通，承诺冬窗会根据他的想法选人。", effects: {}, winterSlot: 1 },
            { text: "和管理层沟通，认为需要立刻更换这个教练。", effects: { trust: 5, player: -5 } }
        ]
    },
    xmasHorror: {
        title: "圣诞夜惊魂",
        mainline: true,
        description: "仅仅在AC Milan的120岁生日后的第三天，这个圣诞夜，你们在客场以0：5憾负亚特兰大。社交媒体上，皮奥利的名字后面跟着\"下课\"的标签，同事悄悄给你发来消息：\"保罗，你是不是看走眼了？\"。\n你清楚，如果再来一场这样的大败，你和他就得一起滚蛋了。",
        options: [
            { text: "谢绝媒体采访，在更衣室内部召开会议，重建信心。", effects: { player: 3, media: -3 } },
            { text: "向董事会申请预算，承诺在冬窗补强。", effects: { budget: 200, trust: -3 } },
            { text: "安抚教练，球队正在重建期，这不是他的错。", effects: { player: 1 } }
        ]
    },
    oldFriend: {
        title: "曾经的传奇",
        mainline: true,
        description: "一位朋友，一位辗转过半个欧洲的传奇前锋，他的电话现在躺在你的联系簿里。他曾说过如果米兰需要他，他就会回来，他从未对其他球队做出过这样的承诺。",
        options: [
            { text: "拨通电话，询问他愿不愿意回来。", effects: {}, nextEvent: 'instruction', winterReturn: 100 },
            { text: "等待他出现在转会市场上，通过球员经纪人联系。", effects: {}, winterReturn: 1000 },
            { text: "放弃这个想法，靠现有阵容一样能赢。", effects: { player: 1, trust: 1 } }
        ]
    },
    instruction: {
        title: "指示",
        mainline: true,
        description: "电话那头沉默了几秒，他狂妄地笑起来：“你们签下兹拉坦，就已经具备了获得意甲冠军的一切了！”",
        options: [
            { text: "确认", effects: {} }
        ]
    },
    news01: {
        title: "确定回归：伊布说“yes”",
        newsStyle: true,
        no: "01",
        source: "Goal.com",
        content: "这桩悬念终于接近尾声。据天空体育报道，伊布已经在当天对回归红黑军团给出了肯定的答复：要么现在，要么永不——答案是“yes”。\n对伊布拉希莫维奇来说，重返米兰将发生在他首次加盟米兰十年之后。这位前巴黎圣日尔曼球员曾在阿莱格里手下度过两个赛季，并赢得一座意甲冠军——那是尤文图斯绝对统治时代到来前米兰赢得的最后一座。自那以后，米兰经历了巨大的失望，如今，他们决心正是要靠着这位瑞典人在联赛中重新崛起。",
        options: [
            { text: "继续", effects: {} }
        ]
    },
    newsTomori: {
        title: "转会内幕：托莫里忆加盟米兰细节",
        newsStyle: true,
        source: "The Athletic",
        content: "当我把这件事告诉支持我的爸爸时，他的第一个问题竟然是：“保罗·马尔蒂尼为什么要找你说话？”\n哈哈哈！真谢谢您啊，老爸。\n我向他解释说，马尔蒂尼是AC米兰的体育总监，他打电话来是想探探我的口风，看我有没有兴趣租借过去。其实在整个 Zoom 通话过程中，我自己也完全不敢相信。我就坐在那儿看着他，听着他说话，但脑子里根本没真正反应过来。\n心里一直在想：这真的是保罗·马尔蒂尼啊。我居然在和保罗·马尔蒂尼聊天。哪怕以后什么都没发生，我至少也能吹一辈子：我和保罗·马尔蒂尼说过话。\n我爸爸是米兰的超级粉丝，他是尼日利亚人，从小就追随最顶级的欧洲足球。在他那个年代，米兰就是足坛的霸主——感觉他们每年都在拿欧冠冠军。当他意识到我接到的电话是真的以后，他兴奋得不行，甚至开始给我上起了米兰的历史课。我只能坐在那儿，心想：“行了，谢谢您嘞。我好歹也算懂点足球吧。”",
        options: [
            { text: "继续", effects: {} }
        ]
    },
    newsLeao: {
        title: "国米？米兰？",
        newsStyle: true,
        source: "Fanpage.it",
        content: "莱奥坦言，在2019年夏天，他其实已经非常接近加盟AC米兰的同城死敌国际米兰了。里尔的体育总监路易斯·坎波斯（Luís Campos）甚至已经告诉他：“拉法，我们要把你卖给国米了。”莱奥原本有些犹豫。\n结果两周后，事情发生了戏剧性的逆转。坎波斯告诉他，米兰开出了一份报价，并且有人想直接和他对话。\n莱奥回忆道：“他递给我一部手机，那不仅仅是一通普通电话，而是一通视频电话。屏幕里出现了保罗·马尔蒂尼。马尔蒂尼对我说：‘你必须来（米兰），我们已经准备好签下你了。’ 我从他身上感受到了非常棒的能量。看到他的那一刻，我根本无法说‘不’，我立刻回答：‘我接受！’”",
        options: [
            { text: "继续", effects: {} }
        ]
    },
    effective: {
        title: "卓有成效",
        mainline: true,
        description: "伊布拉希莫维奇加入后，给球队带来了不一样的斗志，媒体形容他“点燃了球场”。他严格要求队里的每一个人，以20场11球的效率横扫全场，但很快，有队员私下找你倾诉球队氛围太压迫，管理层也对他的个人风格感到不满，你选择：",
        options: [
            { text: "伊布拉希莫维奇是毋庸置疑的团队领袖。", effects: { trust: -3, player: -3 } },
            { text: "伊布拉希莫维奇的行为应该得到控制。", effects: { trust: 5 } },
            { text: "坐视不理，相信球队有自己的自适应机制。", effects: { media: 3 }, brawlChance: 0.5 }
        ]
    },
    lockerBrawl: {
        title: "更衣室斗殴",
        mainline: true,
        description: "小道消息，米兰的更衣室新来的球员性情暴虐，左手持棍，右手拿刀，在更衣室左右手开弓，打得那些年轻小球员都不敢跟他在一张桌子上吃饭，你选择：",
        options: [
            { text: "查清真相。", effects: { trust: -5 } },
            { text: "置之不理。", effects: { media: -5 } }
        ]
    },
    support: {
        title: "必要的支持",
        mainline: true,
        repeatable: true,
        description: "“保罗，为什么他只给另一位球员加练？”“保罗，他怎么能怀疑教练的权威，他是来当管理的还是来踢球的？”“媒体说，伊布拉希莫维奇给团队带来了太大压力。”\n这名球员给球队带来变化的同时，也带来了怀疑。你需要牺牲一些风评，来换取对他的支持。\n（新增赛季任务：为兹拉坦获得三个支持点，可重复选择，亦可在【赛季任务】面板中继续。）",
        options: [
            { text: "让球员明白兹拉坦才是球队的核心。", effects: { player: -10 }, supportPoint: 1 },
            { text: "告诉管理层，没有兹拉坦我们无法完成赛季目标。", effects: { trust: -10 }, supportPoint: 1 },
            { text: "警告媒体不要再报道有关更衣室的不实传言。", effects: { media: -10 }, supportPoint: 1 }
        ]
    },
    mug1: {
        title: "童年的马克杯Ⅰ",
        mainline: true,
        description: "谈判桌对面坐着一个二十岁的意乙中场，被誉为“新皮尔洛”，你看过他的录像带，从技术上讲离皮尔洛还差着一截。可让你意外的是，他几乎是含着泪在恳求加盟。\n“米兰是我儿时的梦。”他这么说。\n为了穿上这件红黑球衣，他主动提出降薪，你选择：",
        options: [
            { text: "承诺如果转会窗有预算就会买断他。", effects: { player: 1 }, mug07Cost: 700 },
            { text: "继续压价，以球队目前的状况需要更低的价格。", effects: {}, mug07Cost: 500 },
            { text: "拒绝，认为他水平不够。", effects: {}, mug07Cost: 0 }
        ]
    },
    mug2: {
        title: "童年的马克杯Ⅱ",
        mainline: true,
        description: "拖哪里不知道你对他最终的报价是否满意，但当他和你再次见面时，他提出想要八号作为自己的号码。那是你曾经的队友，那位‘中场绞肉机’留下的，他是否配得上这个数字？你选择：",
        options: [
            { text: "询问加图索的意见。", effects: { player: 1 }, mugPact: true },
            { text: "把八号郑重交给他。", effects: {}, mug07Trust: 1 },
            { text: "先让他用目前的号码踢一段时间。", effects: { player: -1 } }
        ]
    },
    mugPact: {
        title: "约定",
        mainline: true,
        description: "“他是个好小伙子。”加图索说，“意大利青训能踢上意甲的球员越来越少了，我希望他能一直留在米兰，当然，只是我希望！再怎么说，我们谁也不能决定他的路，把这个号码给他吧！就当是我和他之间的约定。”",
        options: [
            { text: "确认", effects: {}, mug07Trust: 1 }
        ]
    },
    betKing1: {
        title: "赌王传奇Ⅰ",
        mainline: true,
        description: "队内的核心成员竟然被发现有赌博的习惯！据你所知，他几乎会下注自己参与的每一场比赛，在媒体、管理层和教练都不知道这件事之前，你决定：",
        options: [
            { text: "将此事报告给管理层，希望能够尽早将此球员转会。", effects: { trust: 5, player: -5 }, betKingSkip: true },
            { text: "和此球员私下聊聊，让他亲自告诉你这件事是否属实。", effects: {}, mug07Trust: 1 },
            { text: "球队正是需要他的时候，装作没看见。", effects: { fans: 5 } }
        ]
    },
    betKing2: {
        title: "赌王传奇Ⅱ",
        mainline: true,
        description: "媒体拿到了切实的证据，你之前怀疑的那名球员确实频繁参与了赌博，他被指控赌过米兰自己的比赛，面临禁赛和高额罚款的惩罚，有媒体指责你早就是知情人士，却对此隐瞒不报，你选择：",
        options: [
            { text: "承担责任，俱乐部在这件事上失职了。", effects: { trust: -7, media: 3 }, mug07Trust: 1 },
            { text: "矢口否认，把责任推给球员。", effects: { media: -7, player: -7 } },
            { text: "付钱让媒体压稿，抢在禁赛前高价把他卖掉。", effects: { budget: 600, fans: -7, media: -7 }, betKingSkip: true, remove07: true }
        ]
    },
    betKing3: {
        title: "赌王传奇Ⅲ",
        mainline: true,
        description: "那名球员主动向你坦白：他其实深陷赌瘾，愿意配合调查并且接受治疗以换取减刑。他问你：俱乐部还会要他吗？你选择：",
        options: [
            { text: "支持他认罪治疗，承诺留队等他回来。", effects: { fans: 7, player: 7, media: -3 }, mug07Trust: 1 },
            { text: "希望他配合处罚，但球队不能留下赌徒。", effects: { trust: 5, player: -5 } },
            { text: "直接以赌博为理由，和这名球员解约。", effects: { budget: 200, player: -7, fans: -5 }, remove07: true }
        ]
    },
    ourResponsibility: {
        title: "我们的责任",
        mainline: true,
        description: "你选择以球队官方的身份接受媒体的采访，面对球迷的困惑和媒体的诘问。你承认在面对年轻球员时，球队，或者说我们，我本人做得还不够。记者的眼中满是质疑，你们在此之前完全不知情？米兰考虑出售这名球员吗？你否认了，在六个月的禁赛后，球队仍然会和他站在一起。",
        options: [
            { text: "确认", effects: {} }
        ]
    },
    gamblerEnd: {
        title: "赌徒的终局",
        mainline: true,
        description: "他最终自愿离队，留下了一笔转会费。自愿离队是两边都好听的说法，实际上米兰是公事公办地抛弃了他。一个赌徒无法再站上意甲的赛场，禁赛期后，你重新在其他球队的录像里看见他，他不再执着于某一个号码。\n你选择了及时止损，连他自己也不清楚，禁赛期后他重返的到底是赛场还是赌场。",
        options: [
            { text: "确认", effects: {}, remove07: true }
        ]
    },
    farCall: {
        title: "远方来电",
        mainline: true,
        description: "深夜，伊布拉希莫维奇给你带来了一部电话，老式翻盖手机，你接起它，一个带着伦巴第大区口音的女声在夜里盘旋。“感谢你重新来到这，你让我再一次复苏了，请你也接受我微薄的帮助。”你知道，她就是【米兰】本身。\n现在，你可以使用【魔力电话】，它将为你当前四项数值中最低的那项增加十五个点数。请注意，不要太过频繁地寻求米兰的帮助。",
        options: [
            { text: "确认", effects: {}, unlockMagicPhone: true }
        ]
    },
    emoOutburst: {
        title: "下一个左后卫Ⅰ",
        mainline: true,
        description: "你亲自谈来的左后卫在一次毫无必要的肢体冲突上拿了红牌，这让米兰的所有人都大跌眼镜。赛后，他懊恼地坐在更衣室等待教练找他谈话，你选择：",
        options: [
            { text: "上前安抚，询问他当时发生了什么。", effects: { player: 2 }, trust01: 1, chain: { eventId: 'nextLeftBack2', probability: 1.0, afterRounds: 4, immediate: true } },
            { text: "默不作声地离开，相信他能自己处理。", effects: { player: 2 }, chain: { eventId: 'nextLeftBack2', probability: 1.0, afterRounds: 4, immediate: true } },
            { text: "要求教练严肃批评。", effects: { trust: 2 }, chain: { eventId: 'nextLeftBack2', probability: 1.0, afterRounds: 4, immediate: true } }
        ]
    },
    nextLeftBack2: {
        title: "下一个左后卫Ⅱ",
        mainline: true,
        description: "教练三番五次私下向你暗示，你寄予厚望的那名左后卫不太自律。你认为他以意大利的标准来说还算守时，训练中也足够刻苦，你认为：",
        options: [
            { text: "问题也许出在饮食上。", effects: { player: 2 } },
            { text: "搜查球员的个人社交账号。", effects: { player: 1 }, trust01: 1 },
            { text: "训练刻苦就足够了，不关心私人生活。", effects: { player: -1 } }
        ]
    },
    nextLeftBack3: {
        title: "下一个左后卫Ⅲ",
        mainline: true,
        description: "这名球员的技术越来越成熟，有时甚至会给你带来惊喜。上场比赛，他从后卫的位置开始带球，一路前插，最终以一脚恰到好处的进球帮助球队锁定胜局。他越过栏杆，接受球迷们狂热的欢呼。赛后，他激动地抱住了你，你选择：",
        options: [
            { text: "表扬他阅读比赛的能力。", effects: { player: 2 }, trust01: 1 },
            { text: "告诉他后卫应该积极前插。", effects: { player: -2 } },
            { text: "感谢他为米兰夺得这场比赛的胜利。", effects: {}, trust01: 1 }
        ]
    },
    buyoutTomori: {
        title: "买断我！保罗！",
        mainline: true,
        description: "正在你为即将到来的夏窗焦头烂额时，同事给你转发了一段视频。视频中，一位上赛季租借来米兰的英格兰球员在一次私下聚会中喝醉了酒，他紧紧搂着丹尼尔·马尔蒂尼，对着镜头大喊：“买断我！保罗！”。<br>球队的决策不是由你一人做出，在此刻，你选择：",
        options: [
            { text: "尽力在转会窗中优先买断这名球员。", effects: {}, disc04: 500 },
            { text: "以球队现在的状况，还得降价才能买得起。", effects: {}, disc04: 700 },
            { text: "自己无法左右球队的夏窗策略。", effects: {}, disc04: 0 }
        ]
    },
    transferRumor: {
        title: "转会传闻！",
        mainline: true,
        description: "你的球队中有两名重量级球员的经纪人告知你他们要离队，其中一位收到了国际米兰的报价，另一位则是想以自由人的身份离队，你选择：",
        options: [
            { text: "进入第一位球员的谈判，球迷无法接受球员轻易转投国际米兰。", effects: {}, negotiation: ['calhanoglu'] },
            { text: "进入第二位球员的谈判，自由离队会给球队带来损失。", effects: {}, negotiation: ['donnarumma'] },
            { text: "同时进入两位球员的谈判。", effects: {}, negotiation: ['calhanoglu', 'donnarumma'] }
        ]
    },
    windowSummerSoon: {
        title: "夏窗即将开始",
        mainline: true,
        description: "本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: {} }]
    },
    windowWinterSoon: {
        title: "冬窗即将开始",
        mainline: true,
        description: "本轮比赛结束后，将开启冬季转会窗。",
        options: [{ text: "了解", effects: {} }]
    },
    newsCompilation: {
        title: "重磅新闻！",
        newsCompilation: true,
        items: [
            {
                title: "埃利奥特致全球AC米兰球迷的感谢信",
                source: "埃利奥特集团",
                content: "“......我们已达成协议，将埃利奥特（Elliott）在AC米兰的控股权转让给红鸟资本（RedBird Capital Partners），同时埃利奥特仍将是俱乐部的重要投资者，并保留董事会席位。\n红鸟在米兰身上看到了与我们当年相同的机遇。在交接接力棒的过程中，我们强调了三个核心价值：共同的目标、战略的延续性以及财务的稳健性。基于这些达成的共识，并凭借红鸟在体育投资领域的卓越过往业绩，我们深信红鸟完全有能力继续推进我们对米兰的共同愿景。”"
            },
            {
                title: "卡尔迪纳莱的雄心",
                source: "《今日米兰》",
                content: "红鸟创始人兼管理合伙人杰里·卡尔迪纳莱（Gerry Cardinale）表示：“我们非常荣幸能成为AC米兰辉煌历史的一部分。俱乐部刚刚重回意甲巅峰，在这个时刻能够携手书写俱乐部的下一个篇章，并放眼未来的欧洲和世界赛场，让我们感到无比兴奋。我衷心感谢戈登·辛格（Gordon Singer）及整个埃利奥特团队在过去四年中所做的卓越工作。\n红鸟的投资哲学和在体育界的过往战绩已经证明：足球俱乐部完全可以在赛场上取得成功的同时，保持健康、可持续的财务状况。”"
            },
            {
                title: "收购背后的财务杠杆",
                source: "《24小时太阳报》",
                content: "“根据《24小时太阳报》披露的内幕，在本次买卖合同中，包含了一笔“卖方借款”（vendor loan）——即由卖家埃利奥特直接向买家红鸟提供的融资支持，金额约为6亿欧元（首期确认约3亿至5-6亿不等）。这也意味着卡尔迪纳莱的基金实际支付了部分现金，其余通过杠杆和后续融资完成。红鸟对米兰未来的核心规划，是将其打造成一家“体育娱乐媒体公司”，并深度开发美国市场。”"
            }
        ],
        options: [{ text: "合上报纸", effects: {} }]
    },
    hesitantContract1: {
        title: "犹豫不决的合同Ⅰ",
        mainline: true,
        description: "尽管你们在上个月月底刚获得意甲冠军，但前东家却迟迟没有和你续约的消息传出。埃利奥特忙于俱乐部的交接。而新东家红鸟资本则与你交谈甚少，你选择：",
        options: [
            { text: "主动询问红鸟资本。", effects: { trust: -5 }, chain: { eventId: 'newsLastMoment', probability: 1.0, afterRounds: 1, immediate: true } },
            { text: "向前东家埃利奥特询问续约情况。", effects: { trust: -7 }, chain: { eventId: 'newsLastMoment', probability: 1.0, afterRounds: 1, immediate: true } },
            { text: "接受媒体采访，向管理层施压。", effects: { trust: -2 }, suspicion: 1, chain: { eventId: 'newsLastMoment', probability: 1.0, afterRounds: 1, immediate: true } }
        ]
    },
    newsLastMoment: {
        title: "最后一刻？",
        newsStyle: true,
        source: "《米兰体育报》",
        content: "......我和马萨拉的合同即将到期，至今没有任何人来找我们谈过。我认为这是一种缺乏尊重的表现，无论是对我们的工作，还是对我们所代表的米兰。如果米兰的所有者只想维持现有的财务平衡，那他们不需要我。\n像米兰这样的俱乐部，不应该只满足于在意甲夺冠，我们必须去欧洲赛场竞争。如果新股东没有一个买入顶级球员、重返欧冠巅峰的宏大计划，那么我们的理念就是不一致的。",
        options: [{ text: "了解", effects: {} }]
    },
    hesitantContract2: {
        title: "犹豫不决的合同Ⅱ",
        mainline: true,
        description: "你的合同在这个月月底到期，红鸟资本提前一周才将新合同发送给你，在粗略的阅读后，你发现管理层提出的预算远低于你的计划，给你和马萨拉的自主权更是进一步被削减，你选择：",
        options: [
            { text: "辞职也不会接受这种合同。（结局）", effects: {}, ending: 'surprise' },
            { text: "和管理层进行协商，希望能更改有关预算的部分。", effects: { player: -5 }, suspicion: 1, chain: { eventId: 'renewal', probability: 1.0, afterRounds: 1, immediate: true } },
            { text: "向管理层解释自己在转会市场上的作用，希望能更改关于转会自主权的部分。", effects: { budget: -500 }, suspicion: 1, chain: { eventId: 'renewal', probability: 1.0, afterRounds: 1, immediate: true } }
        ]
    },
    renewal: {
        title: "续约",
        mainline: true,
        description: "在你恢复自由身的前两个小时，你与管理层完成了续约。",
        options: [{ text: "继续", effects: {} }]
    },
    omniscient1: {
        title: "无所不知Ⅰ",
        mainline: true,
        description: "在赛季刚开始时，管理层曾对你坦言，他们的目标是赢下欧冠。而现在，你发现他们的赢球是建立在算法和数据模型上的。一套他们曾经在法甲图卢兹中试用过的算法——挖掘低价值但高回报的球员。你认为：",
        options: [
            { text: "劝说管理层这套在米兰是行不通的。", effects: { trust: -3 }, suspicion: 1 },
            { text: "质问管理层，这不就是我之前几个赛季在干的事吗？", effects: { trust: -3 }, suspicion: 2 },
            { text: "支持管理层以他们的想法来操作转会。", effects: {}, winterSlot: -1 }
        ]
    },
    omniscient2: {
        title: "无所不知Ⅱ",
        mainline: true,
        description: "在为数不多的几次管理层会议中，你经常能听到CEO说：“虽然我对足球一窍不通，但是——”\n这句“但是”后面总跟着你不想听到的发言，你选择：",
        options: [
            { text: "开会也没几次，忍忍就过去了。", effects: { trust: 3 }, suspicion: -1 },
            { text: "在会上开小差，和马萨拉用眼神交流。", effects: { trust: 1 } },
            { text: "起身走人，一窍不通你还谈什么足球。", effects: { trust: -5 }, suspicion: 2 }
        ]
    },
    nextLeftBack4: {
        title: "下一个左后卫Ⅳ",
        mainline: true,
        description: "你在私人社交媒体上看见了这名球员的派对照片，在背景中，你发现了高度数酒、筹码、以及其他你不觉得球员应该频繁接触的东西，你选择：",
        options: [
            { text: "私下聊天，希望他专注自己的生活。", effects: { player: 2 }, trust01: 1 },
            { text: "严肃批评，禁止他在比赛期放纵自己。", effects: { player: 2 }, trust01: 1 },
            { text: "视而不见，不是专门发到自己手机上的都当没看见。", effects: { player: -2 } }
        ]
    },
    otherSide: {
        title: "另一面",
        mainline: true,
        description: "在你精疲力竭和管理层交涉的过程中，不知道从什么时候起，那个被你关注着的左后卫开始频繁迟到，有一两次还和队友发生了冲突。他将更衣室撕裂成两派，一派和他玩得好，另一派则是吃饭都不愿意坐在一起。\n场下的情绪牵动了场上的表现，当他多次不愿意传球给队友时，球迷和管理层终于爆发。你看好的人或许根本无法承担这份重任。",
        options: [{ text: "继续", effects: {} }]
    },
    successor: {
        title: "接班人",
        mainline: true,
        description: "三号在你退役时被米兰封存，以示俱乐部对你的尊重，除非你本人发话，否则他们绝对不会拿出这个号码给其他的球员。你所看好的那名左后卫也从来没开口要过这个号码，但你觉得，如果有一天这名你亲手带来圣西罗的球员成为米兰的队长，这个号码在他身上会比封存在博物馆里更有意义。",
        options: [{ text: "继续", effects: {} }]
    },
    southStandTalk: {
        title: "南看台的训话",
        mainline: true,
        description: "南看台爆发了骚乱，球迷们激动的拍打着离球场比较近的玻璃。在球队输了比赛后，他们看上去异常愤怒，要求教练和球员都到南看台下和他们进行交谈，你决定：",
        options: [
            { text: "拒绝。球员只需要为球队负责。", effects: { player: 2, fans: -10 } },
            { text: "答应。输比赛应该付出代价。", effects: { player: -5, fans: 5 } },
            { text: "自己去。和南看台打交道当然是自己最有经验。", effects: { player: 5, fans: -3 }, nextEvent: 'eyeContact' }
        ]
    },
    eyeContact: {
        title: "对视",
        mainline: true,
        description: "你一个人来到南看台下，人群中有你熟悉的脸。你站在稍远的地方，没有谈论比赛，而是请球迷们在比赛结束后离场。南看台的赞美、诋毁、嘲讽和狂热你都已经领教过，就算他们明天弄一个你的人偶来场上烧，你也不觉得有什么了。",
        options: [{ text: "返回", effects: {} }]
    },
    footballDispute: {
        title: "Football之争",
        mainline: true,
        description: "管理层想要在夏休期大力发展AC Milan在美国的商业活动，包括但不仅限于举办球赛、见面会和接受媒体人的采访，这能扩宽米兰的商业版图，管理层这样解释。你选择：",
        options: [
            { text: "美国人的Football不是指橄榄球吗。", effects: { trust: -5 }, suspicion: 1 },
            { text: "同意，就当夏休期出去旅游了。", effects: { trust: 3 } },
            { text: "拒绝，认为球员夏休期应当有自己的个人生活。", effects: { trust: -3 }, suspicion: 1 }
        ]
    },
    deadEnd: {
        title: "此路不通",
        mainline: true,
        description: "在你还在当球员的那段时间，意大利足球队中总监和球队分管不同区域，两者各司其职：教练负责训练和战术，而球队总监负责谈判和签约。老板贝卢斯科尼对球队阵型的奇思妙想往往会被加利亚尼和布莱达过滤掉，以减小对教练执教的压力。\n你面临不同的困境：管理层希望能极大程度上控制球队教练的选人思路，你选择：",
        options: [
            { text: "和管理层沟通，希望可以增加预算。", effects: { trust: -3 } },
            { text: "回驳管理层，最好不要插手总监和教练的选人。", effects: { trust: -5 }, suspicion: 1 },
            { text: "和管理层解释米兰传统的更衣室分工。", effects: { trust: -5 } }
        ]
    }
};

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
            '赛季末预算大于 2000w 欧',
            (pendingDifficulty || gameStats.difficulty) === 'hard' ? '排名不低于第 14 位' : '排名不低于第 10 位'
        ],
        taskCheck: () => gameStats.budget > 2000 &&
            gameStats.ranking <= (gameStats.difficulty === 'hard' ? 14 : 10),
        description: [
            '你重新回到了米兰，新资方刚刚接管AC Milan，他们和你一样处处受限。因上个财年多次违反FFP（财政公平法案），欧足联对你们展开了数次调查，要求你们在限期内达到预算平衡，否则将对你们处以禁赛两个赛季作为惩罚。',
            '你必须立刻开始处理球队当中的问题球员，与此同时，管理层提出了要求，你需要在这个赛季内平衡好【预算】和【排名】之间的关系，好在，他们的要求并不是很高。'
        ]
    },
    2: {
        title: '第二赛季·青春风暴',
        tasks: ['拿到欧战资格（赛季末排名不低于第 6 位）'],
        taskCheck: () => gameStats.ranking <= 6 &&
            (!gameStats.supportTaskActive || gameStats.zlatanSupport >= 3),
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
            '在欧冠赛场获得胜利，将会给球队带来巨额奖金和高曝光，但同时，如果在赛场中失利，也会给球队的信心带来一些打击。',
            '无论在欧冠的赛场表现如何，管理层更加看重的是联赛的成绩。您可以在【赛程】中查看欧冠赛场的对手，提高【球员状态】和购入含有【欧冠】标签的球员，会给欧冠赛场带来一些帮助。'
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

const endings = {
    trust: {
        id: 1,
        title: "下课！",
        text: "你在球迷、球员和媒体之间周旋，却忘了维护最重要的关系——球队的管理层，他们对于你散漫的态度十分不满。你提出的预算更是像个笑话，管理层要给球员开工资，要给市政府交税费，还要维护球场，哪来这么多钱！终于，他们找到了一个机会，将你和你的新赛季计划一起打包扔出了圣西罗。"
    },
    media: {
        id: 2,
        title: "守口如瓶",
        text: "所有的通道采访都是陷阱，任何递到面前的话筒都应该警惕。你对待媒体没有走露过任何风声，AC Milan的球员出现在赛后采访的频率也越来越低，你信奉媒体不应该知道太多，直到转播商的投诉信出现在你的邮箱里。现在，你不得不去重新学习如何应付媒体了。"
    },
    fans: {
        id: 3,
        title: "冷漠的球迷",
        text: "看台上不再传来呼声，客场作战时，属于米兰的旗帜少得可怜。球迷们彻底失去了信心，他们不愿意把时间和精力继续投入到这只队伍里，也不记得上一次看到满意的比赛是什么时候了。胜利并非遥不可及，但对米兰来说确实如此。"
    },
    player: {
        id: 4,
        title: "伤病潮",
        text: "球员也不是铁打的！你的鼓励和战术安排反而起了反作用，队员们一个接一个的受伤，队医对此却束手无策。你们从一门换到三门，最后无人可换，球队老板问你，赛季中可以租借球员吗？否则我们哪来的人踢下一场比赛？"
    },
    seasonTrust: {
        id: 5,
        title: "新的一页",
        text: "卡尔迪纳莱给你发送的邮件堆满了邮箱，他的疑问穿插在每一次例会中，为什么免费放走球员？为什么不接受新的管理模式？你认为我的想法不对吗？你疲于解释，深知管理层的意见会一直像口香糖黏在鞋底。在赛季结束后，解约合同通过邮件发送给你，他甚至懒得给你打一个电话。"
    },
    seasonMedia: {
        id: 6,
        title: "边缘球队",
        text: "米兰城还记得这只球队吗？在其他球队花样繁多的花边新闻下，平平无奇的米兰很难获得媒体的关注。媒体们希望能报道一点东西，哪怕只是更衣室的传闻也好，但这支球队无聊到连内鬼都卖不出去消息。"
    },
    seasonFans: {
        id: 7,
        title: "归因者",
        text: "南看台对你的态度不影响你在球员时期获得的荣誉，但却影响你在当总监时的名誉。输球的时候，球迷骂你，赢球的时候，他们问你为什么没赢更多。在这赛季的最后一场比赛，南看台挂出了要求你滚蛋的横幅。和你退役时一样，你知道这块横幅的背面会被他们用来欢迎无论是谁的下一位继任者。"
    },
    seasonPlayer: {
        id: 8,
        title: "战术替换",
        text: "球员们精疲力竭，混乱的轮换制度和一点就炸的更衣室让他们无法得到充分的休息。上个赛季刚来到米兰的球员状态直线下滑，他们开始思考这支球队是否真的适合养老。"
    },
    seasonTrustHigh: {
        id: 9,
        title: "全权委托",
        text: "富拉尼和卡尔迪纳莱为你奉上了一份新合同，你是管理层和球员沟通之间不可或缺的那个人，弥补球迷信任最好用的那管胶水。这份合同的条件比你想的还要慷慨——转会预算的最终签字权、青训体系的话语权，甚至下一任主教练的提名权。\n签字、握手、拍照，闪光灯响起时你愣了一下，究竟是你改造了这家俱乐部，还是这家俱乐部最终也把你变成了\"管理层\"？"
    },
    seasonFansHigh: {
        id: 10,
        title: "马尔蒂尼狂热",
        text: "球迷们简直为你发狂！你才是最懂他们想要什么的人！终场哨响，无论比分如何，南看台都会唱起你的名字，你让这群最挑剔的球迷重新无条件爱上了这支球队。你带来的变化让他们看到希望，你看向观众席，红黑色的海洋几乎要把你的一切淹没。"
    },
    seasonPlayerHigh: {
        id: 11,
        title: "风平浪静",
        text: "更衣室像铁桶一样牢固，没有摔球衣的队长，没有闹着要走的主力，没有递给媒体小道消息的内鬼。某种程度上，球员们不在乎你会买卖谁，因为他们不会受到欺骗。你和核心球员早早敲定未来两年的合同，更衣室不再是风暴的中心，你不相信全武行能打造出钢筋铁骨的球队。"
    },
    seasonMediaHigh: {
        id: 12,
        title: "喉舌",
        text: "你精准的表达和独特的风格使你在媒体中声望颇高，他们相比于采访球员，更愿意采访你。你的发言代表了球队的态度，媒体曲解你、信任你，最后无法离开你。花边新闻和更衣室内幕像色彩鲜艳的广告一样出现在体育报上，你的选择将让这支球队永远不缺少话题。"
    },
    seasonGood: {
        id: 13,
        title: "米兰，米兰",
        text: "在毫无预兆的被开除后，你开车离开了俱乐部，回望球场时，你知道你和米兰的故事还没有结束。"
    },
    fiveSeason: {
        id: 14,
        title: "扫地出门",
        text: "你接到了来自米兰的电话。"
    },
    surprise: {
        id: 17,
        title: "意外？",
        next: 'fiveYears',
        nextText: '继续',
        text: "卡尔迪纳莱的电话，第一个你没接，他又打了第二个，第三个电话爆发出他怒气冲冲的声音：你被解雇了！什么？我在开玩笑，我是认真的，请立刻来米兰内洛签合同。你干的很好？是，大概吧，不过我现在决定解雇你，我当然有这个权力。因为你而续约的球员？我会处理好他们的，马上就有一位新的总监——你还没听懂吗，保罗·马尔蒂尼，你被解雇了！"
    },
    fiveYears: {
        id: 20,
        epilogue: true,
        title: "",
        text: "有一点是确定的：我对米兰的爱永远是无条件的，作为Cesare的儿子，作为球队前队长，作为Christian和Daniel的父亲，他们都曾经效力过米兰，同时也作为一名总监：那是美妙的五年。"
    },
    hardClash: {
        id: 15,
        title: "硬碰硬",
        text: "和欧足联作对没有好下场，你不信这个邪，但米兰现在也不是欧冠的收视王牌了。欧足联毫不留情地给了你们禁赛两年的惩罚。你在总监的位置上还没待上两天，马上就被球迷和管理层轰了下去。运气不好，这次仅仅是运气不好。"
    },
    budgetCrash: {
        id: 16,
        title: "预算崩盘",
        text: "这支球队还需要多少钱？管理层不止一次问你这个问题，经营球队好像一个无底洞，我们在赢球，但还要我赔钱。转播分成更是不够买主力球员的零头！你的老板拿出了各种各样的报告，竭力证明选用其中任何一份方案都不会亏钱，只会比你干得更好，你离开时，他喋喋不休的声音还在继续。"
    },
    sheCame: {
        id: 18,
        title: "‘她来了’",
        text: "米兰已经醒来，所有的球员和球迷都只为她而战。你使用了太多被封印的力量，现在，他们唯一相信的只有这个符号。"
    },
    tomorrow: {
        id: 19,
        title: "明天",
        hidden: true,
        image: "Special_Ending_1.jpg",
        text: () => `尽管你对资方已经足够谨慎，在赛季结束时，你仍然被开除了。这次是什么原因？你知道没有一个总监能做的比你更好了，在任期中，米兰获得了${gameStats.scudettoCount}次联赛冠军，${gameStats.uclTitleCount}次欧冠冠军，管理层最开始给你定下的目标已经被超额完成。
红鸟资本所引入的经营球队的观念让你无法理解，你们谁也无法说服对方。爆发了数次摩擦后，管理层认为解决人比解决事更容易。
你离开后的一切都是可预知的：管理层会分批卖掉那些已经踢出来的小将，回收资金。然后利用那套数据系统买入新一批球员，让球队的排名能够稳定在前四，在接下来的几年中，不断执行这个循环——如果真能这么顺利的话。
在你离开米兰内洛的一个月后，某天早上醒来，一位中间人给你发来消息，曾经接触过收购案的新资方想要联系你，他们资金状况良好，愿意投资，最重要的是，他们不会深度参与球队的日常决策。
新的资方看到了米兰的潜力，以及前几年的惊人成绩，米兰复苏的速度令欧洲足坛震惊。新资方想邀请你重新回到米兰，继续你未完成的事业，你会考虑吗？
你不知道新资方管理下的米兰会是什么样的，但你确定，被红鸟管理的、可预见的那个未来，一定不是米兰的球迷和球员希望发生的。`
    }
};

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
    { name: '博洛尼亚', category: 'low' },
    { name: '卡利亚里', category: 'low' },
    { name: '乌迪内斯', category: 'low' },
    { name: '斯帕尔', category: 'low' },
    { name: '帕尔马', category: 'low' },
    { name: '弗罗西诺内', category: 'low' },
    { name: '恩波利', category: 'low' },
    { name: '切沃', category: 'low' }
];

let currentRandomEvents = [];
let randomEventIndex = 0;
let pendingWarnings = [];
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
    leagueTeams.push(...teams.map(team => ({
        name: team.name,
        category: team.category,
        points: 0
    })));
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
    for (let i = 0; i < availableTeams.length; i += 2) {
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
    const hasMatch = gameStats.lastScore !== '';
    document.getElementById('last-score-home').textContent = hasMatch ? 'AC Milan' : '';
    document.getElementById('last-score-num').textContent = hasMatch ? gameStats.lastScore : '';
    document.getElementById('last-score-away').textContent = hasMatch ? gameStats.lastOpponentDisplay : '';
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
    const opponent = getTeamByName(opponentName);
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
// 赛季开场卡片：第二赛季风评→无名小卒；第五赛季新闻合订本；有欧战资格再补小组赛抽签
function playSeasonOpeningCards() {
    const queue = [];
    if (gameStats.season === 2) { queue.push('reputation', 'unknownOneI'); }
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
    if (season === 2 && gameStats.supportTaskActive) {
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

// 渲染结局卡片（真实结局与图鉴预览共用）。preview=true 时按钮为"返回图鉴"
function renderEndingCard(ending, preview) {
    const modal = document.getElementById('ending-modal');
    const hasTitle = !!ending.title;
    modal.querySelector('.ending-label').style.display = ''; // "结局"标签始终保留
    modal.querySelector('.ending-rule').style.display = hasTitle ? '' : 'none';
    const titleEl = document.getElementById('ending-title');
    titleEl.style.display = hasTitle ? '' : 'none';
    titleEl.textContent = ending.title || '';
    const text = typeof ending.text === 'function' ? ending.text() : ending.text;
    document.getElementById('ending-text').innerHTML =
        text.split('\n').map(p => `<p>${p}</p>`).join('');
    const imgEl = document.getElementById('ending-image');
    if (ending.image) { imgEl.src = ending.image; imgEl.classList.remove('hidden'); }
    else { imgEl.classList.add('hidden'); imgEl.removeAttribute('src'); }
    document.getElementById('restart-game').textContent =
        preview ? '返回' : (ending.next ? (ending.nextText || '继续') : '重新开始');
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
    if (!ending.epilogue) recordAchievedEnding(endingKey); // 尾声卡片不计入图鉴
    renderEndingCard(ending, false);
}

// ===== 结局图鉴（跨存档持久化）=====
const ENDINGS_KEY = 'acm_endings_v1';

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
    gameStats = { trust: initVal, media: initVal, fans: initVal, player: initVal, budget: 1000, points: 0, ranking: 1, round: 0, lastScore: '', lastOpponentDisplay: '', consecutiveNonWins: 0, southStandEventUsed: false, betKingEventUsed: false, rebateEventCount: 0, transferEventUsed: false, carCrashEventUsed: false, sinkOrSwimEventUsed: false, bigDataEventUsed: false, derbyLossEventPending: false, derbyWinEventPending: false, warningEventShown: false, gameEnded: false, season: 1, futureRandomEvents: [], usedMainlineEvents: [], newCoachDone: false, xmasDone: false, oldFriendDone: false, winterWindowDone: false, winterSlotBonus: 0, winterReturnCost: 0, signedPlayers: [], news01Pending: false, news01Done: false, effectiveDone: false, lockerBrawlPending: false, lockerBrawlDone: false, supportTaskActive: false, zlatanSupport: 0, wonScudetto1: false, hasUCL: false, uclBanNextSeason: false, uclFixtures: null, uclStage: null, uclQualified: false, uclGroupPos: 0, uclOutRound: 0, euroType: 'ucl', lastSeasonRanking: 0, uclTagShown: false, mug1Done: false, mug2Done: false, mugPactDone: false, mugPactPending: false, player07WinterCost: 0, player07Trust: 0, player07Removed: false, player01Trust: 0, emoOutburstDone: false, nextLeftBack3Done: false, transferRumorDone: false, donnaNegoDone: false, summerWarnShown: false, winterWarnShown: false, player04Discount: 0, buyoutTomoriDone: false, overtimeFineUsed: false, tomoriNewsPending: false, tomoriNewsDone: false, leaoNewsPending: false, leaoNewsDone: false, betKing1Done: false, betKing2Done: false, betKing3Done: false, betKingSkip: false, betKingResolved: false, farCallDone: false, magicPhoneUnlocked: false, magicPhoneUses: 0, scudettoCount: 0, uclTitleCount: 0, season4TitlesBefore: 0, uclReachedFinal: false, suspicion: 0, hesitantContract1Done: false, hesitantContract2Done: false, omniscient1Done: false, omniscient2Done: false, pressOfficerDone: false, nextLeftBack4Done: false, leftBack4Resolved: false, southStandTalkDone: false, southStandPending: false, footballDisputeDone: false, deadEndDone: false, lastMatchLost: false, shownWarnings: { trustCrisis: false, trustCritical: false, mediaCrisis: false, mediaCritical: false, playerCrisis: false, playerCritical: false, fansCrisis: false, fansCritical: false }, difficulty };
    pendingTransferSlots = 0;
    lastOpponentName = '';
    matchSchedule = generateMatchSchedule();
    scheduleIndex = 0;
    initializeLeague();
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
    teams.forEach(t => { schedule.push(t.name); schedule.push(t.name); });
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
        // 超出赛程（不应发生），退回随机
        return teams[Math.floor(Math.random() * teams.length)].name;
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
        desc: '攻守兼备的现代边卫，甚至十分擅长助攻，跑起来像一台失控的跑车。有人说他上场只会吃红牌，也许他性格暴躁，也许他只是渴望一个机会来证明自己。',
        effects: { player: 4, media: -2 }, cost: 2000
    },
    {
        id: 'winger_pt', name: '葡萄牙边锋', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '20岁，速度和盘带俱佳，不契合前教练的培养思路，表现出极强的可塑性。他的缺点都可以改正，他的优点却很难在其他球员身上发现。',
        effects: { player: 5 }, cost: 2200
    },
    {
        id: 'striker_fr', name: '法国中锋', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '以几乎白送的价格挂牌，有人说现代足球已经没有他的容身之地。他自称儿时的偶像是你曾经的队友，因此才想来到米兰。',
        effects: { player: 4, fans: 3 }, cost: 1200
    },
    {
        id: 'cb_eng', name: '英格兰中卫', tier: 1, tag: '即战力', tagColor: 'ready',
        desc: '身体素质强硬，风格稳健。你们需要一位中卫，但他只接受租借，培养他之后，是否能留住他呢？',
        effects: { player: 5 }, cost: 1600
    },
    {
        id: 'gk_talent', name: '天才守门员', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '反应神速，几乎是一位无死角门将。没人相信一个新人能顶替刚刚离队的传奇门神，他的心态极佳，但是否适合米兰还未可知。',
        effects: { player: 5 }, cost: 2400
    },
    {
        id: 'maestro', name: '上帝的指挥', tier: 1, tag: '即战力', tagColor: 'ready', uclTag: true,
        desc: '他曾经口出狂言，如果他回到米兰，不是为了"养老"，而是为了夺冠。签下他意味着认可他在更衣室里的绝对权威。',
        effects: { player: 8, fans: 6, trust: -4 }, cost: 5500
    },
    {
        id: 'cm_youth_it', name: '意大利青训中场', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '22岁，本土培养。他是个不折不扣的米兰死忠。为了穿上这件红黑球衣，他主动要求降薪。只要你不出售他，他永远也不会要求转会。',
        effects: { player: 3, fans: 5, trust: 3 }, cost: 800
    },
    {
        id: 'cb_fr_young', name: '法国中后卫', tier: 1, tag: '潜力股', tagColor: 'potential',
        desc: '他是个只有二十一岁的稚嫩球员，球队如何塑造他，决定了他会成为哪种球员。',
        effects: { player: 3 }, cost: 50
    },
    {
        id: 'belgian_star', name: '下一代新星', tier: 1, tag: '潜力股', tagColor: 'potential', uclTag: true,
        desc: '比利时人，高大、技术全面、年轻，球探报告将他称为下一代天才球员。',
        effects: { player: 6 }, cost: 4500
    },
    // ===== NPC池（其他目标，tier 2）=====
    {
        id: 'dm_cro', name: '克罗地亚铁腰', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '通过高效的比赛阅读能力覆盖整片中场，他的合同还剩最后一年，十分抢手，经纪人已经在和别的球队总监喝咖啡了。',
        effects: { player: 6 }, cost: 3500
    },
    {
        id: 'amf_fk', name: '任意球前腰', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '22岁，当打之年，在更衣室和队友打成一片，但他的经纪人胃口不小，谈判桌上他的眼睛总望着别处：米兰城不止一家球队。',
        effects: { player: 6, fans: 3 }, cost: 4000
    },
    {
        id: 'dm_pt', name: '葡萄牙后腰', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '拦截凶狠，身材高大，性格火爆。平均三场就会吃一次牌，曾有在更衣室和队友大打出手的传闻，辱骂过教练。如果管不住他，就别签下这个定时炸弹。',
        effects: { player: 7, trust: -5 }, cost: 3000
    },
    {
        id: 'winger_amateur', name: '业余的边锋', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '他踢过很长时间的低级别联赛，如果不是球探报告，你甚至不能确定他是一名职业球员。他愿意为任何赛场机会拼命，任何机会。',
        effects: { player: 2 }, cost: 300
    },
    {
        id: 'cb_control', name: '控制型中卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '195cm，33岁，沉稳可靠，他的经验足够帮助任何一家处在重建期的球队度过磨合期，但他的跑动能力下滑明显，防守技巧上也有一些短板。',
        effects: { player: 4 }, cost: 1800
    },
    {
        id: 'mid_bel', name: '比利时天才', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '21岁，技术细腻，媒体说他是新一代全能中场，身价高的吓人，球探报告显示他在前东家郁郁不得志，你无法知道是态度原因还是体系不合。',
        effects: { player: 6, fans: 4 }, cost: 5200
    },
    {
        id: 'striker_vet', name: '养老的前锋', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '35岁，昔日的世界级射手，拿着高额薪水被俱乐部无情抛弃，他的脚法和经验都还在，关键球的处理仍然不失水准，但他对任何俱乐部的热情都已经远去，签下他意味着承担高额的薪资。',
        effects: { player: 5, fans: 5, trust: -3 }, cost: 4500
    },
    {
        id: 'striker_ger', name: '德国攻击手', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '26岁，社交媒体有百万级别的粉丝，签下他意味着进一步扩大在社媒上的影响力，教练私下对你表示过轻微的怀疑，他的技术真的适配米兰吗？',
        effects: { player: 3, fans: 9, media: 5 }, cost: 5000
    },
    {
        id: 'mid_steady', name: '稳健型中场', tier: 2, tag: '高风险', tagColor: 'risk',
        desc: '33岁，既能扫荡又能后插，关键时刻总是不吝啬牺牲自己的体力，性格直爽，和更衣室关系良好。他的经纪人没有隐瞒球员的身体状况，正是这份体检报告让你犹豫。',
        effects: { player: 5, trust: 2 }, cost: 2000
    },
    {
        id: 'cb_den', name: '丹麦中卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '冷静、稳健，几乎不犯错。中规中矩的价格，中规中矩的描述。你也许就是需要这样一位没什么特点的后卫。',
        effects: { player: 4 }, cost: 2200
    },
    {
        id: 'rb_esp', name: '西班牙边卫', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '29岁，经验丰富，攻防两端都拿得出手，即插即用毫无磨合成本。问题是他名气大、要价高、且已经过了巅峰期。',
        effects: { player: 5 }, cost: 3800
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

// 夏季转会窗牌池：第二赛季必出 01、02；第三赛季必出 08、09；其余 NPC 填充（已购入的不再出现）
// 核心球员（01-09）首次出现的转会窗时间序号：第二夏=1，第二冬=2，第三夏=3，第三冬=4，第四夏=5
const coreDebut = {
    lb_winger: 1, winger_pt: 1,        // 01、02 第二赛季夏窗
    maestro: 2,                        // 06 第二赛季冬窗
    cb_fr_young: 3, belgian_star: 3,   // 08、09 第三赛季夏窗
    cm_youth_it: 4,                    // 07 第三赛季冬窗
    striker_fr: 5, gk_talent: 5,       // 03、05 第四赛季夏窗
    cb_eng: 6                          // 04 第四赛季冬窗
};
// 当前转会窗时间序号
function windowTimeIndex(isWinter) { return (gameStats.season - 2) * 2 + (isWinter ? 2 : 1); }

// 已到首次出现时间、且尚未购买的核心球员（优先出现，直到被买走）
function availableCorePlayers(time) {
    const cards = [];
    for (const id of Object.keys(coreDebut)) {
        if (coreDebut[id] > time || gameStats.signedPlayers.includes(id)) continue;
        if (id === 'cm_youth_it') {
            // 07：仅当"童年的马克杯Ⅰ"承诺过（标价>0）且未被移出球队
            if (!(gameStats.player07WinterCost > 0) || gameStats.player07Removed) continue;
            cards.push({ ...transferBuyPlayers.find(b => b.id === id), cost: gameStats.player07WinterCost });
        } else if (id === 'maestro') {
            const card = { ...transferBuyPlayers.find(b => b.id === id), tag: '回归', tagColor: 'return' };
            if (gameStats.winterReturnCost > 0) card.cost = gameStats.winterReturnCost;
            cards.push(card);
        } else if (id === 'cb_eng') {
            // 04：身价受"买断我！保罗！"事件折扣影响
            const card = { ...transferBuyPlayers.find(b => b.id === id) };
            if (gameStats.player04Discount > 0) card.cost = Math.max(0, card.cost - gameStats.player04Discount);
            cards.push(card);
        } else {
            cards.push(transferBuyPlayers.find(b => b.id === id));
        }
    }
    return cards;
}

// 核心球员 + NPC 池补足到 8 人（已购入的不再出现）
function fillWithNpc(result) {
    const npc = transferBuyPlayers.filter(p => p.tier === 2 && !gameStats.signedPlayers.includes(p.id));
    const picked = npc.slice().sort(() => Math.random() - 0.5).slice(0, Math.max(0, 8 - result.length));
    return result.concat(picked);
}

// 夏季转会窗：优先列出所有已登场、未购买的核心球员，其余 NPC 填充
function drawTransferPool() {
    return fillWithNpc(availableCorePlayers(windowTimeIndex(false)));
}

function openTransferMarket(slots, opts = {}) {
    tmState = { slots, initialSlots: slots, basePlayer: gameStats.player, purchased: new Set(), sold: new Set(), pool: opts.pool || drawTransferPool(), page: 0 };
    document.getElementById('tm-season-label').textContent = opts.label || `转会市场 · 第${gameStats.season}赛季`;
    document.getElementById('tm-window-title').textContent = opts.windowTitle || '夏季转会窗';
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

function renderTransferMarket() {
    document.getElementById('tm-budget').textContent = `€${gameStats.budget}万`;
    document.getElementById('tm-slots').textContent = `${tmState.slots}/${tmState.initialSlots}`;
    document.getElementById('tm-strength-before').textContent = tmState.basePlayer;
    document.getElementById('tm-strength-after').textContent = Math.max(0, Math.min(100, gameStats.player));

    // 可签入球员：每页 4 名，右下角翻页
    const buyEl = document.getElementById('tm-buy-players');
    buyEl.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(tmState.pool.length / TM_PER_PAGE));
    if (tmState.page > totalPages - 1) tmState.page = totalPages - 1;
    const pageStart = tmState.page * TM_PER_PAGE;
    tmState.pool.slice(pageStart, pageStart + TM_PER_PAGE).forEach(p => {
        const bought = tmState.purchased.has(p.id);
        const canAfford = gameStats.budget >= p.cost;
        const hasSlot = tmState.slots > 0;
        const tagClass = { potential: 'tm-tag-potential', ready: 'tm-tag-ready', risk: 'tm-tag-risk', return: 'tm-tag-return' }[p.tagColor];

        const statsHtml = Object.entries(p.effects).map(([k, v]) => {
            const labels = { player: '即战力', fans: '球迷满意度', trust: '董事会信任度', media: '媒体声望' };
            const cls = v > 0 ? 'tm-stat-pos' : 'tm-stat-neg';
            return `<div>${labels[k] || k}：<span class="${cls}">${v > 0 ? '+' : ''}${v}</span></div>`;
        }).join('') + `<div>身价：€${p.cost}万</div>`;

        let btnText = '签下';
        let btnDisabled = false;
        if (bought) { btnText = '已签下'; btnDisabled = true; }
        else if (!canAfford) { btnText = '预算不足'; btnDisabled = true; }
        else if (!hasSlot) { btnText = '名额已满'; btnDisabled = true; }

        const card = document.createElement('div');
        card.className = 'tm-player-card' + (bought ? ' tm-bought' : '');
        card.innerHTML = `
            <div class="tm-card-header">
                <div class="tm-player-name">${p.name}</div>
                <div class="tm-tags">
                    ${p.uclTag && gameStats.uclTagShown ? '<div class="tm-tag tm-tag-ucl">欧冠</div>' : ''}
                    <div class="tm-tag ${tagClass}">${p.tag}</div>
                </div>
            </div>
            <div class="tm-card-desc">${p.desc}</div>
            <div class="tm-card-stats">${statsHtml}</div>
            <button class="tm-sign-btn"${btnDisabled ? ' disabled' : ''}>${btnText}</button>
        `;
        if (!btnDisabled) {
            card.querySelector('.tm-sign-btn').addEventListener('click', () => {
                tmState.purchased.add(p.id);
                if (!gameStats.signedPlayers.includes(p.id)) gameStats.signedPlayers.push(p.id);
                if (p.id === 'maestro' && !gameStats.news01Done) gameStats.news01Pending = true;
                if (p.id === 'cb_eng' && !gameStats.tomoriNewsDone) gameStats.tomoriNewsPending = true;
                if (p.id === 'winger_pt' && !gameStats.leaoNewsDone) gameStats.leaoNewsPending = true;
                tmState.slots--;
                updateBudget(-p.cost);
                Object.entries(p.effects).forEach(([k, v]) => updateStat(k, v));
                renderTransferMarket();
            });
        }
        buyEl.appendChild(card);
    });

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

    // 可出售球员
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
const negotiationScripts = {
    donnarumma: {
        name: '多纳鲁马', number: 99, sub: '意大利门神 · 合同到期在即', start: 45,
        rounds: [
            { agent: '“我的客户在米兰长大，但他想要的不只是钱，更是与世界顶级门将相称的待遇与尊重。眼下，有人开出了让人无法拒绝的条件……”', options: [
                { text: '“开顶薪，绝不亏待门线功臣。”', desc: '最有效，但预算大出血，挤压未来引援空间。', delta: 18 },
                { text: '“球队会围绕你重建防线。”', desc: '他重视地位，正中下怀，代价相对可控。', delta: 12 },
                { text: '“你是米兰青训的旗帜，别走。”', desc: '情怀牌，对早已动摇之人收效有限。', delta: 3 },
                { text: '“想走可以，但别想自由身离开。”', desc: '激进施压，可能彻底激怒对方。', delta: -6 }
            ]},
            { agent: '“薪水只是一方面。他想知道，这支重建中的米兰，几年内能重返欧冠的舞台？”', options: [
                { text: '“三年之内，我们必回欧冠。”', desc: '画下蓝图，给足信心，但需兑现。', delta: 17 },
                { text: '“给我们时间，你会是这一切的核心。”', desc: '务实可信，稳步加分。', delta: 11 },
                { text: '“先把眼前的合同谈完吧。”', desc: '回避愿景，他略感失望。', delta: 2 },
                { text: '“没有谁能保证未来，踢好球再说。”', desc: '态度冷淡，可能适得其反。', delta: -7 }
            ]},
            { agent: '“巴黎那边已经摆出了诚意——违约金、肖像权、商业分成，你们跟得上吗？”', options: [
                { text: '“肖像权与忠诚奖金，全部满足。”', desc: '诚意拉满，但财务压力骤增。', delta: 18 },
                { text: '“给出合理但克制的商业条款。”', desc: '稳妥，温和加分。', delta: 10 },
                { text: '“米兰给不了巴黎那种数字。”', desc: '坦诚却示弱，效果一般。', delta: 3 },
                { text: '“商业条款上，一步都不让。”', desc: '强硬，谈判可能破裂。', delta: -8 }
            ]},
            { agent: '“最后一个问题——你，作为体育总监，真的把他当成米兰的未来吗？”', options: [
                { text: '“他就是米兰门线的旗帜，我以人格担保。”', desc: '情真意切，临门一脚。', delta: 16 },
                { text: '“我们正是为他规划了整个周期。”', desc: '职业可信，稳健加分。', delta: 11 },
                { text: '“队内竞争对所有人开放。”', desc: '公事公办，他听了并不受用。', delta: 2 },
                { text: '“去留随你，米兰不缺门将。”', desc: '撂狠话，极可能谈崩。', delta: -7 }
            ]}
        ],
        feedback: {
            renew: { title: '续约成功！', text: '多纳鲁马最终在新合同上签下名字。门线后继有人，圣西罗的红黑色又多了一份安稳。', effects: { fans: 8, trust: 5, player: 3 } },
            tug:   { title: '谈判陷入拉锯', text: '窗口期内没能彻底谈拢，多纳鲁马暂时留队，但他的未来仍是一个悬而未决的问号。', effects: { fans: -3, trust: -2 } },
            break: { title: '谈判破裂', text: '多纳鲁马最终以自由身离开了米兰。球迷难以接受队魂级门将的不告而别。', effects: { fans: -10, player: -5, trust: -3 } }
        }
    },
    calhanoglu: {
        name: '恰尔汗奥卢', number: 10, sub: '土耳其前腰 · 合同仅剩一年', start: 40,
        rounds: [
            { agent: '“我的客户为米兰付出了一切，他想要的不只是钱，更是球队战术核心的地位和应有的尊重。对面那支蓝黑色的球队，可是开出了让人无法拒绝的条件……”', options: [
                { text: '“开顶薪，我们绝不亏待功臣。”', desc: '最有效，但预算大出血，挤压未来引援空间。', delta: 20 },
                { text: '“球队会围绕你来打造。”', desc: '他重视地位，正中下怀。但可能引起其他核心不满。', delta: 12 },
                { text: '“为了米兰的情怀，留下来吧。”', desc: '对一个早已心生去意的人，情怀牌收效甚微。', delta: 3 },
                { text: '“留不留随你，但别想自由身走人。”', desc: '激进施压，可能彻底激怒对方，也可能逼他重回谈判桌。', delta: -5 }
            ]},
            { agent: '“他在意的不只是钱，还有战术地位——他要做这支球队进攻的轴心。”', options: [
                { text: '“整个中场都会为你而转。”', desc: '满足他的野心，但其他人会有想法。', delta: 17 },
                { text: '“你是首发，但需要良性竞争。”', desc: '稳妥的承诺，温和加分。', delta: 11 },
                { text: '“战术是教练定的，我无法插手。”', desc: '推诿责任，他不太买账。', delta: 2 },
                { text: '“球队不会为任何人改变体系。”', desc: '态度强硬，风险不小。', delta: -8 }
            ]},
            { agent: '“去同城对手那边，他立刻就能争冠。你们能给他什么样的前景？”', options: [
                { text: '“红黑复兴就靠你做基石。”', desc: '描绘蓝图，激起斗志。', delta: 16 },
                { text: '“想想南看台对你的爱。”', desc: '打感情牌，有一定效果。', delta: 10 },
                { text: '“争冠是早晚的事，别急。”', desc: '空头支票，说服力不足。', delta: 3 },
                { text: '“去蓝黑那边，你会被球迷唾弃。”', desc: '以舆论相逼，可能彻底激化。', delta: -10 }
            ]},
            { agent: '“蓝黑色的合同就摆在桌上了。给我一个，让他留下来的理由。”', options: [
                { text: '“当场加码，这是我们最大的诚意。”', desc: '一锤定音，但代价高昂。', delta: 16 },
                { text: '“请他念及这些年的感情，再想一晚。”', desc: '以情动人，稳健加分。', delta: 10 },
                { text: '“合同条款已经是上限了。”', desc: '不再让步，他态度转冷。', delta: 2 },
                { text: '“尊重他的任何决定。”', desc: '近乎放手，等同于送客。', delta: -9 }
            ]}
        ],
        feedback: {
            renew: { title: '续约成功！', text: '恰尔汗奥卢拒绝了国际米兰，留在了红黑军团。南看台为这份忠诚沸腾。', effects: { fans: 9, trust: 4, player: 3 } },
            tug:   { title: '谈判陷入拉锯', text: '他没有当场答应，也没有转身离开。续约的事，被拖进了下一个窗口。', effects: { fans: -3, trust: -2 } },
            break: { title: '谈判破裂', text: '恰尔汗奥卢最终转投同城死敌国际米兰，圣西罗的看台一片哗然。', effects: { fans: -12, trust: -3, media: -3 } }
        }
    }
};

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
    negState = { key, round: 0, value: sc.start, lastDelta: null };
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

    const oc = document.getElementById('neg-options');
    oc.innerHTML = '';
    rd.options.forEach(opt => {
        const badge = negBadge(opt.delta);
        const b = document.createElement('button');
        b.className = 'neg-option';
        b.innerHTML = `
            <div class="neg-opt-main">
                <div class="neg-opt-text">${opt.text}</div>
                <div class="neg-opt-badge ${badge.cls}">${badge.text}</div>
            </div>
            <div class="neg-opt-desc">${opt.desc}</div>`;
        b.addEventListener('click', () => negChoose(opt.delta));
        oc.appendChild(b);
    });
}

function negChoose(delta) {
    negState.value = Math.max(0, Math.min(100, negState.value + delta));
    negState.lastDelta = delta;
    negState.round++;
    if (negState.round >= 4) { showNegFeedback(); return; }
    renderNegotiation();
}

function showNegFeedback() {
    const sc = negotiationScripts[negState.key];
    const v = Math.max(0, Math.min(100, negState.value));
    const zone = negZone(v);
    const fb = sc.feedback[zone];
    negShowChrome(false); // 结算页去掉空发言框与意向条
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
    btn.addEventListener('click', () => {
        Object.entries(fb.effects).forEach(([k, val]) => updateStat(k, val));
        choiceHistory.push({
            round: gameStats.round,
            eventName: `续约谈判·${sc.name}`,
            optionText: { renew: '成功续约', tug: '谈判拉锯，暂时留队', break: '谈判破裂，球员离队' }[zone],
            effects: fb.effects,
            kind: 'special'
        });
        document.getElementById('negotiation-modal').classList.add('hidden');
        startNextNegotiation();
    });
    oc.appendChild(btn);
}

// ===== 多纳鲁马续约谈判（分支对话树，第四赛季第二轮）=====
// 预算 / 球员状态在三回合后一起结算；谈判失败（未续约）则不扣除报价中的预算。
const donnaNego = {
    subtitle: '多纳鲁马的去留', start: 50, root: 'n1',
    nodes: {
        n1: { agent: '我的客户从小在米兰长大，但他想要的不只是钱，更是与世界顶级门将相称的待遇与尊重。作为米兰青训出身的球员，他是最合适的队长人选。', options: [
            { text: '门将对球队至关重要，开顶薪。“我们愿意给出超出涨薪幅度的价格。”', budget: -1000, intent: 12, next: 'n1_1' },
            { text: '球队预算紧张，但可以承诺队长的位置。“我们比任何人都希望青训的球员能够一直在米兰踢下去。”', intent: 8, next: 'n1_2' },
            { text: '地位和涨薪都无法满足，尝试打感情牌。“你是球队的核心，米兰在此时非常需要你。”', intent: 6, next: 'n1_3' },
            { text: '离队可以，但不能自由身走人。“找下家是球员的自由，但你必须留下转会费。”', intent: -10, next: 'n1_4' }
        ]},
        n1_1: { agent: '我的客户理解米兰目前预算上的困境，但至少要再涨价一倍，才能和我们的预期持平。', options: [
            { text: '答应。“转会市场上难以找到第二个你，涨薪对我们来讲是可以接受的。”', budget: -1000, intent: 12, next: 'n1_1_1' },
            { text: '拒绝。“这种幅度的涨薪会影响我们在转会窗的策略。”', intent: -10, next: 'n1_1_2' },
            { text: '请求他再考虑一下。“你是米兰未来的旗帜，不到万不得已我们不想失去你。”', intent: -8, next: 'n1_1_3' }
        ]},
        n1_2: { agent: '很高兴我们在队长位置上达成了共识，但仅仅有队长袖标是不够的，我的客户不可能拿这个工资在米兰踢一辈子。', options: [
            { text: '答应涨薪。“队长拿一份高工资是应得的。”', budget: -1000, intent: 12, next: 'n1_2_1' },
            { text: '劝说。“你拿的已经是队内顶薪了。我们没有更多预算。”', intent: -8, next: 'n1_2_2' },
            { text: '拒绝涨薪。“你在米兰获得的特殊待遇和战术地位已经足够抵消低工资了。”', intent: -10, next: 'n1_2_3' }
        ]},
        n1_3: { agent: '这两项都无法满足的话，我们看不到米兰在谈判桌上的诚意。无论如何，我的客户合同还剩下最后半年，他完全可以自由身离场。', options: [
            { text: '妥协。“我们会重新开出一份合同。”', budget: -2000, intent: 12, next: 'n1_3_1' },
            { text: '给出一笔额外的补偿。“我们无法现在涨薪，但可以绕过FFP额外给你一笔续约奖金。”', budget: -1000, intent: 10, next: 'n1_3_2' },
            { text: '强硬谈判。“哪怕是把他买去意乙球队，米兰也不会放他自由身离开的。”', intent: -10, next: 'n1_3_3' }
        ]},
        n1_1_1: { agent: '薪资的事我们已经达成共识了，接下来是队长的归属。我的客户希望把这件事清晰地写进合同，没有谁比他更合适了，对吧？', options: [
            { text: '答应。“我们对你有很深的感情。”', intent: 10, player: -5 },
            { text: '拒绝。“我们需要根据球员表现和队内的意见来决定队长。”', intent: 6, player: -2 },
            { text: '按下不谈。“队长的事可以下个赛季再说。”', intent: -4 }
        ]},
        n1_1_2: { agent: '如果我的客户在这个赛季后以自由身离开米兰，你们就不得不引进新的门将，转会市场上所有经纪人都会漫天要价。既然如此，为什么不接受涨薪续约呢？', options: [
            { text: '答应。“你说的有道理，就按照你要求的薪资来吧。”', budget: -1000, intent: 12 },
            { text: '拒绝。“我们大可以引进现在还不那么成熟的门将。”', intent: -6 },
            { text: '挽留。“下个赛季我们也许有预算给你涨薪。”', intent: -2 }
        ]},
        n1_1_3: { agent: '我的客户也不想离开米兰，但对球员来说，职业发展比眷恋哪个球队更加重要。他刚在上个赛季作为门将跟随意大利队拿下欧洲杯冠军，你认为他必须要在米兰才能拿得到这个价格吗？', options: [
            { text: '答应涨薪。“这名球员确实值得这个价格。”', budget: -1000, intent: 12 },
            { text: '答应战术地位。“我们给不了钱，但他可以先当队长。”', player: -5, intent: 8 },
            { text: '挽留。“留在米兰会有更好的职业发展。”', intent: -2 }
        ]},
        n1_2_1: { agent: '最好，我们能两年续一次合同。这样双方都有较大的自主权，米兰的成绩如何，决定了我的客户将以什么样的代价续约。如果保持在欧冠区，当然续约会好谈很多。如果赛季情况不佳，我的客户也会考虑自由身离队。', options: [
            { text: '球队的核心应当与球队共存亡。“我们不能接受米兰的队长能轻易地离开这支球队。”', intent: -4 },
            { text: '续约时间太短。“至少也要改成三年一续。”', intent: -2 },
            { text: '答应这个请求。“如果米兰没有保持在欧冠区，我们可以再谈谈续约的事。”', intent: 8 }
        ]},
        n1_2_2: { agent: '队内顶薪不代表是门将的顶薪，我的客户完全可以去一个开得起更高价格的球队，身体素质好、守门意识强，还能扑点球和出球的门将本身就是少数。', options: [
            { text: '同意。“他对球队不可或缺，我们会答应涨薪。”', budget: -1000, intent: 12 },
            { text: '拒绝。“没有哪个球队会承诺战术地位的同时还给一份这么高价格的合同。”', intent: -8 },
            { text: '打感情牌。“米兰的青训培养了你，你是米兰的未来。”', intent: 8 }
        ]},
        n1_2_3: { agent: '一份高薪合同能够让球员跨过语言和生活习惯的差异，同样，一份不那么好看的低薪合同也能消磨球员对老东家的盲从。对这种球员来说，钱是最有用的。', options: [
            { text: '同意。“他对球队不可或缺，我们会答应涨薪。”', budget: -1000, intent: 12 },
            { text: '拒绝。“没有哪个球队会承诺战术地位的同时还给一份这么高价格的合同。”', intent: -8 },
            { text: '商议。“也许下个赛季我们能够提供涨薪的合同。”', intent: 4 }
        ]},
        n1_3_1: { agent: '续约的事解决了，队长位置应该也不难。我的客户在米兰长大，对米兰有很深的感情，希望米兰也是这样想的。', options: [
            { text: '同意。“队长的位置本来就应该是你的。”', intent: 6 },
            { text: '这需要看教练的安排。“教练安排给谁就是谁的。”', intent: -4 },
            { text: '无法轻易承诺。“球队也需要看他的表现。”', intent: -4 }
        ]},
        n1_3_2: { agent: '下家也给出了一笔签字费，且不需要私下转账，有些豪门球队本身就不怎么受FFP限制。', options: [
            { text: '额外再给一笔钱。“私下转账的钱都是你自己的。”', budget: -500, intent: 6 },
            { text: '这是我们能给出的最高价格。“两支球队的预算有时候差别很大。”', intent: 4 },
            { text: '给钱都不要，那给米兰留点钱吧。“不缺钱的话我们会考虑尽快出售你。”', intent: -10 }
        ]},
        n1_3_3: { agent: '把球队核心低价卖出不符合米兰的作风，米兰培养他是想要他留下来的。我的客户只是要求一份涨薪合同，并不是铁了心要离开。', options: [
            { text: '涨薪不合理。“他本身就是破格提上一线队，涨薪并不在计划中。”', intent: -6 },
            { text: '答应涨薪合同。“我们确实不想让他离开。”', budget: -1000, intent: 12 },
            { text: '拒绝涨薪合同。“米兰可以培养他成为队长，但涨薪就免谈了。”', intent: 6 }
        ]},
        n1_4: { agent: '我的客户合同只剩最后这一年，新东家更想要自由身球员，省下转会费。而潜在买家也不会在这个时候高价接手球员。我们有非常多选项，难选的是米兰。', options: [
            { text: '妥协。“我们会按照你提出的薪资修改合同。”', budget: -2000, intent: 12, next: 'n1_4_1' },
            { text: '僵持不下。“等这个转会窗过去我们再谈合同的事。”', intent: -6, next: 'n1_4_2' },
            { text: '强硬谈判。“即使只卖一块钱，米兰也会选择把他挂上转会市场。”', intent: -10, next: 'n1_4_3' }
        ]},
        n1_4_1: { agent: '我的客户的首选并不是米兰，一个赛季之前是，现在他见识到了太多球队的邀约，米兰必须拿出真正有力的筹码。', options: [
            { text: '追加薪资。“我们将提供超出顶薪的待遇。”', budget: -500, intent: 18 },
            { text: '拒绝谈判。“米兰也可以选择很多门将。”', intent: -6 },
            { text: '答应部分合同。“我们可以再详细聊聊。”', intent: -6 }
        ]},
        n1_4_2: { agent: '恐怕合同没有留给米兰那么多时间了，这就是最后的转会窗，如果我的客户没有拿到想要的价格，他将转投别家。', options: [
            { text: '提前行动。“也许是他没有更多的时间了，米兰将把他出售给任何有意向的球队。”', intent: -8 },
            { text: '打感情牌。“米兰和他并没有仇深似海，不至于连转会费都不留下吧。”', intent: 4 },
            { text: '相信他会留下来。“选择其他球队也需要时间。”', intent: -6 }
        ]},
        n1_4_3: { agent: '新东家都准备好合同等着球员自由身过去了，谁会在这个时候出钱买人呢？哪怕他们不缺预算，谁能拒绝零元购的球员？', options: [
            { text: '出售给低级别球队是两败俱伤。“至少你得留下当时把你签来的钱。”', budget: 500, intent: -10, end: 'sold' },
            { text: '打感情牌。“米兰将你当作未来的队长时，从没想过要出售你。”', intent: 6 },
            { text: '强硬要求。“必须在夏窗前谈好转会费。”', budget: 500, intent: -10, end: 'sold' }
        ]}
    }
};
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
function selectRandomEvents() {
    const selectedEvents = [];


    // 第二赛季剧本事件（按轮次必定触发，优先于其他随机事件）
    if (gameStats.season === 2) {
        // 签下 06（上帝的指挥）后的下一回合触发新闻01
        if (gameStats.news01Pending && !gameStats.news01Done) {
            gameStats.news01Pending = false;
            gameStats.news01Done = true;
            return ['news01'];
        }
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
    }

    // 第四赛季剧本事件（赌王传奇 → 检查点 → 远方来电）；赌王传奇需 07 在队才展开
    if (gameStats.season === 4) {
        // 转会传闻（第2轮后）→ 续约谈判（选恰尔汗奥卢=线性，选多纳鲁马=详细分支谈判页）
        if (gameStats.round >= 2 && !gameStats.transferRumorDone) {
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
        // 检查点（第30轮后，Ⅲ结束）：07信任点≥3 且 07仍在队 → 我们的责任，否则 → 赌徒的终局
        if (gameStats.round >= 30 && gameStats.betKing3Done && !gameStats.betKingResolved) {
            gameStats.betKingResolved = true;
            const standBy = !gameStats.player07Removed && gameStats.player07Trust >= 3;
            return [standBy ? 'ourResponsibility' : 'gamblerEnd'];
        }
        // 远方来电（解锁魔力电话）：与签下06绑定；主线推进后触发（赌王传奇结束或第30轮）
        if (!gameStats.farCallDone && gameStats.signedPlayers.includes('maestro') &&
            (gameStats.betKingResolved || gameStats.betKingSkip || gameStats.round >= 30)) {
            gameStats.farCallDone = true;
            return ['farCall'];
        }
        // 买断我！保罗！（第32轮必定触发，调整04夏窗身价）—— 仅在尚未买断04时触发
        if (gameStats.round >= 32 && !gameStats.buyoutTomoriDone && !gameStats.signedPlayers.includes('cb_eng')) {
            gameStats.buyoutTomoriDone = true;
            return ['buyoutTomori'];
        }
        // 下一个左后卫Ⅲ：第20-30轮联赛赢球后触发（需01在队，一次）。consecutiveNonWins===0 即上一场获胜
        if (gameStats.round >= 20 && gameStats.round <= 30 && gameStats.consecutiveNonWins === 0 &&
            gameStats.signedPlayers.includes('lb_winger') && !gameStats.nextLeftBack3Done) {
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
        // 犹豫不决的合同Ⅱ（第10轮）→ 下一轮"续约"（或选项1直接进结局）
        if (gameStats.round >= 10 && !gameStats.hesitantContract2Done) {
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
            return [20];
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
        // 此路不通（第8轮后）
        if (gameStats.round >= 8 && !gameStats.deadEndDone) {
            gameStats.deadEndDone = true;
            return ['deadEnd'];
        }
        // 南看台的训话（第30轮后、输球后触发，一次）
        if (gameStats.southStandPending && !gameStats.southStandTalkDone) {
            gameStats.southStandTalkDone = true;
            return ['southStandTalk'];
        }
    }

    // 情绪宣泄（需购买01）：第三赛季26轮后触发；若届时未买01，则买下01后补触发
    if (!gameStats.emoOutburstDone && gameStats.signedPlayers.includes('lb_winger') &&
        ((gameStats.season === 3 && gameStats.round >= 26) || gameStats.season >= 4)) {
        gameStats.emoOutburstDone = true;
        return ['emoOutburst'];
    }

    // 签下04（托莫里）后，当赛季随机触发新闻
    if (gameStats.tomoriNewsPending && !gameStats.tomoriNewsDone && Math.random() < 0.5) {
        gameStats.tomoriNewsPending = false;
        gameStats.tomoriNewsDone = true;
        return ['newsTomori'];
    }

    // 签下02（莱奥）后，当赛季随机触发新闻
    if (gameStats.leaoNewsPending && !gameStats.leaoNewsDone && Math.random() < 0.5) {
        gameStats.leaoNewsPending = false;
        gameStats.leaoNewsDone = true;
        return ['newsLeao'];
    }

    // 连续四轮不胜后触发南看台事件
    if (gameStats.consecutiveNonWins >= 4 && !gameStats.southStandEventUsed) {
        selectedEvents.push(2);
        gameStats.southStandEventUsed = true;
        return selectedEvents;
    }

    // 待触发的链式事件（immediate 必定触发，否则满足最早轮次后 60% 概率触发）
    if (gameStats.futureRandomEvents.length > 0) {
        const pending = gameStats.futureRandomEvents[0];
        const eventId  = resolveEventEntry(pending);
        const minRound = typeof pending === 'object' ? (pending.minRound  || 0)     : 0;
        const immediate = typeof pending === 'object' ? (pending.immediate || false) : false;
        if (gameStats.round >= minRound && (immediate || Math.random() < 0.6)) {
            gameStats.futureRandomEvents.shift();
            selectedEvents.push(eventId);
        }
        return selectedEvents;
    }

    // 主线事件池：当前赛季专属事件（满足最早轮次后50%概率触发）
    const roundConstraints = mainlineRoundConstraints[gameStats.season] || {};
    const currentMainlinePool = (mainlineEventPools[gameStats.season] || []).filter(id =>
        !gameStats.usedMainlineEvents.includes(id) &&
        gameStats.round >= (roundConstraints[id] || 0)
    );
    if (currentMainlinePool.length > 0 && Math.random() < 0.5) {
        const selectedId = currentMainlinePool[Math.floor(Math.random() * currentMainlinePool.length)];
        selectedEvents.push(selectedId);
        return selectedEvents;
    }

    // 随机事件池
    const eventIds = numericRandomEventIds.filter(id => {
        const numId = parseInt(id);
        // 仅由特定条件触发的事件，不进入随机池：2=南看台(连续不胜)，17=德比失利(输给国米)，20=聘请新闻官(第五赛季第24轮剧本)
        if (numId === 2 || numId === 17 || numId === 20) return false;
        // 12=汇报之争、15=大数据时代、18=干扰训练：仅第五赛季进入随机池
        if ((numId === 12 || numId === 15 || numId === 18) && gameStats.season !== 5) return false;
        if (numId === 5 && gameStats.rebateEventCount >= 2) return false;
        if (numId === 10 && gameStats.transferEventUsed) return false;
        if (numId === 11 && gameStats.carCrashEventUsed) return false;
        if (numId === 13 && gameStats.sinkOrSwimEventUsed) return false;
        if (numId === 15 && gameStats.bigDataEventUsed) return false;
        if (numId === 19 && gameStats.overtimeFineUsed) return false; // 超时罚款每赛季最多一次
        return true;
    });

    if (Math.random() < 0.5 || eventIds.length === 0) {
        return selectedEvents;
    }

    const randomIndex = Math.floor(Math.random() * eventIds.length);
    const selectedId = parseInt(eventIds[randomIndex]);
    if (selectedId === 10) {
        gameStats.transferEventUsed = true;
    }
    if (selectedId === 11) {
        gameStats.carCrashEventUsed = true;
    }
    if (selectedId === 19) {
        gameStats.overtimeFineUsed = true;
    }
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
    // 德比赛果优先：赢/输国际米兰后立刻触发，先于转会/欧冠/剧本等
    if (gameStats.derbyWinEventPending) {
        gameStats.derbyWinEventPending = false;
        currentRandomEvents = ['derbyWin'];
        randomEventIndex = 0;
        showNextRandomEvent();
        return;
    }
    if (gameStats.derbyLossEventPending) {
        gameStats.derbyLossEventPending = false;
        currentRandomEvents = [17];
        randomEventIndex = 0;
        showNextRandomEvent();
        return;
    }
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
    if (gameStats.season >= 2 && gameStats.round === winterRound - 1 && !gameStats.winterWindowDone && !gameStats.winterWarnShown) {
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
        openWinterTransferMarket();
        return;
    }
    // 欧冠节点（小组赛果 / 淘汰赛之夜）
    if (maybeShowUclCard()) return;
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
        button.textContent = (event.warningStyle || visibleCount === 1) ? option.text : `${visibleOptionIndex}. ${option.text}`;
        button.className = 'random-event-option' + (visibleCount === 1 ? ' random-event-option--single' : '');
        button.addEventListener('click', () => {
            // 记录随机/主线事件选择
            if (!event.warningStyle && Object.keys(option.effects).length > 0) {
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
            if (option.chain && Math.random() < option.chain.probability) {
                // afterRounds：相对当前轮次的延迟触发（如"Ⅰ后第4轮"）
                const chainMinRound = option.chain.minRound
                    || (option.chain.afterRounds ? gameStats.round + option.chain.afterRounds : 0);
                const hasExtra = chainMinRound || option.chain.immediate;
                const entry = hasExtra
                    ? { eventId: option.chain.eventId,
                        ...(chainMinRound  ? { minRound: chainMinRound } : {}),
                        ...(option.chain.immediate  ? { immediate: true }               : {}) }
                    : option.chain.eventId;
                gameStats.futureRandomEvents.push(entry);
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
            if (option.winterReturn !== undefined) { gameStats.winterReturnCost = option.winterReturn; }
            if (option.brawlChance && Math.random() < option.brawlChance) { gameStats.lockerBrawlPending = true; }
            if (option.euroBan) { gameStats.uclBanNextSeason = true; }
            if (option.mug07Cost !== undefined) { gameStats.player07WinterCost = option.mug07Cost; }
            if (option.mug07Trust) { gameStats.player07Trust += option.mug07Trust; }
            if (option.trust01) { gameStats.player01Trust += option.trust01; }
            if (option.suspicion) { gameStats.suspicion += option.suspicion; updateSuspicionCard(); }
            if (option.disc04 !== undefined) {
                gameStats.player04Discount = option.disc04;
                // 买断决策进入决策记录，称呼球员名字而非代号
                choiceHistory.push({
                    round: gameStats.round,
                    eventName: event.title,
                    optionText: option.text,
                    note: option.disc04 > 0 ? `托莫里身价 -${option.disc04}万欧元` : '托莫里身价不变',
                    effects: {},
                    kind: 'special'
                });
            }
            if (option.mugPact) { gameStats.mugPactPending = true; }
            if (option.betKingSkip) { gameStats.betKingSkip = true; }
            if (option.remove07) {
                gameStats.player07Removed = true;
                const i07 = gameStats.signedPlayers.indexOf('cm_youth_it');
                if (i07 !== -1) gameStats.signedPlayers.splice(i07, 1);
            }
            if (option.unlockMagicPhone) { gameStats.magicPhoneUnlocked = true; updateMagicPhoneBtn(); }
            if (option.nextEvent && !gameStats.gameEnded) {
                currentRandomEvents.splice(randomEventIndex + 1, 0, option.nextEvent);
            }
            // 进入续约谈判页面（接管后续流程，谈判结束后继续比赛）
            if (option.negotiation && !gameStats.gameEnded) {
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
    gameStats.southStandEventUsed = false;
    gameStats.betKingEventUsed = false;
    gameStats.rebateEventCount = 0;
    gameStats.transferEventUsed = false;
    gameStats.carCrashEventUsed = false;
    gameStats.sinkOrSwimEventUsed = false;
    gameStats.bigDataEventUsed = false;
    gameStats.overtimeFineUsed = false; // 超时罚款每赛季重置
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
    gameStats.signedPlayers = [];
    gameStats.news01Pending = false;
    gameStats.news01Done = false;
    gameStats.effectiveDone = false;
    gameStats.lockerBrawlPending = false;
    gameStats.lockerBrawlDone = false;
    gameStats.supportTaskActive = false;
    gameStats.zlatanSupport = 0;
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
    lastOpponentName = '';
    matchSchedule = generateMatchSchedule();
    scheduleIndex = 0;
    matchHistory = [];
    choiceHistory = [];
    initializeLeague();
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

function showSeasonResult(passed) {
    if (!passed) {
        if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) {
            showEnding('surprise');
        } else {
            showEnding(getSeasonEndingKey());
        }
        return;
    }
    // 排名进入欧战区（≤6）或拿到欧战冠军 → 赛季结算卡片；否则沿用旧"下一个赛季"弹窗
    if (gameStats.ranking <= 6 || gameStats.uclStage === 'champion') {
        showSeasonSettlement();
        return;
    }
    const modal = document.getElementById('season-result-modal');
    modal.classList.remove('passed', 'failed');
    modal.classList.add('passed');
    document.getElementById('season-result-title').textContent = '下一个赛季';
    document.getElementById('season-result-text').textContent = getSeasonResultText();
    modal.classList.remove('hidden');
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
    if (r === 1) {
        if (wonUCL) return { budget: 2000, text: '您带领的AC Milan获得了双冠王！所向披靡的姿态和无懈可击的战术配合，使得你们同时将意甲冠军和欧冠冠军收入囊中。球队的影响力得到了极大扩张，教练摇身一变成了不可多得的名帅。管理层收到了多份广告商的合作报价，球队的预算也上升了。（球队预算+2000w）' };
        if (wonUEL) return { budget: 1500, text: 'AC Milan获得了欧联冠军和意甲冠军！虽然上赛季只获得了参加欧联的资格，但球队顺势而为，不仅获得了意甲第一，还拿下了欧联冠军。在下个赛季，你们将有较大的优势在欧冠联赛中小组直接出线。管理层对这个赛季的进步非常满意，增加了球队的预算。（预算+1500w）' };
        return { budget: 1000, text: `AC Milan不负众望，以${margin}分的优势领跑意甲，最终在赛季结束时获得了意甲冠军！您将获得下赛季的欧冠资格，并且有较大的优势小组直接出线，管理层因为这个赛季突出的成绩，增加了球队的预算。（球队预算+1000w）` };
    }
    if (r <= 4) {
        if (wonUCL) return { budget: 1500, text: '谁说联赛很重要？球员们抱着大耳朵杯亲了又亲，虽然你们错失意甲第一的宝座，但花车巡游时，没有任何一个球员的脸上有失去意甲冠军的失望。踢十年小组赛不如拿一次大耳朵杯，教练深谙此道。抓欧冠放联赛也是需要技术的，搞不好两头都没了。管理层给球队的预算上升了。（球队预算+1500w）' };
        if (wonUEL) return { budget: 1000, text: 'AC Milan获得了欧联冠军！作为欧联冠军，球队有资格直接进入下赛季的欧冠小组赛。但球队本身的实力也让你们一直处于欧冠区，上赛季跌入欧联区没有让球员气馁，反而激发了球员的斗志。获得欧联冠军使得球队的影响力和球队预算都上升了。（球队预算+1000w）' };
        return { budget: 500, text: 'AC Milan的最终成绩稳定在了联赛前四，你们拥有了下赛季参加欧冠联赛的资格，虽然您可能有向前一步的目标，但以球队目前的状况来看，保住欧冠资格才是管理层的首要任务。管理层对球队的预算有了小幅度的上升。（球队预算+500w）' };
    }
    if (wonUCL) return { budget: 1250, text: '尽管你们在联赛排名不佳，仅仅处于欧联区，但谁让大耳朵杯已经被米兰收入囊中。受欧足联条款影响，作为当赛季的欧冠冠军，你们有资格直接参加下赛季的欧冠小组赛。教练的大智慧让你们不再纠结于联赛，管理层对球队的预算增加了。（球队预算+1250w）' };
    if (wonUEL) return { budget: 750, text: 'AC Milan获得了欧联冠军！虽然在联赛排名中，欧联区再一次笼罩了米兰，但你们作为欧联冠军，受欧足联条款影响，有资格直接参加下个赛季的欧冠小组赛。在媒体影响力上升的同时，球队的预算小幅度上升了。（球队预算+750w）' };
    return { budget: 250, text: 'AC Milan最终的成绩稳定在了欧联区，球队有资格参加下赛季的欧洲联赛，在欧联中，球队仍然可以争取奖金和曝光度。管理层仍然希望球队每年都能踢上欧冠，对于广告招商和球员签约具有正面影响。管理层给球队的预算小幅度上升了。（球队预算+250w）' };
}

function showSeasonSettlement() {
    const s = getSeasonSettlement();
    // 赛季结算奖励直接入账，不受低信任度减半影响（保证与文案数字一致）
    gameStats.budget += s.budget;
    document.getElementById('budget').textContent = gameStats.budget + '万欧元';
    renderMainlineCard('赛季结算', s.text, [{ text: '确认', onClick: proceedAfterSeason }]);
}

// 赛季结算正文：第二赛季按最终排名给出不同结语
function getSeasonResultText() {
    if (gameStats.season === 2) {
        const base = '皮奥利的战术终于捏合成型。重启后的米兰判若两队，球员们的表现让人眼前一亮。';
        const tail = '比排名更重要的是，这支年轻的米兰，正在攀升的路上。';
        let middle;
        if (gameStats.ranking === 1) {
            // 两个赛季都夺冠 → 第二颗星
            middle = gameStats.wonScudetto1
                ? '赛季末，你们拿到了意甲冠军，给米兰修上了戴标20次意甲冠军的第二颗星！'
                : '赛季末，你们拿到了意甲冠军！';
        } else if (gameStats.ranking <= 4) {
            middle = '赛季末，你们超额完成了任务，拿到了欧冠资格。';
        } else {
            middle = '赛季末，你们没能进欧冠，但拿到了欧战资格。';
        }
        return base + middle + tail;
    }
    return '你完美的完成了这个赛季的任务，你仍然是这支球队不可动摇的球队总监。';
}

document.getElementById('season-result-continue').addEventListener('click', function() {
    document.getElementById('season-result-modal').classList.add('hidden');
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
    if (gameStats.ranking === 1) gameStats.scudettoCount++; // 本赛季联赛夺冠，累计意甲冠军数
    if (gameStats.euroType === 'ucl' && gameStats.uclStage === 'champion') gameStats.uclTitleCount++; // 累计欧冠冠军数
    if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) {
        // 隐藏结局"明天"：任期内至少 4 次意甲冠军 + 至少 1 次欧冠冠军
        if (gameStats.scudettoCount >= 4 && gameStats.uclTitleCount >= 1) { showEnding('tomorrow'); return; }
        showEnding('surprise'); return;
    }
    if (gameStats.season === 1 && gameStats.ranking === 1) { showScudetto1ThenResult(); return; }
    const intro = seasonIntros[gameStats.season];
    if (intro && intro.taskCheck) { showSeasonResult(intro.taskCheck()); return; }
    if (gameStats.difficulty === 'easy') { showEnding(getSeasonEndingKey()); return; }
    showSeasonTransition(gameStats.season);
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
        // 赛季结束时强制触发所有未展示的主线链式事件（如 euroNight2 → farewell）
        const pendingMainlineIdx = gameStats.futureRandomEvents.findIndex(e =>
            randomEvents[resolveEventEntry(e)]?.mainline
        );
        if (pendingMainlineIdx !== -1) {
            const pending = gameStats.futureRandomEvents.splice(pendingMainlineIdx, 1)[0];
            currentRandomEvents = [resolveEventEntry(pending)];
            randomEventIndex = 0;
            pendingSeasonEndCallback = doSeasonEnd;
            showNextRandomEvent();
            return;
        }
        doSeasonEnd();
        return;
    }

    applyWarningEffects();
    if (gameStats.gameEnded) return;
    pendingWarnings = getNewWarnings();
    if (gameStats.media > 80 && !gameStats.warningEventShown) {
        gameStats.warningEventShown = true;
        pendingWarnings.push(statWarningEvents.find(e => e.key === 'mediaHigh'));
    }
    showNextPendingWarning();
});

// 下一章（测试用）：保留当前数值直接跳入下一赛季
document.getElementById('next-chapter-btn').addEventListener('click', function() {
    if (gameStats.season >= 5) return;
    document.getElementById('ending-modal').classList.add('hidden');
    gameStats.gameEnded = false;
    startNewSeason();
});

// 重新开始游戏
document.getElementById('restart-game').addEventListener('click', function() {
    // 图鉴预览：返回结局图鉴，而非重新开始
    if (galleryPreview) {
        galleryPreview = false;
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

// 测试按钮
document.getElementById('test-ending-btn').addEventListener('click', function() {
    showEnding(resolveCurrentEndingKey());
});

// 开始比赛
startMatchBtn.addEventListener('click', function() {
    startMatchBtn.disabled = true;

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
        { name:'舍里夫', tier:'C' }, { name:'布鲁日', tier:'C' }, { name:'萨尔茨堡红牛', tier:'C' }, { name:'顿涅茨克矿工', tier:'C' }, { name:'萨格勒布迪纳摩', tier:'C' }, { name:'红星', tier:'C' }
    ],
    uel: [
        { name:'塞维利亚', tier:'S' }, { name:'曼联', tier:'S' }, { name:'阿森纳', tier:'S' }, { name:'巴塞罗那', tier:'S' }, { name:'国际米兰', tier:'S' }, { name:'尤文图斯', tier:'S' },
        { name:'罗马', tier:'A' }, { name:'法兰克福', tier:'A' }, { name:'勒沃库森', tier:'A' }, { name:'亚特兰大', tier:'A' }, { name:'皇家社会', tier:'A' }, { name:'阿贾克斯', tier:'A' }, { name:'波尔图', tier:'A' }, { name:'本菲卡', tier:'A' },
        { name:'西汉姆联', tier:'B' }, { name:'摩纳哥', tier:'B' }, { name:'费耶诺德', tier:'B' }, { name:'流浪者', tier:'B' }, { name:'布拉加', tier:'B' },
        { name:'迪德朗日', tier:'C' }, { name:'卡拉巴赫', tier:'C' }, { name:'卢多戈雷茨', tier:'C' }, { name:'费伦茨瓦罗斯', tier:'C' }, { name:'林茨', tier:'C' }, { name:'舍里夫', tier:'C' }
    ]
};
function currentUclPool() { return uclPools[gameStats.euroType] || uclPools.ucl; }

// 球队英文简写（用于"最后一战"对阵展示；全称即球队名本身）
const uclTeamAbbr = {
    '皇家马德里':'RMA', '曼城':'MCI', '拜仁慕尼黑':'BAY', '利物浦':'LIV', '巴黎圣日尔曼':'PSG', '切尔西':'CHE',
    '国际米兰':'INT', '马德里竞技':'ATM', '尤文图斯':'JUV', '巴塞罗那':'BAR', '多特蒙德':'DOR', '热刺':'TOT',
    '阿贾克斯':'AJA', '本菲卡':'BEN', '波尔图':'POR', '亚特兰大':'ATA', '莱比锡红牛':'RBL',
    '舍里夫':'SHE', '布鲁日':'CLB', '萨尔茨堡红牛':'RBS', '顿涅茨克矿工':'SHK', '萨格勒布迪纳摩':'DZG', '红星':'CZV',
    '塞维利亚':'SEV', '曼联':'MUN', '阿森纳':'ARS', '罗马':'ROM', '法兰克福':'SGE', '勒沃库森':'LEV', '皇家社会':'RSO',
    '西汉姆联':'WHU', '摩纳哥':'ASM', '费耶诺德':'FEY', '流浪者':'RAN', '布拉加':'BRA',
    '迪德朗日':'DUD', '卡拉巴赫':'QAR', '卢多戈雷茨':'LUD', '费伦茨瓦罗斯':'FTC', '林茨':'LSK'
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
    const win = eff / (eff + opp) * (1 - draw);
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
    final: { round: 36, key: 'final', label: '决赛',   next: 'champion', nextLabel: '' }
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
    if (decision === 'push') updateStat('player', -5);
    const wr = uclWinRate(opp.tier, 'ko', decMod);
    const advanced = Math.random() < (wr.win + 0.5 * wr.draw); // 平局点球各半
    applyUclRewards(uclRewards[info.key][advanced ? 'win' : 'out']);
    const score = uclScore(advanced);
    if (advanced) {
        gameStats.uclStage = info.next;
        if (info.next === 'final') gameStats.uclReachedFinal = true;
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

// 决赛（最后一战）：选择后判定夺冠/亚军。decMod 为小幅强度修正
function playUclFinal(playerBoost, decMod) {
    updateStat('player', playerBoost);
    const opp = gameStats.uclFixtures.final;
    const wr = uclWinRate(opp.tier, 'ko', decMod || 0);
    const won = Math.random() < (wr.win + 0.5 * wr.draw);
    applyUclRewards(uclRewards.final[won ? 'win' : 'out']);
    const score = uclScore(won);
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

function uclFanEval(f) {
    if (f >= 75) return '南看台已为这一夜彻夜难眠，呼声响彻圣西罗';
    if (f >= 50) return '满怀期待，相信球队能创造奇迹';
    if (f >= 30) return '将信将疑，但仍会守在屏幕前';
    return '不敢抱太大的希望';
}
function uclMediaEval(m) {
    if (m >= 75) return `一致看好米兰捧起${euroTrophy()}`;
    if (m >= 50) return '认为米兰拥有一战之力';
    if (m >= 30) return '更看好实力雄厚的对手';
    return '普遍唱衰米兰的前景';
}

// "最后一战"：欧冠蓝色对阵页（全称+简写、球迷媒体评价、三选项）
function showUclFinalCard() {
    const opp = gameStats.uclFixtures.final;
    const info = { full: opp.name, abbr: uclTeamAbbr[opp.name] || '' };
    const html = `
        <div class="ucl-final-board">
            <div class="ucl-final-team">
                <div class="ucl-final-abbr">ACM</div>
                <div class="ucl-final-name">AC米兰</div>
            </div>
            <div class="ucl-final-vs">VS</div>
            <div class="ucl-final-team">
                <div class="ucl-final-abbr">${info.abbr}</div>
                <div class="ucl-final-name">${info.full}</div>
            </div>
        </div>
        <div class="ucl-final-evals">
            <div><span>球迷</span>${uclFanEval(gameStats.fans)}</div>
            <div><span>媒体</span>${uclMediaEval(gameStats.media)}</div>
        </div>
        <div class="ucl-final-narr">下一轮，你们将要踏入${euroLabel()}决赛的赛场，队里有一半球员对${euroLabel()}赛场还不太熟悉，你们的主教练皮奥利，更是在此之前从未执教过进入${euroLabel()}决赛的球队。他们听从你的建议，你的一切对于${euroLabel()}赛场的建议，你选择：</div>`;
    renderUclCard('最后一战', html, [
        { text: '鼓励球员，相信他们之间的团队协作。', onClick: () => playUclFinal(5, 0) },
        { text: '注重防守，面对强大的对手不能自乱阵脚。', onClick: () => playUclFinal(5, 0.04) },
        { text: '全力进攻，将重点放在磨练已久的锋线上。', onClick: () => playUclFinal(5, 0.06) }
    ]);
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
    // 决赛前：最后一战（专属对阵页）
    if (gameStats.uclStage === 'final' && gameStats.round >= 36) {
        showUclFinalCard();
        return true;
    }
    // 十六强/八强/四强：欧战决策
    const info = uclStageMap[gameStats.uclStage];
    if (info && gameStats.round >= info.round) {
        const opp = gameStats.uclFixtures[info.key];
        renderUclCard(`${euroLabel()}决策`, `${euroLabel()}${info.label}在即，你们将迎战 <b>${opp.name}</b>，你决定：`, [
            { text: '全力争胜。（球员状态-5）', onClick: () => playUclKnockout('push') },
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
        add(36, '决赛', u.final.name);
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
        nameEl.textContent = opponentName;

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
            un.textContent = `${euroLabel()}${u.stage}·${u.name}`;
            const ures = document.createElement('span');
            ures.className = 'sch-result upcoming';
            ures.textContent = eliminated ? '出局' : (gameStats.round >= roundNum ? '已赛' : '待赛');
            urow.appendChild(ur); urow.appendChild(un); urow.appendChild(ures);
            list.appendChild(urow);
        });
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
    leagueTeams.forEach((team, i) => {
        const rank = i + 1;
        const zone = rank <= 4 ? 'zone-ucl' : rank <= 6 ? 'zone-uel' : '';
        const row = document.createElement('div');
        row.className = 'standings-row' + (zone ? ' ' + zone : '') +
            (team.name === 'AC Milan' ? ' is-milan' : '');
        row.innerHTML = `
            <span class="st-rank">${rank}</span>
            <span class="st-name">${team.name}</span>
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
                    <span class="history-round">第${entry.round}轮</span>
                </div>
                <div class="history-option">${entry.optionText}</div>
                <div class="history-effects">${parts || '无数值变化'}</div>`;
            list.appendChild(row);
        });
    }
    document.getElementById('history-modal').classList.remove('hidden');
});

document.getElementById('close-history-modal').addEventListener('click', () => {
    document.getElementById('history-modal').classList.add('hidden');
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
    difficultySelection.classList.add('hidden');
    mainInterface.classList.remove('hidden');
    for (const stat of ['trust', 'media', 'fans', 'player'])
        updateProgressBar(`${stat}-bar`, gameStats[stat]);
    updateBudget(0);
    updateScoreboard();
    updateDecisionPoints();
    eventOptions.classList.add('hidden');
    const allDone = gameStats.round >= 38;
    resetEventBtns(allDone ? '#ccc' : '');
    if (allDone) eventBtns.forEach(btn => { btn.disabled = true; btn.style.backgroundColor = '#ccc'; });
    startMatchBtn.disabled = decisionPoints < 2 || allDone;
    updateMagicPhoneBtn();
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