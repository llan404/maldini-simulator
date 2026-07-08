// ===== 随机事件·文字内容（数字随机事件 + 德比/断尾等命名随机事件）=====
// 事件结构与触发条件随文案一并存放（effects/condition/chain 等均为事件定义的一部分，未作改动）。
// 主代码 script.js 仅引用全局 randomEvents，不在其中写文案。
// 须先于 script.js 引入；主线/新闻事件见 mainlineContent.js（用 Object.assign 追加，须在本文件之后引入）。

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
            { text: "在媒体面前表达对胜利的决心，并声明现在不是换教练的好时机。", effects: { media: 5, fans: -3 }, deliverMail: 'southStandRep' }, // → 南看台代表私信（消息32）
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
        description: "突发新闻！你被内幕人士指责在转会市场上搅弄风云，为自己疯狂敛财。他们指出你故意买来一些过分溢价的球员，然后从他们的经纪人那里收取回扣。对此，你的解释是：",
        options: [
            { text: "转会市场五百万的预算，你们要三个前锋五个后卫，我拿点钱怎么了", effects: { trust: -6, media: -4 } },
            { text: "解释这么点回扣不够自己拿的。", effects: { trust: 5, budget: -400 }, deliverMail: 'kickbackDm' }, // → 周日体育场记者私信（消息37）
            { text: "私下追查所谓的内幕人士究竟是谁。", effects: { media: -5, player: -3 } }
        ]
    },
    6: {
        title: "青训天才",
        description: "青年队最近冒出来一个极具潜力的球员，在青年队中大杀四方，甚至已经有球迷开始拿他和传奇名宿比较。但问题是，他最近越来越不拿教练当回事了，训练迟到、拒绝加练，甚至还在采访里说\"一线队的防守也就那样\"，你选择：",
        options: [
            { text: "直接提拔进一线队，让他知道职业足球到底是什么强度。", effects: { player: 7, trust: -5 }, deliverMail: 'youthTalentDm' }, // → 青训天才私信（消息33）
            { text: "让青年队教练狠狠敲打他。", effects: { player: 3, fans: -3 } },
            { text: "既然这么狂，那就租借出去吃点苦头。", effects: { budget: 400, player: -4, fans: -3 } }
        ]
    },
    7: {
        title: "经纪人来访",
        description: "某主力球员的经纪人突然联系你，他认为自己的客户配得上更高的工资。如果球队不能满足要求，他不排除在下个转会窗推动转会。更麻烦的是，这件事已经被媒体知道了，你选择：",
        options: [
            { text: "尝试提前续约，稳定更衣室情绪。", effects: { budget: -600, player: 6, media: 3 } },
            { text: "我们没有更多的预算，很抱歉。", effects: { player: -6, media: -4 } },
            { text: "答应他的要求，如果留不住人，至少也要留住一笔钱。", effects: { budget: 600, player: -4, media: -3 } }
        ]
    },
    8: {
        title: "名宿声援",
        description: "球队的名宿在节目中力挺你对球队的付出，称你为’真正的米兰人’。管理层对此颇有微词，他们认为球队不应该听名宿的话，毕竟这是一家现代化的球队。你选择：",
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
            { text: "向你熟悉的媒体求助，究竟哪里惹着这位裁判了？", effects: { fans: 5, player: 5 }, condition: () => gameStats.media > 80, deliverMail: 'refWhistleDm' } // → 米兰体育报记者私信（消息36）
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
        description: "球队的一位年轻球员凌晨开着法拉利撞上了路边护栏，幸好人没事，但照片已经传开了。外界猜什么的都有，赞助商问你球员发生车祸的时候怎么还穿着球衣呢？他以为这是在做代言吗？这多破坏我们品牌的形象。你选择：",
        options: [
            { text: "让球员公开道歉，并承担全部责任。", effects: { media: 6, player: -5 }, deliverMail: 'carCrashDm' }, // → 米兰体育报记者私信（消息38）
            { text: "内部低调处理，尽量别再扩大影响。", effects: { media: 3, trust: -5, budget: -400 }, deliverMail: 'carCrashDm' },
            { text: "直接罚款停训。", effects: { fans: 6, player: -5 }, deliverMail: 'carCrashDm' }
        ]
    },
    12: {
        title: "汇报之争",
        description: "你在转会决策和球队建设上左右为难，富尔拉尼要求你跟他直线汇报，卡尔迪纳莱坚持只说英语，同一个球员的引援，你做了三份报告，第一份发给富尔拉尼，第二份发给卡尔迪纳莱，第三份解释为什么这两份报告的侧重点不同，你选择：",
        options: [
            { text: "将富尔拉尼作为主汇报人。", effects: { trust: 5, budget: 200 } },
            { text: "将卡尔迪纳莱作为主汇报人。", effects: { trust: 5, budget: 200 } },
            { text: "不做单线汇报，只在他们都在场的时候说事。", effects: { media: 3 } }
        ]
    },
    13: {
        title: "断尾求生",
        description: "球队在本赛季的预算即将见底！某个传统豪门俱乐部以一个不算太高的价格报价你们的主力前锋，如果卖掉他，在下个转会窗你们将非常被动，可是如果不卖他，很有可能你们连这个赛季都撑不过去。你选择：",
        options: [
            { text: "相信球员的凝聚力，拒绝出售。", effects: { player: 3 } },
            { text: "答应对方的报价，先解决燃眉之急再说。", effects: { player: -5, budget: 500 } },
            { text: "只值这么点钱？要求对方提高报价。", effects: { player: -3 }, chain: { eventId: 'sinkOrSwim2', probability: 1.0 } }
        ]
    },
    sinkOrSwim2: {
        title: "断尾求生Ⅱ",
        description: "之前报价的豪门俱乐部稍微提高了一点价格，在加价的基础上，他们愿意将刚买来的小将放在米兰租借两年，你选择：",
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
            { text: "把账单发给国际米兰，让对方也出一部分。", effects: { budget: -100, player: 2 }, deliverMail: 'interLawnBill' } // → 国米私信（消息8）送达，幂等仅一次
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
            { text: "确认", effects: { budget: -50 }, deliverMail: 'overtimeFineDm' } // → 队长私信（消息35）
        ]
    },
    17: {
        title: "德比失利",
        warningStyle: true,
        description: "输给国际米兰！这是谁都不愿意看到的事，球迷对球队的支持大幅度下降了，媒体却津津乐道，在接下来的一周，这场比赛中能被清算的还有很多。",
        note: "（球迷满意度-5，媒体声望-3）",
        options: [
            { text: "继续", effects: { fans: -5, media: -3 } }
        ]
    },
    derbyWin: {
        title: "德比获胜！",
        noHistory: true, // 结算卡，不进决策记录
        description: "你们赢下了万众瞩目的米兰城德比，球迷们非常高兴，球队的影响力也上升了。",
                note: "（发生此事件时球迷满意度+5，媒体声望+3）",
        options: [
            { text: "继续", effects: { fans: 5, media: 3 } }
        ]
    },
};
