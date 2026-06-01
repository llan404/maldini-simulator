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
    consecutiveLosses: 0,
    southStandEventUsed: false,
    betKingEventUsed: false,
    rebateEventCount: 0,
    transferEventUsed: false,
    carCrashEventUsed: false,
    sinkOrSwimEventUsed: false,
    bigDataEventUsed: false,
    derbyLossEventPending: false,
    warningEventShown: false,
    gameEnded: false,
    season: 1,
    futureRandomEvents: [],
    usedMainlineEvents: [],
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
            { text: "保守", effects: { trust: 6, media: -4 } },
            { text: "激进", effects: { trust: -6, media: 6 } }
        ]
    },
    2: {
        description: "向球队董事会申请预算时，你的计划是：",
        options: [
            { text: "谨慎", effects: { trust: -2, budget: 200 } },
            { text: "大胆", effects: { trust: -8, budget: 600 } }
        ]
    },
    3: {
        description: "进行常规新闻发布会时，你的风格是：",
        options: [
            { text: "标准", effects: { media: 2, trust: 2 } },
            { text: "主动", effects: { media: 6, trust: -4, fans: 3 } },
            { text: "指责对手", effects: { media: 9, trust: -7, player: -4 } }
        ]
    },
    4: {
        description: "媒体邀请你参加赛后的深度采访时，你的选择是：",
        options: [
            { text: "参加", effects: { media: 5, player: -3 } },
            { text: "拒绝", effects: { media: -4, trust: 4 } }
        ]
    },
    5: {
        description: "赛前最后一次集合时，你需要对球员做出一些鼓励，你的选择是：",
        options: [
            { text: "鼓励全队", effects: { player: 6, media: -2 } },
            { text: "激励关键球员", effects: { player: 4, fans: -3, media: 3 } }
        ]
    },
    6: {
        description: "你需要对球队近一段时间的表现做出内部总结时：",
        options: [
            { text: "正面鼓励", effects: { player: 6, trust: -4 } },
            { text: "严厉批评", effects: { player: -6, trust: 5, fans: 4 } }
        ]
    },
    7: {
        description: "在下一场比赛来临之前，你决定对阵容提出一些意见：",
        options: [
            { text: "大幅轮换", effects: { player: 5, fans: -6 } },
            { text: "固定主力", effects: { player: -4, fans: 6 } }
        ]
    },
    8: {
        description: "转会窗来临前，你对球员合同谈判态度是：",
        options: [
            { text: "宽松", effects: { player: 7, trust: -6, budget: -400 } },
            { text: "强硬", effects: { player: -5, trust: 5, media: 4, budget: 200 } }
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
    3: {
        title: "赌王传奇Ⅰ",
        description: "队内的核心成员竟然被发现有赌博的习惯！据你所知，他几乎会下注自己参与的每一场比赛，在媒体、管理层和教练都不知道这件事之前，你决定",
        options: [
            { text: "将此事报告给管理层，希望能够尽早将此球员转会。", effects: { trust: 5, player: -5 } },
            { text: "和此球员私下聊聊，让他亲自告诉你这件事是否属实。", effects: {}, chain: { eventId: 'betKing2', probability: 0.5 } },
            { text: "球队正是需要他的时候，装作没看见。", effects: {}, chain: { eventId: 'betKing2', probability: 1.0 } }
        ]
    },
    betKing2: {
        title: "赌王传奇Ⅱ",
        description: "媒体拿到了切实的证据，你之前怀疑的那名球员确实频繁参与了赌博，他被指控赌过米兰自己的比赛，面临禁赛和高额罚款的惩罚，有媒体指责你早就是知情人士，却对此隐瞒不报，你选择：",
        options: [
            { text: "承担责任，俱乐部在这件事上失职了。", effects: { trust: -7, media: 3 }, chain: { eventId: 'betKing3', probability: 1.0 } },
            { text: "矢口否认，把责任推给球员。", effects: { media: -7, player: -7 } },
            { text: "付钱让媒体压稿，抢在禁赛前高价把他卖掉。", effects: { budget: 600, fans: -7, media: -7 } }
        ]
    },
    betKing3: {
        title: "赌王传奇Ⅲ",
        description: "那名球员主动向你坦白：他其实深陷赌瘾，愿意配合调查并且接受治疗以换取减刑。他问你：俱乐部还会要他吗？你选择：",
        options: [
            { text: "支持他认罪治疗，承诺留队等他回来。", effects: { fans: 7, player: 7, media: -3 } },
            { text: "希望他配合处罚，但球队不能留下赌徒。", effects: { trust: 5, player: -5 } },
            { text: "直接以赌球为理由，和这名球员解约。", effects: { budget: 200, player: -7, fans: -5 } }
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
            { text: "提醒管理层现在还没有ChatGPT。", effects: { trust: -5 } },
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
    17: {
        title: "德比失利",
        warningStyle: true,
        description: "输给国际米兰！这是谁都不愿意看到的事，球迷对球队的支持大幅度下降了，媒体却津津乐道，在接下来的一周，这场比赛中能被清算的还有很多。",
        note: "（发生此事件时球迷-5，媒体+3）",
        options: [
            { text: "继续", effects: { fans: -5, media: 3 } }
        ]
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
        description: "财务团队给你的答案只有一个，靠正常经营，哪怕一线队加上教练都去卖沟子这账也平不了，你们只会陷入更深的漩涡，没钱买球员，只能不断地卖人，你选择：",
        options: [
            { text: "主动认罚，放弃一年欧战，获得喘息的机会。", effects: { budget: 600, fans: -7, media: -5, trust: 5 } },
            { text: "打包三位主力球员一起买了，获得更多预算。", effects: { budget: 1000, fans: -5, player: -10 } },
            { text: "拒绝认罚，赌欧足联不会真的禁赛两年。", effects: {}, endingChance: { endingId: 'hardClash', probability: 0.5 } }
        ]
    },
    euroNight1: {
        title: "欧联之夜Ⅰ",
        mainline: true,
        description: "小组赛之夜，你们踢得毫无章法，前锋暴力射门，后防却门洞大开。教练在场边心急如焚，球员们却跟无头苍蝇一样乱窜，球员时代给你的直觉让你早早看出了输赢。比赛结束，你们不可思议的在小组赛出去了，CEO给你发了条消息：\"我们要谈谈换教练的事。\"",
        options: [
            { text: "向媒体和管理层公开揽责，宣称是自己的问题。", effects: { trust: -5, media: 3 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 36 } },
            { text: "自己和教练都是一根绳的蚂蚱，等待管理层的安排。", effects: { trust: 2 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 36 } },
            { text: "暗示主要是教练的责任，提出想换帅。", effects: { media: 3, player: -5 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 36 } }
        ]
    },
    euroNight2: {
        title: "欧联之夜Ⅱ",
        mainline: true,
        description: "上一次欧战给你们的打击还没有过去，联赛多轮不胜又来了，外界对于换帅的呼声越来越高。你看向这位米兰名宿，你和他曾是关系紧密的队友，你深知以他的性格，已经做了能为米兰做的一切，你选择：",
        options: [
            { text: "替他担保，认为他再干一个赛季会更好。", effects: { trust: -2 }, chain: { eventId: 'farewell', probability: 1.0, minRound: 38 } },
            { text: "体面换帅，向媒体直言他已经做到最好。", effects: { trust: 2, media: 2 }, chain: { eventId: 'farewell', probability: 0.5, minRound: 38 } },
            { text: "下最后通牒，给他时间证明自己。", effects: { trust: 5, player: -3 } }
        ]
    },
    farewell: {
        title: "告别",
        mainline: true,
        description: "他最终还是离开了，在多方压力下，拿着一只受FFP约束、临时拼凑的球队，问题或许不在他。他没有推荐下一位教练，也没有要遣散费。这是我能留给米兰的最后一笔钱了。在这位教练走后，他给你的私人账号发了一封长长的告别信，米兰对我意义非凡，我希望你能干得比我更好，衷心的、最美好的祝愿。",
        options: [
            { text: "了解。", effects: {} }
        ]
    }
};

// 主线事件池 — 各赛季专属事件，仅在对应赛季内随机触发
const mainlineEventPools = {
    1: ['ffp1', 'euroNight1'],
    2: [],
    3: [],
    4: [],
    5: []   // 第五赛季主线事件（暂未填充）
};

// 各赛季主线事件的最早触发轮次（含）
const mainlineRoundConstraints = {
    1: { ffp1: 6, euroNight1: 26 }
};

// 赛季开幕简报数据
const seasonIntros = {
    1: {
        title: '第一赛季·废墟上的人',
        tasks: ['赛季末预算大于 2000w 欧', '排名不低于第 10 位'],
        taskCheck: () => gameStats.budget > 2000 && gameStats.ranking <= 10,
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
            '对于现在的米兰来说，买不起经验丰富的知名球星。即使是能和经纪人谈好，球员本人也会要求高薪资和战术地位。你选择将目光放在几位小将身上，遗憾的是，即使是初出茅庐的稍有潜力的小将，对米兰的预算来说也不便宜。稍有不慎，你可能就会购入天价饮水机。',
            '你做出准确的判断，在【排名】更进一步的情况下，提升【球员状态】。'
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
        text: "卡尔迪纳莱的电话，第一个你没接，他又打了第二个，第三个电话爆发出他怒气冲冲的声音：你被解雇了！什么？我在开玩笑，我是认真的，请立刻来米兰内洛签合同。你干的很好？是，大概吧，不过我现在决定解雇你，我当然有这个权力。因为你而续约的球员？我会处理好他们的，马上就有一位新的总监——你还没听懂吗，保罗·马尔蒂尼，你被解雇了！"
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
    return { winA, winB: 1 - drawRate - winA, drawRate };
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
    const statusBonus = (gameStats.player - 50) / 150;
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
        slashEl.textContent = multiSeason ? `/38 · 第${gameStats.season}季` : '/38';
    }
    const hasMatch = gameStats.lastScore !== '';
    document.getElementById('last-score-home').textContent = hasMatch ? 'AC Milan' : '';
    document.getElementById('last-score-num').textContent = hasMatch ? gameStats.lastScore : '';
    document.getElementById('last-score-away').textContent = hasMatch ? gameStats.lastOpponentDisplay : '';
}

function playRound(opponentName) {
    const opponent = getTeamByName(opponentName);
    const winRate = getWinRate(opponent.category);
    let drawRate = 0.18;
    if (winRate > 0.8) {
        drawRate = 0.12;
    } else if (winRate < 0.5) {
        drawRate = 0.22;
    }
    const random = Math.random();
    let result;
    if (random < winRate) {
        result = 'win';
    } else if (random < winRate + drawRate) {
        result = 'draw';
    } else {
        result = 'loss';
    }

    let score;
    if (result === 'win') {
        const ourGoals = 1 + Math.floor(Math.random() * 3);
        const theirGoals = Math.floor(Math.random() * 2);
        score = `${ourGoals}:${theirGoals}`;
        gameStats.points += 3;
        gameStats.consecutiveLosses = 0;
        gameStats.southStandEventUsed = false;
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
        gameStats.consecutiveLosses = 0;
        gameStats.southStandEventUsed = false;
        if (gameStats.media > 80) {
            updateStat('fans', -5);
        }
    } else {
        const ourGoals = Math.floor(Math.random() * 2);
        const theirGoals = 1 + Math.floor(Math.random() * 3);
        score = `${ourGoals}:${theirGoals}`;
        opponent.points += 3;
        gameStats.consecutiveLosses += 1;
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
    const parts = [];
    for (const [stat, delta] of Object.entries(effects)) {
        const sign = delta > 0 ? '+' : '';
        const name = statNames[stat] || stat;
        parts.push(`${name}${sign}${delta}`);
    }
    return parts.join(', ');
}

// 关闭弹窗事件 → 先显示测试反馈
closeEventBtn.addEventListener('click', function() {
    eventModal.style.display = 'none';
    document.getElementById('test-notice-modal').classList.remove('hidden');
});

document.getElementById('close-test-notice').addEventListener('click', function() {
    document.getElementById('test-notice-modal').classList.add('hidden');
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
function showSeasonIntro(season, difficulty) {
    const intro = seasonIntros[season];
    if (!intro) {
        if (difficulty !== null) {
            mainInterface.classList.remove('hidden');
            initializeGame(difficulty);
        }
        return;
    }
    pendingDifficulty = difficulty;
    document.getElementById('season-intro-title').textContent = intro.title;

    const tasksEl = document.getElementById('season-intro-tasks');
    tasksEl.innerHTML = '';
    intro.tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'season-task-item';
        div.textContent = '· ' + task;
        tasksEl.appendChild(div);
    });

    const descEl = document.getElementById('season-intro-description');
    descEl.innerHTML = '';
    intro.description.forEach(para => {
        const p = document.createElement('p');
        p.innerHTML = formatBrackets(para);
        descEl.appendChild(p);
    });

    document.getElementById('season-intro-modal').classList.remove('hidden');
}

document.getElementById('show-tasks-btn').addEventListener('click', function() {
    const season = gameStats.season;
    const intro = seasonIntros[season];
    const titleEl = document.getElementById('season-tasks-title');
    const listEl = document.getElementById('season-tasks-list');

    if (!intro) {
        titleEl.textContent = `第${season}赛季`;
        listEl.innerHTML = '<p class="no-tasks-note">本赛季暂无主线任务。</p>';
    } else {
        titleEl.textContent = intro.title;
        listEl.innerHTML = '';
        intro.tasks.forEach(task => {
            const div = document.createElement('div');
            div.className = 'season-task-item';
            div.textContent = '· ' + task;
            listEl.appendChild(div);
        });
    }

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
    }
    // 赛季中期过渡：游戏状态已由 startNewSeason() 重置，直接继续
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
    if (statName === 'trust' && gameStats.trust <= 0) {
        showEnding('trust');
    } else if (statName === 'media' && gameStats.media <= 0) {
        showEnding('media');
    } else if (statName === 'fans' && gameStats.fans <= 0) {
        showEnding('fans');
    } else if (statName === 'player' && gameStats.player <= 0) {
        showEnding('player');
    }
}

// 显示结局
function showEnding(endingKey) {
    const ending = endings[endingKey];
    if (!ending) return;
    gameStats.gameEnded = true;
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-text').textContent = ending.text;
    document.getElementById('ending-modal').classList.remove('hidden');
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
    const initVal = difficulty === 'hard' ? 30 : 50;
    gameStats = { trust: initVal, media: initVal, fans: initVal, player: initVal, budget: 1000, points: 0, ranking: 1, round: 0, lastScore: '', lastOpponentDisplay: '', consecutiveLosses: 0, southStandEventUsed: false, betKingEventUsed: false, rebateEventCount: 0, transferEventUsed: false, carCrashEventUsed: false, sinkOrSwimEventUsed: false, bigDataEventUsed: false, derbyLossEventPending: false, warningEventShown: false, gameEnded: false, season: 1, futureRandomEvents: [], usedMainlineEvents: [], shownWarnings: { trustCrisis: false, trustCritical: false, mediaCrisis: false, mediaCritical: false, playerCrisis: false, playerCritical: false, fansCrisis: false, fansCritical: false }, difficulty };
    lastOpponentName = '';
    initializeLeague();
    updateLeagueRanking();
    updateProgressBar('trust-bar', initVal);
    updateProgressBar('media-bar', initVal);
    updateProgressBar('fans-bar', initVal);
    updateProgressBar('player-bar', initVal);
    updateBudget(0);
    updateScoreboard();
    
    // 重置决策点
    decisionPoints = 0;
    updateDecisionPoints();
    // 启用事件按钮
    eventBtns.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = '#8B0000';
    });
    startMatchBtn.disabled = true;
    eventOptions.classList.add('hidden');
}

// 事件按钮点击
eventBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        if (decisionPoints >= 2) return;
        
        const eventId = this.getAttribute('data-event');
        const event = events[eventId];
        
        eventDescription.textContent = event.description;
        optionButtons.innerHTML = '';
        
        event.options.forEach((option, index) => {
            const optionContainer = document.createElement('div');
            optionContainer.className = 'option-container';
            
            const optionBtn = document.createElement('button');
            optionBtn.textContent = option.text;
            optionBtn.className = 'option-btn';
            
            const effectsSpan = document.createElement('span');
            effectsSpan.textContent = formatEffects(option.effects);
            effectsSpan.className = 'effects-text';
            
            optionBtn.addEventListener('click', () => {
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

function drawOpponent() {
    let opponent = teams[Math.floor(Math.random() * teams.length)];
    while (opponent.name === lastOpponentName) {
        opponent = teams[Math.floor(Math.random() * teams.length)];
    }
    lastOpponentName = opponent.name;
    return opponent.name;
}

// 随机选择随机事件
function selectRandomEvents() {
    const selectedEvents = [];

    // 连续失利后的特殊事件优先触发
    if (gameStats.consecutiveLosses >= 3 && !gameStats.southStandEventUsed) {
        selectedEvents.push(2);
        gameStats.southStandEventUsed = true;
        return selectedEvents;
    }

    // 德比失利必定触发
    if (gameStats.derbyLossEventPending) {
        gameStats.derbyLossEventPending = false;
        selectedEvents.push(17);
        return selectedEvents;
    }

    // 待触发的链式事件（满足最早轮次后60%概率触发，否则延到下一回合）
    if (gameStats.futureRandomEvents.length > 0) {
        const pending = gameStats.futureRandomEvents[0];
        const eventId = typeof pending === 'object' ? pending.eventId : pending;
        const minRound = typeof pending === 'object' ? (pending.minRound || 0) : 0;
        if (gameStats.round >= minRound && Math.random() < 0.6) {
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

    // 随机事件池（event 3 已移入主线事件池，不再进入随机池）
    const eventIds = Object.keys(randomEvents).filter(id => {
        const numId = parseInt(id);
        if (isNaN(numId)) return false;
        if (numId === 3 && gameStats.betKingEventUsed) return false;
        if (numId === 5 && gameStats.rebateEventCount >= 2) return false;
        if (numId === 10 && gameStats.transferEventUsed) return false;
        if (numId === 11 && gameStats.carCrashEventUsed) return false;
        if (numId === 13 && gameStats.sinkOrSwimEventUsed) return false;
        if (numId === 15 && gameStats.bigDataEventUsed) return false;
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
    selectedEvents.push(selectedId);
    return selectedEvents;
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

function showRandomEvents() {
    randomEventModal.classList.remove('warning');
    randomEventModal.classList.remove('mainline');
    currentRandomEvents = selectRandomEvents();
    randomEventIndex = 0;
    showNextRandomEvent();
}

// 每轮关闭周报时应用的持续衰减效果
function applyWarningEffects() {
    if (gameStats.trust > 0 && gameStats.trust < 15) {
        updateBudget(-200);
    } else if (gameStats.trust >= 15 && gameStats.trust < 30) {
        updateBudget(-100);
    }
    if (gameStats.media > 0 && gameStats.media < 15) {
        updateStat('fans', -2);
        updateStat('trust', -2);
    } else if (gameStats.media >= 15 && gameStats.media < 30) {
        updateStat('fans', -1);
    }
    if (gameStats.player > 0 && gameStats.player < 15) {
        updateStat('media', -3);
        updateStat('fans', -3);
    } else if (gameStats.player >= 15 && gameStats.player < 30) {
        updateStat('media', -2);
    }
    if (gameStats.fans > 0 && gameStats.fans < 15) {
        updateBudget(-200);
        updateStat('trust', -2);
    } else if (gameStats.fans >= 15 && gameStats.fans < 30) {
        updateBudget(-100);
    }
}

// 检测本轮新触发的预警并返回队列
function getNewWarnings() {
    const queue = [];
    const evtMap = Object.fromEntries(statWarningEvents.map(e => [e.key, e]));
    const statPairs = [
        ['trustCrisis', 'trustCritical'],
        ['mediaCrisis', 'mediaCritical'],
        ['playerCrisis', 'playerCritical'],
        ['fansCrisis', 'fansCritical']
    ];
    for (const [crisisKey, criticalKey] of statPairs) {
        const critEvt = evtMap[criticalKey];
        const crisEvt = evtMap[crisisKey];
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
        if (pendingSeasonEndCallback) {
            const cb = pendingSeasonEndCallback;
            pendingSeasonEndCallback = null;
            cb();
            return;
        }
        resetAfterMatch();
        return;
    }

    const eventId = currentRandomEvents[randomEventIndex];
    const event = randomEvents[eventId];

    document.getElementById('random-event-title').textContent = event.title;
    if (event.warningStyle) {
        randomEventModal.classList.add('warning');
        randomEventModal.classList.remove('mainline');
        document.getElementById('random-event-description').innerHTML =
            event.description + (event.note ? `<span class="warning-note">${event.note}</span>` : '');
    } else if (event.mainline) {
        randomEventModal.classList.add('mainline');
        randomEventModal.classList.remove('warning');
        document.getElementById('random-event-description').innerHTML = formatBrackets(event.description);
    } else {
        randomEventModal.classList.remove('mainline');
        randomEventModal.classList.remove('warning');
        document.getElementById('random-event-description').textContent = event.description;
    }
    
    const optionsContainer = document.getElementById('random-event-options');
    optionsContainer.innerHTML = '';
    
    let visibleOptionIndex = 0;
    event.options.forEach((option) => {
        if (option.condition && !option.condition()) {
            return;
        }
        visibleOptionIndex++;
        const button = document.createElement('button');
        button.textContent = event.warningStyle ? option.text : `${visibleOptionIndex}. ${option.text}`;
        button.className = 'random-event-option';
        button.addEventListener('click', () => {
            // 应用效果
            for (const [stat, delta] of Object.entries(option.effects)) {
                updateStat(stat, delta);
            }
            if (eventId === 3) { gameStats.betKingEventUsed = true; }
            if (eventId === 13) { gameStats.sinkOrSwimEventUsed = true; }
            if (eventId === 15) { gameStats.bigDataEventUsed = true; }
            if ((mainlineEventPools[gameStats.season] || []).includes(eventId) &&
                !gameStats.usedMainlineEvents.includes(eventId)) {
                gameStats.usedMainlineEvents.push(eventId);
            }
            if (eventId === 5) { gameStats.rebateEventCount += 1; }
            if (option.chain && Math.random() < option.chain.probability) {
                const entry = option.chain.minRound
                    ? { eventId: option.chain.eventId, minRound: option.chain.minRound }
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
            randomEventIndex++;
            showNextRandomEvent();
        });
        optionsContainer.appendChild(button);
    });
    
    randomEventModal.classList.remove('hidden');
}

function getActiveEffectsText() {
    const d = { budget: 0, trust: 0, media: 0, fans: 0 };
    if (gameStats.trust > 0 && gameStats.trust < 15)       { d.budget -= 200; }
    else if (gameStats.trust >= 15 && gameStats.trust < 30) { d.budget -= 100; }
    if (gameStats.media > 0 && gameStats.media < 15)        { d.fans -= 2; d.trust -= 2; }
    else if (gameStats.media >= 15 && gameStats.media < 30) { d.fans -= 1; }
    if (gameStats.player > 0 && gameStats.player < 15)       { d.media -= 3; d.fans -= 3; }
    else if (gameStats.player >= 15 && gameStats.player < 30){ d.media -= 2; }
    if (gameStats.fans > 0 && gameStats.fans < 15)          { d.budget -= 200; d.trust -= 2; }
    else if (gameStats.fans >= 15 && gameStats.fans < 30)   { d.budget -= 100; }
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
    eventBtns.forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = '#8B0000';
    });
    startMatchBtn.disabled = true;
}

function startNewSeason() {
    gameStats.season += 1;
    gameStats.round = 0;
    gameStats.points = 0;
    gameStats.ranking = 1;
    gameStats.lastScore = '';
    gameStats.lastOpponentDisplay = '';
    gameStats.consecutiveLosses = 0;
    gameStats.southStandEventUsed = false;
    gameStats.betKingEventUsed = false;
    gameStats.rebateEventCount = 0;
    gameStats.transferEventUsed = false;
    gameStats.carCrashEventUsed = false;
    gameStats.sinkOrSwimEventUsed = false;
    gameStats.bigDataEventUsed = false;
    gameStats.derbyLossEventPending = false;
    gameStats.warningEventShown = false;
    gameStats.futureRandomEvents = [];
    gameStats.usedMainlineEvents = [];
    gameStats.shownWarnings = {
        trustCrisis: false, trustCritical: false,
        mediaCrisis: false, mediaCritical: false,
        playerCrisis: false, playerCritical: false,
        fansCrisis: false, fansCritical: false
    };
    lastOpponentName = '';
    initializeLeague();
    updateLeagueRanking();
    updateScoreboard();
    decisionPoints = 0;
    updateDecisionPoints();
    eventBtns.forEach(btn => { btn.disabled = false; btn.style.backgroundColor = ''; });
    startMatchBtn.disabled = true;
    eventOptions.classList.add('hidden');
    showSeasonIntro(gameStats.season, null);
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
    const modal = document.getElementById('season-result-modal');
    modal.classList.remove('passed', 'failed');
    modal.classList.add('passed');
    document.getElementById('season-result-title').textContent = '下一个赛季';
    document.getElementById('season-result-text').textContent = '你完美的完成了这个赛季的任务，你仍然是这支球队不可动摇的球队总监。';
    modal.classList.remove('hidden');
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

closeResultBtn.addEventListener('click', function() {
    matchResultModal.classList.add('hidden');
    matchResultModal.classList.remove('weekly');

    if (isSeasonTransition) {
        isSeasonTransition = false;
        startNewSeason();
        return;
    }

    if (gameStats.round >= 38) {
        // 赛季结束时先检测是否有告别事件待触发
        const farewellIdx = gameStats.futureRandomEvents.findIndex(
            e => (typeof e === 'object' ? e.eventId : e) === 'farewell'
        );
        if (farewellIdx !== -1) {
            gameStats.futureRandomEvents.splice(farewellIdx, 1);
            currentRandomEvents = ['farewell'];
            randomEventIndex = 0;
            pendingSeasonEndCallback = () => {
                if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) { showEnding('surprise'); return; }
                const _intro = seasonIntros[gameStats.season];
                if (_intro && _intro.taskCheck) { showSeasonResult(_intro.taskCheck()); return; }
                if (gameStats.difficulty === 'easy') { showEnding(getSeasonEndingKey()); return; }
                showSeasonTransition(gameStats.season);
            };
            showNextRandomEvent();
            return;
        }
        if (gameStats.difficulty !== 'easy' && gameStats.season >= 5) {
            showEnding('surprise');
            return;
        }
        const intro = seasonIntros[gameStats.season];
        if (intro && intro.taskCheck) {
            showSeasonResult(intro.taskCheck());
            return;
        }
        if (gameStats.difficulty === 'easy') {
            showEnding(getSeasonEndingKey());
            return;
        }
        showSeasonTransition(gameStats.season);
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

// 重新开始游戏
document.getElementById('restart-game').addEventListener('click', function() {
    document.getElementById('ending-modal').classList.add('hidden');
    matchResultModal.classList.add('hidden');
    matchResultModal.classList.remove('weekly');
    decisionPoints = 0;
    mainInterface.classList.add('hidden');
    eventModal.style.display = 'flex';
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

    const opponentName2 = drawOpponent();
    const matchResult2 = playRound(opponentName2);
    gameStats.round = Math.min(38, gameStats.round + 1);
    updateScoreboard();
    eventOptions.classList.add('hidden');
    if (matchResult2 === null) return;

    showWeeklyReport(matchResult1, matchResult2);

    if (gameStats.round >= 38) {
        eventBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
        });
        startMatchBtn.disabled = true;
    }
});