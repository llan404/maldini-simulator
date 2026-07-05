// ===== 主线 / 新闻事件·文字内容 =====
// 各赛季命名主线事件、新闻卡（newsStyle / newsCompilation）等，追加到 eventContent.js 定义的 randomEvents。
// 事件结构与触发条件随文案一并存放，未作改动。须先于 script.js、且在 eventContent.js 之后引入。

Object.assign(randomEvents, {
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
        description: "你花了一个周末的时间制作了更详尽的方案，由于你在上个赛季的表现深得管理层的信任，他们为你增加了一点预算，你可以在本次夏窗购入最多【四名】球员。<br>本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { budget: 500 }, transferSlots: 4 }]
    },
    transferRightsB: {
        title: "转会操作权",
        mainline: true,
        description: "你留下了一部分老将，由于你在上个赛季的表现深得管理层的信任，他们为你增加了一点预算你可以在本次夏窗最多购入【两名】球员。<br>本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { budget: 500 }, transferSlots: 2 }]
    },
    transferRightsC: {
        title: "转会操作权",
        mainline: true,
        description: "你的决定在球迷中引起了一部分讨论，他们倍受喜爱的球员有可能在夏窗被出售，他们在球员的社交媒体下疯狂发消息。他们的态度如何变化，就要看这个夏天你签下的球员是否能让他们满意了。你可以在本次夏窗最多购入【三名】球员。<br>本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: { fans: -1 }, transferSlots: 3 }]
    },
    transferRightsD: {
        title: "转会操作权",
        mainline: true,
        description: "在新人和老将之间做取舍是一个痛苦的决定，你认为不能大刀阔斧的变革，仅仅清理一部分不适合的球员就够了。这个夏窗，你暂时没有太多的决定权。你可以在本次夏窗最多购入【一名】球员。<br>本轮比赛结束后，将开启夏季转会窗。",
        options: [{ text: "了解", effects: {}, transferSlots: 1 }]
    },
    ffp1: {
        title: "FFP的绞索Ⅰ",
        mainline: true,
        description: "金元足球的热量褪去后，给你们带来了数不清的烂摊子，这笔烂账之前不关你事，但要是这个赛季结束后还缠在你的脖子上，那么欧足联就要给你找大麻烦了。欧足联的审计员皮笑肉不笑地坐在你的办公室里，你选择：",
        options: [
            { text: "召集另一个审计团队，想方设法凑出利润来。", effects: { trust: 5, budget: -200 }, deliverMail: 'ffpGoldAudit', chain: { eventId: 'ffp2', probability: 1.0, minRound: 16 } }, // → 金牌审计私信（消息4）
            { text: "私下谈谈欧足联的口风，寻求和解的可能。", effects: {}, deliverMail: 'ffpUefaAudit', chain: { eventId: 'ffp2', probability: 1.0, minRound: 16 } }, // → 欧足联审计员私信（消息3）
            { text: "强硬宣称FFP规则不公，保护的是豪门，而非我们这种需要重建的球队。", effects: { trust: -10, media: 3, budget: -500 }, chain: { eventId: 'ffp2', probability: 1.0, minRound: 16 } } // 选①②③ ffp2 均必定触发
        ]
    },
    ffp2: {
        title: "FFP的绞索Ⅱ",
        mainline: true,
        description: "财务团队给你的答案只有一个，靠正常经营，哪怕一线队加上教练都去卖沟子这账也平不了。你们只会陷入更深的漩涡：没钱买球员，只能不断地卖人，你选择：",
        options: [
            { text: "主动认罚，放弃一年欧战，获得喘息的机会。", effects: { budget: 800, media: -5 }, euroBan: true, deliverMail: 'ffpGattusoBan', chain: { eventId: 'ffp3', probability: 1.0, immediate: true } }, // → 加图索私信（消息5）
            { text: "打包三位主力球员一起买了，获得更多预算。", effects: { budget: 1500, fans: -5, player: -10 }, deliverMail: ['ffpSell', 'ffpPlayerSold'] }, // → 莱昂纳多邮件06 + 主力球员私信（消息6）
            { text: "拒绝认罚，赌欧足联不会真的禁赛两年。（概率结局）", effects: {}, endingChance: { endingId: 'hardClash', probability: 0.5 } }
        ]
    },
    ffp3: {
        title: "处罚结果",
        mainline: true,
        description: () => {
            const base = '你和主教练走进更衣室向球员们宣布了欧足联的处罚决定：下赛季米兰将不得参加所有的欧战赛事，更衣室的气氛有短暂的停滞。';
            if (gameStats.player >= 60 && gameStats.ranking <= 3) {
                return base + '\n队长在此时站出来说，那么，我们就拿下那个该死的意甲冠军！更衣室重新开始骚动起来，你们的确离这个目标很近，部分球员受到了鼓舞。（【球员状态】+2）';
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
            { text: "向媒体和管理层公开揽责，宣称是自己的问题。", effects: { trust: -5, media: 3 }, deliverMail: 'euroNightGattuso', chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } }, // → 加图索私信（消息7）
            { text: "自己和教练都是一根绳上的的蚂蚱，等待管理层的安排。", effects: { trust: 2 }, deliverMail: 'euroNightGattuso', chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } }, // → 加图索私信（消息7）
            { text: "暗示主要是教练的责任，提出想换帅。", effects: { media: 3, player: -5 }, chain: { eventId: 'euroNight2', probability: 1.0, minRound: 34, immediate: true } }
        ]
    },
    euroNight2: {
        title: "欧联之夜Ⅱ",
        mainline: true,
        description: "上一次欧战给你们的打击还没有过去，联赛多轮不胜又来了，外界对于换帅的呼声越来越高。你看向这位米兰名宿，你和加图索曾是关系紧密的队友。你深知他的性格，已经做了能为米兰做的一切，你选择：",
        options: [
            { text: "替他担保，认为他再干一个赛季会更好。", effects: { trust: -2 }, chain: { eventId: 'farewell', probability: 1.0, minRound: 38 } },
            { text: "体面换帅，向媒体直言他已经做到最好。", effects: { trust: 2, media: 2 }, deliverMail: 'coachChange', chain: { eventId: 'farewell', elseEventId: 'resignation', probability: 0.5, minRound: 38 } }, // → CEO邮件08 送达
            { text: "下最后通牒，给他时间证明自己。", effects: { trust: 5, player: -3 }, chain: { eventId: 'resignation', probability: 1.0, minRound: 38 } }
        ]
    },
    farewell: {
        title: "告别",
        mainline: true,
        description: "加图索最终还是离开了，在多方压力下，拿着一只受FFP约束、临时拼凑的球队，以惨败的结局收场。他没有要遣散费。这是我能留给米兰的最后一笔钱了。离开之前，他感谢了你在这个赛季对他的帮助。",
        options: [
            { text: "确认", effects: {}, deliverMail: 'gattusoFarewell' } // → 加图索告别邮件09 送达
        ]
    },
    // 与"告别"互斥（同为加图索离任结局，欧联之夜Ⅱ二选一链路，同在 R38 触发）
    resignation: {
        title: "辞呈",
        mainline: true,
        description: "加图索向管理层递交了辞职信，无论米兰的成绩如何，他的执教观念和现在的队伍存在着诸多冲突。他已经尽了最大的努力，能为米兰做的事情到此为止了。",
        options: [
            { text: "确认", effects: {}, deliverMail: 'gattusoFarewell' } // → 加图索告别邮件09 送达
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
            { text: "支持教练，米兰不适合频繁换帅。", effects: { player: 3 }, deliverMail: 'pioliCoach1' }, // → 皮奥利私信（消息51）
            { text: "和教练沟通，承诺冬窗会根据他的想法选人。", effects: {}, winterSlot: 1, deliverMail: 'pioliCoach2' }, // → 皮奥利私信（消息52）
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
            { text: "拨通电话，询问他愿不愿意回来。", effects: {}, nextEvent: 'instruction', winterReturn: 100, winterReturnIntent: 100 },
            { text: "等待他出现在转会市场上，通过球员经纪人联系。", effects: {}, winterReturn: 1000, winterReturnIntent: 40 },
            { text: "放弃这个想法，靠现有阵容一样能赢。", effects: { player: 1, trust: 1 } } // winterReturnIntent 不设 → 默认 0
        ]
    },
    instruction: {
        title: "指示",
        mainline: true,
        description: () => gameStats.wonScudetto1
            ? "电话那头沉默了几秒，兹拉坦说，我会带领你们拿到更多的冠军。"
            : "电话那头沉默了几秒，他十分笃定地说：“你们签下兹拉坦，就已经具备了获得意甲冠军的一切了！”",
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
    newsLeao: {
        title: "国米？米兰？",
        newsStyle: true,
        source: "Fanpage.it",
        content: "莱奥坦言，在2019年夏天，他其实已经非常接近加盟AC米兰的同城死敌国际米兰了。里尔的体育总监路易斯·坎波斯（Luís Campos）甚至已经告诉他：“拉法，我们要把你卖给国米了。”莱奥原本有些犹豫。\n结果两周后，事情发生了戏剧性的逆转。坎波斯告诉他，米兰开出了一份报价，并且有人想直接和他对话。\n莱奥回忆道：“他递给我一部手机，那不仅仅是一通普通电话，而是一通视频电话。屏幕里出现了保罗·马尔蒂尼。马尔蒂尼对我说：‘你必须来（米兰），我们已经准备好签下你了。’ 我从他身上感受到了非常棒的能量。看到他的那一刻，我根本无法说‘不’，我立刻回答：‘我接受！’”",
        options: [
            { text: "继续", effects: {} }
        ]
    },
    newsIbraRenewal: {
        title: "伊布的续约谈判",
        newsStyle: true,
        source: "米兰新闻网",
        content: "据报道，伊布与米兰的续约谈判已进入细节阶段。自2020年1月回归后，伊布在这几个月里证明了自己在这个级别依然能起决定性作用，在场上赢得了留队资格。因此红黑俱乐部决定加强与经纪人拉伊奥拉的接触。据天空体育称，瑞典人的签字预计将在十天内完成，伊布将赚取约700万欧元净薪。",
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
        description: "这名中场不知道你对他最终的报价是否满意，但当他和你再次见面时，他提出想要八号作为自己的号码。那是你曾经的队友，那位‘中场绞肉机’留下的，他是否配得上这个数字？你选择：",
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
    // ===== 第三赛季·欧洲超级联赛（Ⅰ R10 → Ⅱ R14 →「强烈反对/你什么冠军」R16 分支结局）=====
    esl1: {
        title: "欧洲超级联赛Ⅰ",
        mainline: true,
        description: "A22公司牵头重新策划了‘欧洲超级联赛’这个概念，‘欧超’将邀请十二家欧洲豪门俱乐部，加上浮动名额，最终组成一共二十只队伍的超级联赛。欧超承诺创始俱乐部享有永久的参赛资格，以此带来额外的电视转播和赞助收入，管理层对此很感兴趣，你选择：",
        options: [
            { text: "赞同加入欧超，欧冠收益浮动太大。", effects: { trust: 3, fans: -5 }, eslResult: 'oppose1' },
            { text: "拒绝加入欧超，足球联赛应该有升降机制。", effects: { trust: -5, fans: 3 }, eslResult: 'whatTitle' },
            { text: "保持观望，看看其他俱乐部怎么说。", effects: { trust: -3 }, eslWait: true }
        ]
    },
    esl2: {
        title: "欧洲超级联赛Ⅱ",
        mainline: true,
        description: "欧超的组织者发来了诱人的条件，AC米兰、国际米兰、尤文图斯被视作意大利联赛中仅有的符合资格的创始俱乐部。一旦欧超成立，这三只球队将从欧超的强强对话中获取巨大收益。尤文图斯已经确定加入，国际米兰还在观望。你选择：",
        options: [
            { text: "赞同加入欧超，给钱谁不想要。", effects: { trust: 3, fans: -5 }, eslResult: 'oppose1' },
            { text: "拒绝加入欧超，欧超成立后意甲的含金量将大幅度下降。", effects: { trust: -3 }, eslResult: 'oppose2' },
            { text: "询问国际米兰的意见。", effects: { trust: -3 }, eslResult: 'oppose3' }
        ]
    },
    eslOppose1: {
        title: "强烈反对！",
        mainline: true,
        description: "你和管理层都支持这个重组计划，它打破了欧足联的垄断。但‘欧超’计划一经提出，立刻遭到了球迷的反对。欧足联警告称，加入超级联赛的俱乐部将会被永久禁止参加欧足联举办的比赛，加入超级联赛的球员也将禁止代表国家队出战。\n面对这样的负面影响，米兰在加入‘欧超’后，又和国际米兰一起快速地退出了这个计划。",
        options: [ { text: "了解", effects: {} } ]
    },
    eslOppose2: {
        title: "强烈反对！",
        mainline: true,
        description: "你的意见无法阻止管理层，但‘欧超’计划一经提出，立刻遭到了球迷的反对。欧足联警告称，加入超级联赛的俱乐部将会被永久禁止参加欧足联举办的比赛，加入超级联赛的球员也将禁止代表国家队出战。\n面对这样的负面影响，米兰在加入‘欧超’后，又和国际米兰一起快速地退出了这个计划。",
        options: [ { text: "了解", effects: {} } ]
    },
    eslOppose3: {
        title: "强烈反对！",
        mainline: true,
        description: "国际米兰也想一起赚笔大钱，但‘欧超’计划一经提出，立刻遭到了球迷的反对。欧足联警告称，加入超级联赛的俱乐部将会被永久禁止参加欧足联举办的比赛，加入超级联赛的球员也将禁止代表国家队出战。\n面对这样的负面影响，米兰在加入‘欧超’后，又和国际米兰一起快速地退出了这个计划。",
        options: [ { text: "了解", effects: {} } ]
    },
    eslWhatTitle: {
        title: "你什么冠军？",
        mainline: true,
        description: "‘欧超’的计划刚一提出，立刻遭到了球迷的谩骂，不少球迷直言，这是一些球队从未或很难取得欧冠冠军，才出此下策另外办一个联赛。欧足联警告称，加入超级联赛的俱乐部将会被永久禁止参加欧足联举办的比赛，加入超级联赛的球员也将禁止代表国家队出战。\n面对这样的负面影响，米兰在加入‘欧超’后，又和国际米兰一起快速地退出了这个计划。",
        options: [ { text: "了解", effects: {} } ]
    },
    sameName: {
        title: "同一个姓氏",
        mainline: true,
        description: "青年队里有一个技术细腻的球员，青训教练曾经和你提到，他认为这个孩子有征战意甲球队的实力了。有些人看好他的天赋，你也听到有人在私下议论：因为他和你共用一个姓氏。\n将他提上一线队，将会受到媒体的巨大关注，你选择：",
        options: [
            { text: "提上一线队，你清楚他想为米兰踢球。", effects: {}, acquire08: true },
            { text: "将他作为米兰的球员租借到意甲其他俱乐部。", effects: {} },
            { text: "让球探团队来决定。", effects: {}, acquire08Chance: 0.5 }
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
        title: "一去不返的纸飞机",
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
        description: "那名左后卫的竞技状态迟迟没有好转，他似乎对自己的能力有所怀疑，也许他不适应意甲赛场？你想起最开始劝说他来米兰的时候，正是用‘我会帮助你’这句话才最终使他下定决心，你选择：",
        options: [
            { text: "没有什么是加练解决不了的，给他开后卫防守小灶。", effects: { player: 1 }, trust01: 1 },
            { text: "回看战术录像，看看自己能不能提出一些建议。", effects: { player: 1 }, trust01: 1 },
            { text: "训练刻苦就足够了，相信教练的安排。", effects: { player: -1 } }
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
            { text: "尽力在转会窗中优先买断这名球员。", effects: {}, disc21: 500 },
            { text: "以球队现在的状况，还得降价才能买得起。", effects: {}, disc21: 700 },
            { text: "自己无法左右球队的夏窗策略。", effects: {}, disc21: 0 }
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
                content: "红鸟创始人兼管理合伙人格里·卡尔迪纳莱（Gerry Cardinale）表示：“我们非常荣幸能成为AC米兰辉煌历史的一部分。俱乐部刚刚重回意甲巅峰，在这个时刻能够携手书写俱乐部的下一个篇章，并放眼未来的欧洲和世界赛场，让我们感到无比兴奋。我衷心感谢戈登·辛格（Gordon Singer）及整个埃利奥特团队在过去四年中所做的卓越工作。\n红鸟的投资哲学和在体育界的过往战绩已经证明：足球俱乐部完全可以在赛场上取得成功的同时，保持健康、可持续的财务状况。”"
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
            { text: "主动询问红鸟资本。", effects: { trust: -5 }, suspicion: 1, triggerHc2: true },
            { text: "向前东家埃利奥特询问续约情况。", effects: { trust: -7 } },
            { text: "接受媒体采访，向管理层施压。", effects: { trust: -2 }, suspicion: 1, nextEvent: 'newsLastMoment' }
        ]
    },
    newsLastMoment: {
        title: "最后一刻？",
        newsStyle: true,
        source: "《米兰体育报》",
        content: "保罗·马尔蒂尼接受采访时坦言：“......我和马萨拉的合同即将到期，至今没有任何人来找我们谈过。我认为这是一种缺乏尊重的表现，无论是对我们的工作，还是对我们所代表的米兰。\n如果米兰的所有者只想维持现有的财务平衡，那他们不需要我。\n像米兰这样的俱乐部，不应该只满足于在意甲夺冠，我们必须去欧洲赛场竞争。如果新股东没有一个买入顶级球员、重返欧冠巅峰的宏大计划，那么我们的理念就是不一致的。”",
        options: [{ text: "了解", effects: {} }]
    },
    hesitantContract2: {
        title: "犹豫不决的合同Ⅱ",
        mainline: true,
        description: "红鸟资本在你的合同过期的前一周才将新合同发送给你，在粗略的阅读后，你发现管理层提出的预算远低于你的计划，给你和马萨拉的自主权更是进一步被削减，你选择：",
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
            { text: "支持管理层以他们的想法来操作转会。", effects: {}, winterNoBudget: true }
        ]
    },
    winterNoBudgetCard: {
        title: "冬窗无预算",
        mainline: true,
        description: "管理层并没有在这个转会窗给你任何预算。",
        options: [{ text: "了解", effects: {} }]
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
        description: "和关系良好的媒体交谈使你听到了一点关于球员的风声，有些球员哪怕周日要踢比赛，周六晚上也会选择玩乐一晚。有一位媒体给你发送了照片，你十分信任的那名左后卫也在其中，你选择：",
        options: [
            { text: "私下聊天，希望他专注自己的生活。", effects: { player: 2 }, trust01: 1 },
            { text: "严肃批评，禁止他在比赛期放纵自己。", effects: { player: 2 }, trust01: 1 },
            { text: "视而不见，这和球员的个性有关。", effects: { player: -2 } }
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
        description: "三号在你退役时被米兰封存，以示俱乐部对你的尊重，除非你本人发话，否则他们绝对不会拿出这个号码给其他的球员。你所看好的那名左后卫也从来没开口要过这个号码，但你觉得，如果有一天这名你亲手带来圣西罗的球员成为米兰的队长，这个号码在他身上会比封存在博物馆里更有意义，他还太年轻，所以这个念头只是在你脑海中一闪而过。",
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
    },
    // God Bye（第五赛季第36轮，需 06 伊布在队）：伊布退役仪式；选项2 → 立刻弹出「要求」
    godBye: {
        title: "God Bye",
        mainline: true,
        description: "伊布将于明天的比赛结束后退役，他选择在圣西罗举办一个小的退役仪式，看台上为他竖起了标语。你回忆起他受伤无法出战时坐在场边严肃的脸，在获得意甲冠军后更衣室发表的演讲，你选择：",
        options: [
            { text: "给他私发消息，感谢他回到米兰。", effects: {} },
            { text: "询问他对于米兰还有什么愿望。", effects: {}, nextEvent: 'requirement' },
            { text: "给他一个拥抱。", effects: {} }
        ]
    },
    // 要求（God Bye 选项2 触发）：便利贴文案按欧冠经历分差分——从未夺欧冠 / 上赛季(第四赛季)夺欧冠蝉联 / 其他情况(任期内夺过但非上赛季)
    requirement: {
        title: "要求",
        mainline: true,
        description: () => {
            let note;
            if (gameStats.uclTitleCount === 0) note = '米兰将会在这个赛季获得欧冠冠军。';
            else if (gameStats.s4WonUcl) note = '米兰将会在这个赛季蝉联欧冠冠军。';
            else note = '米兰将会在这个赛季获得庇护，得到所有冠军';
            return `兹拉坦拿了一支笔，在便利贴上写下一行字，将它贴在了更衣室的柜子上。上面写着‘${note}’`;
        },
        options: [{ text: "了解", effects: {} }]
    }
});
