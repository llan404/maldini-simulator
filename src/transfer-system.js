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
        desc: '35岁，昔日的世界级球星，拿着高额薪水被俱乐部无情抛弃，他的脚法和经验都还在，关键球的处理仍然不失水准，但他对任何俱乐部的热情都已经远去，签下他意味着承担高额的薪资。',
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
    },
    // 24 · 美国边锋（原型：克里斯蒂安·普利希奇）
    {
        id: 'winger_usa', name: '美国边锋', tier: 2, tag: '即战力', tagColor: 'ready',
        desc: '25岁，速度与内切俱佳的美国边锋，在前东家常年得不到稳定的首发位置。签下他还意味着叩开北美市场的大门，他在当地很有号召力。',
        effects: { player: 5, fans: 4, media: 4 }, cost: 4200, signIntent: 45
    },
    // 25 · 比利时中场（原型：亚历克西斯·萨勒马克尔斯）
    {
        id: 'cm_bel', name: '比利时中场', tier: 2, tag: '潜力股', tagColor: 'potential',
        desc: '21岁，比利时人，性格好，从不惜力的工兵型球员，可以从对方禁区一路回追到自家底线。他的技术算不上出众，身体素质也略显不足，但对俱乐部相当忠诚。',
        effects: { player: 3, fans: 3 }, cost: 800, signIntent: 55
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
// 老将（03吉鲁/06伊布/10铁腰/16养老前锋/19克亚尔）初始 5，其余青年球员初始 1；每赛季自然 +1，上限 10
const OLD_PLAYER_IDS = ['striker_fr', 'maestro', 'dm_cro', 'striker_vet', 'cb_den'];
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
    const labels = { player: '球员状态', fans: '球迷满意度', trust: '董事会信任度', media: '媒体声望' };
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
                const labels = { player: '球员状态', fans: '球迷满意度', trust: '董事会信任度' };
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
// ===== negotiationScripts（续约谈判文案）位于 negotiationContent.js（须先于运行时系统引入）=====

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

    // 当前剩余预算：仅第四赛季两位（多纳鲁马/恰尔汗奥卢）的谈判显示（与选项「预算 ±Nw」同单位，便于对照；承诺预算续约成功后才扣，此处不预减）
    document.getElementById('neg-budget').innerHTML =
        ['donnarumma', 'calhanoglu'].includes(negState.key)
            ? `<span class="neg-budget-label">当前剩余预算</span><span class="neg-budget-val">${gameStats.budget}w</span>` : '';
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
    document.getElementById('neg-budget').textContent = ''; // 结算页不再显示剩余预算
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
// ===== donnaNego（多纳鲁马专属谈判文案）位于 negotiationContent.js（须先于运行时系统引入）=====
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

    // 当前剩余预算（与选项徽章同单位；谈判承诺预算成功后才扣，此处不预减）
    document.getElementById('neg-budget').innerHTML =
        `<span class="neg-budget-label">当前剩余预算</span><span class="neg-budget-val">${gameStats.budget}w</span>`;
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
    document.getElementById('neg-budget').textContent = ''; // 结算页不再显示剩余预算
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

