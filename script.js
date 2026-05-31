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
    lastScore: '0-0',
    consecutiveLosses: 0,
    southStandEventUsed: false,
    betKingEventUsed: false,
    rebateEventCount: 0,
    transferEventUsed: false,
    carCrashEventUsed: false,
    warningEventShown: false
};

// 事件数据
const events = {
    1: {
        description: "在每周的周例会上，你向管理层进行汇报的风格是：",
        options: [
            { text: "保守", effects: { trust: 5, media: -5 } },
            { text: "激进", effects: { trust: -5, media: 5 } }
        ]
    },
    2: {
        description: "向球队董事会申请预算时，你的计划是：",
        options: [
            { text: "谨慎", effects: { trust: 10, player: -5 } },
            { text: "大胆", effects: { trust: -10, budget: 500 } }
        ]
    },
    3: {
        description: "进行常规新闻发布会时，你的风格是：",
        options: [
            { text: "标准", effects: { trust: 5 } },
            { text: "主动", effects: { media: 5, trust: -5 } },
            { text: "指责", effects: { media: 10, trust: -10 } }
        ]
    },
    4: {
        description: "媒体邀请你参加赛后的深度采访时，你的选择是：",
        options: [
            { text: "参加", effects: { media: 2, trust: 2 } },
            { text: "拒绝", effects: { media: -2, trust: -2 } }
        ]
    },
    5: {
        description: "赛前最后一次集合时，你需要对球员做出一些鼓励，你的选择是：",
        options: [
            { text: "鼓励全队", effects: { player: 5, media: 2 } },
            { text: "鼓励关键球员", effects: { player: 2 } }
        ]
    },
    6: {
        description: "你需要对球队近一段时间的表现做出内部总结时：",
        options: [
            { text: "鼓励", effects: { player: 5, trust: -3 } },
            { text: "批评", effects: { player: -5, trust: 3, fans: 5 } }
        ]
    },
    7: {
        description: "在下一场比赛来临之前，你决定对阵容提出一些意见：",
        options: [
            { text: "轮换", effects: { player: 3, fans: -5 } },
            { text: "固定主力", effects: { player: 3, fans: 5 } }
        ]
    },
    8: {
        description: "转会窗来临前，你对球员合同谈判态度是：",
        options: [
            { text: "宽松", effects: { player: 5, trust: -10 } },
            { text: "强硬", effects: { player: -5, trust: 5, media: 5 } }
        ]
    }
};

const randomEvents = {
    1: {
        title: "舆论风波",
        description: "某球员的状态持续下滑，你知道这是因为他和教练爆发了冲突。媒体却觉得这是因为更衣室里有不可调和的矛盾，球迷认为是这名球员居功自傲，因此在场上不愿意跑动，你选择：",
        options: [
            { text: "向媒体解释事情的原委，承诺会尽全力充当球员和教练之间的润滑剂。", effects: { media: 3 } },
            { text: "向球迷解释这个赛季的战术体系，希望他们多给球员一些时间。", effects: { fans: 3 } },
            { text: "缄口不言，力挺教练，教练这么做一定有他自己的考虑。", effects: { player: 3 } }
        ]
    },
    2: {
        title: "南看台的问候",
        description: "对于近日球队的表现，南看台很不满意，作为一只球队的死忠球迷，付出了门票和时间，居然遭受这样的对待！他们无法忍受球队继续输球了，如果让AC米兰继续这样输下去，难道要连输五场吗？南看台要求更换教练！你选择：",
        options: [
            { text: "在媒体面前表达对胜利的决心，并声明现在不是换教练的好时机。", effects: { media: 5 } },
            { text: "跟南看台爆了！你以为球队是你家开的？（结局）", effects: { fans: -100, player: 20 } },
            { text: "遵循南看台的意见，和管理层商量换教练的事。", effects: { fans: 5 } }
        ]
    },
    3: {
        title: "赌王传奇",
        description: "队内的核心成员竟然被发现有赌博的习惯！据你所知，他几乎会下注自己参与的每一场比赛，在媒体、管理层和教练都不知道这件事之前，你决定：",
        options: [
            { text: "将此事报告给管理层，希望能够尽早将此球员转会。", effects: { trust: 5, player: -5 } },
            { text: "和此球员私下聊聊，让他亲自告诉你这件事是否属实。", effects: { player: 5 } },
            { text: "狗改不了吃屎，你决定将他投入到转会市场上。", effects: { budget: 1000 } }
        ]
    },
    4: {
        title: "更衣室领袖",
        description: "米兰的队长最近在训练中的情绪越来越差，你发现他对教练组安排的轮换制度极其不满。在一次训练赛结束后，他甚至当着所有人的面摔了球衣。媒体已经得到了内鬼的小道消息，他们认为更衣室内部即将爆炸，你选择：",
        options: [
            { text: "私下安抚队长，承诺会和教练组沟通他的出场时间。", effects: { player: 5, trust: -5 } },
            { text: "支持教练的决定，没有任何球员可以凌驾于战术体系之上。", effects: { media: -5 } },
            { text: "让队长上替补席，谁闹情绪谁就别上场。", effects: { player: 5, fans: -5 } }
        ]
    },
    5: {
        title: "回扣风波",
        description: "突发新闻！你被内幕人士指责在转会市场上搅弄风云，为自己疯狂敛财。他们指出你故意买来一些根本不值昂贵身价的球员，然后从他们的经纪人那里收取回扣。对此，你的解释是：",
        options: [
            { text: "转会市场五百万的预算，你们要三个前锋五个后卫，我拿点钱怎么了？", effects: { budget: 1000, trust: -20 } },
            { text: "解释这么点回扣不够自己拿的。", effects: { fans: -10 } },
            { text: "向媒体打听所谓的内幕人士究竟是谁。", effects: { media: -10 } }
        ]
    },
    6: {
        title: "青训天才",
        description: "青年队最近冒出来一个极具潜力的球员，在青年队中大杀四方，甚至已经有球迷开始拿他和传奇名宿比较。但问题是，他最近越来越不拿教练当回事了，训练迟到、拒绝加练，甚至还在采访里说“一线队的防守也就那样”，你选择：",
        options: [
            { text: "直接提拔进一线队，让他知道职业足球到底是什么强度。", effects: { fans: 5, player: -5 } },
            { text: "让青年队教练狠狠敲打他。", effects: { trust: 5 } },
            { text: "既然这么狂，那就租借出去吃点苦头。", effects: { budget: 500 } }
        ]
    },
    7: {
        title: "经纪人来访",
        description: "某主力球员的经纪人突然联系你，他认为自己的客户配得上更高的工资和更多的战术地位。如果球队不能满足要求，他不排除在下个转会窗推动转会。更麻烦的是，这件事已经被媒体知道了，你选择：",
        options: [
            { text: "尝试提前续约，稳定更衣室情绪。", effects: { budget: -1000, player: 10 } },
            { text: "我们没有更多的预算，很抱歉。", effects: { player: -10 } },
            { text: "答应他的要求，如果留不住人，至少也要留住一笔钱。", effects: { budget: 500, media: -5 } }
        ]
    },
    8: {
        title: "名宿声援",
        description: "球队的名宿在节目中力挺你对球队的付出，称你为‘真正的米兰人’。管理层对此颇有微词，他们认为球队不应该听名宿的话，毕竟这是一家现代化的球队。",
        options: [
            { text: "我管不了所有名宿的嘴。", effects: { trust: -10 } },
            { text: "收集一些赞美管理层的新闻。", effects: { trust: 10 } },
            { text: "在节目上表示自己要学的还有很多。", effects: { media: 5 } }
        ]
    },
    9: {
        title: "裁判的哨子",
        description: "球队连续两场比赛没有在某位知名裁判手中得到公正的判罚，球迷认为无论如何不能让他继续当米兰比赛的裁判了，你选择：",
        options: [
            { text: "保持克制，相信裁判会给出合理的解释。", effects: { media: 5, fans: -5 } },
            { text: "在媒体采访时对裁判开炮。", effects: { fans: 5, budget: -50 } },
            { text: "拒绝讨论裁判，希望球迷更加关注球员的表现。", effects: { fans: -5, player: 5 } },
            { text: "向你熟悉的媒体求助，究竟哪里惹着这位裁判了？", effects: { fans: 5, player: 5 }, condition: () => gameStats.media > 80 }
        ]
    },
    10: {
        title: "天价转会",
        description: "利雅得新月报价米兰的头号射手，他们开出了2000w欧的价格，管理层认为这是不可多得的好买卖，而球迷则希望你能尽力留下他，你选择：",
        options: [
            { text: "公开表示球队会尽全力留下核心球员。", effects: { fans: 5, budget: -1000 } },
            { text: "向媒体解释这名球员不属于米兰考虑出售的球员之一。", effects: { trust: -5, player: 5 } },
            { text: "提前联系替代者，并询问球员团队的意向。", effects: { fans: -10, player: -10, budget: 2000 } }
        ]
    },
    11: {
        title: "豪车事故",
        description: "球队的一位年轻球员凌晨开着新买的跑车撞上了路边护栏，幸好人没事，但照片已经传疯了。球迷们认为这名球员可能是酒驾或毒驾，赞助商问你球员发生车祸的时候怎么还穿着球衣呢？这多破坏我们品牌的形象。你选择：",
        options: [
            { text: "让球员公开道歉，并承担全部责任。", effects: { media: 10, player: -5 } },
            { text: "内部低调处理，尽量别再扩大影响。", effects: { trust: -5, budget: -500 } },
            { text: "直接罚款停训。", effects: { fans: 10, player: -5 } }
        ]
    }
};

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
    speculator: {
        id: 5,
        title: "喉舌",
        text: "你精准的表达和独特的风格使你在媒体中声望颇高，他们相比于采访球员，更愿意采访你。你的发言代表了球队的态度，媒体曲解你、信任你，最后无法离开你。花边新闻和更衣室内幕像色彩鲜艳的广告一样出现在体育报上，你的选择将让这支球队永远不缺少话题。"
    },
    blameSeeker: {
        id: 6,
        title: "归因者",
        text: "南看台对你的态度不影响你在球员时期获得的荣誉，但却影响你在当总监时的名誉。输球的时候，球迷骂你，赢球的时候，他们问你为什么没赢更多。在这赛季的最后一场比赛，南看台挂出了要求你滚蛋的横幅。和你退役时一样，你知道这块横幅的背面会被他们用来欢迎无论是谁的下一位继任者。"
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
    if (gameStats.media > 80 && gameStats.trust < 30) return 'speculator';
    if (gameStats.fans < 30) return 'blameSeeker';
    return null;
}

const teams = [
    { name: 'Juventus/尤文图斯', category: 'strong' },
    { name: 'Napoli/那不勒斯', category: 'strong' },
    { name: 'Inter Milan/国际米兰', category: 'strong' },
    { name: 'Roma/罗马', category: 'strong' },
    { name: 'Lazio/拉齐奥', category: 'strong' },
    { name: 'Atalanta/亚特兰大', category: 'mid' },
    { name: 'Fiorentina/佛罗伦萨', category: 'mid' },
    { name: 'Torino/都灵', category: 'mid' },
    { name: 'Sampdoria/桑普多利亚', category: 'mid' },
    { name: 'Sassuolo/萨索洛', category: 'mid' },
    { name: 'Genoa/热那亚', category: 'mid' },
    { name: 'Bologna/博洛尼亚', category: 'low' },
    { name: 'Cagliari/卡利亚里', category: 'low' },
    { name: 'Udinese/乌迪内斯', category: 'low' },
    { name: 'SPAL/斯帕尔', category: 'low' },
    { name: 'Parma/帕尔马', category: 'low' },
    { name: 'Frosinone/弗罗西诺内', category: 'low' },
    { name: 'Empoli/恩波利', category: 'low' },
    { name: 'Chievo Verona/切沃', category: 'low' }
];

let currentRandomEvents = [];
let randomEventIndex = 0;

const categoryStrength = {
    strong: 0.95,
    mid: 0.75,
    low: 0.55
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
    const statusBonus = (gameStats.player - 50) / 100;
    let difficultyBonus = 0;
    if (gameStats.difficulty === 'easy') {
        difficultyBonus = 0.08;
    } else if (gameStats.difficulty === 'hard') {
        difficultyBonus = -0.08;
    }
    if (category === 'strong') {
        return Math.min(0.95, Math.max(0.05, 0.4 + statusBonus + difficultyBonus));
    }
    if (category === 'mid') {
        return Math.min(0.95, Math.max(0.05, 0.6 + statusBonus + difficultyBonus));
    }
    return Math.min(0.95, Math.max(0.05, 0.8 + statusBonus + difficultyBonus));
}

function updateScoreboard() {
    document.getElementById('points').textContent = gameStats.points;
    document.getElementById('ranking').textContent = gameStats.ranking;
    document.getElementById('round').textContent = Number.isFinite(gameStats.round) ? gameStats.round : 0;
    document.getElementById('last-score').textContent = gameStats.lastScore;
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
        if (gameStats.media > 80) {
            updateStat('fans', -10);
        } else {
            updateStat('fans', -5);
        }
    }

    const ourTeam = getTeamByName('AC Milan');
    ourTeam.points = gameStats.points;
    const lastScoreText = `AC Milan ${score} - ${opponent.name}`;
    gameStats.lastScore = lastScoreText;
    simulateOtherMatches(opponentName);
    updateLeagueRanking();
    updateScoreboard();
    
    // 检查结局（比赛后统一判断触发哪一个结局）
    const endingKeyAfterMatch = getTriggeredEndingKey();
    if (endingKeyAfterMatch) {
        showEnding(endingKeyAfterMatch);
        return null; // 结局触发，不返回比赛结果
    }
    
    return { result, opponent, score };
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

// 关闭弹窗事件
closeEventBtn.addEventListener('click', function() {
    eventModal.style.display = 'none';
    difficultySelection.classList.remove('hidden');
});

// 选择难度
selectDifficultyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const difficulty = this.getAttribute('data-difficulty');
        difficultySelection.classList.add('hidden');
        mainInterface.classList.remove('hidden');
        // 初始化游戏状态
        initializeGame(difficulty);
    });
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
    document.getElementById('ending-title').textContent = ending.title;
    document.getElementById('ending-text').textContent = ending.text;
    document.getElementById('ending-modal').classList.remove('hidden');
}

// 更新预算
function updateBudget(delta) {
    gameStats.budget += delta;
    document.getElementById('budget').textContent = gameStats.budget + '万欧元';
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
    setTimeout(() => change.remove(), 1200);
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
    } else if (value > 90) {
        bar.classList.add('high');
    } else {
        bar.classList.add('medium');
    }
}

// 初始化游戏
function initializeGame(difficulty) {
    // 初始化数值
    gameStats = { trust: 50, media: 50, fans: 50, player: 50, budget: 1000, points: 0, ranking: 0, round: 0, lastScore: '0-0', consecutiveLosses: 0, southStandEventUsed: false, betKingEventUsed: false, rebateEventCount: 0, transferEventUsed: false, carCrashEventUsed: false, warningEventShown: false, difficulty };
    lastOpponentName = '';
    initializeLeague();
    updateProgressBar('trust-bar', 50);
    updateProgressBar('media-bar', 50);
    updateProgressBar('fans-bar', 50);
    updateProgressBar('player-bar', 50);
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
    const eventIds = Object.keys(randomEvents).filter(id => {
        if (parseInt(id) === 3 && gameStats.betKingEventUsed) {
            return false;
        }
        if (parseInt(id) === 5 && gameStats.rebateEventCount >= 2) {
            return false;
        }
        if (parseInt(id) === 10 && gameStats.transferEventUsed) {
            return false;
        }
        if (parseInt(id) === 11 && gameStats.carCrashEventUsed) {
            return false;
        }
        return true;
    });
    const selectedEvents = [];

    // 连续失利后的特殊事件优先触发
    if (gameStats.consecutiveLosses >= 3 && !gameStats.southStandEventUsed) {
        selectedEvents.push(2);
        gameStats.southStandEventUsed = true;
        return selectedEvents;
    }

    // 每次比赛后随机触发 0 或 1 个事件
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

// 显示随机事件
const warningEvent = {
    type: '预警事件',
    title: '针锋相对！',
    description: '媒体的高曝光让你们的比赛备受关注，现在，无论是赢球还是输球都将给球迷满意度带来更大的变化。',
    note: '（赢球会增加10点球迷满意度，输球和平局会相应扣除10和5点满意度。）'
};

function showRandomEvents() {
    randomEventModal.classList.remove('warning');
    currentRandomEvents = selectRandomEvents();
    randomEventIndex = 0;
    showNextRandomEvent();
}

function showWarningEvent() {
    if (gameStats.warningEventShown) {
        showRandomEvents();
        return;
    }
    gameStats.warningEventShown = true;
    document.getElementById('random-event-title').textContent = warningEvent.title;
    document.getElementById('random-event-description').innerHTML = `${warningEvent.description}<span class="warning-note">${warningEvent.note}</span>`;
    const optionsContainer = document.getElementById('random-event-options');
    optionsContainer.innerHTML = '';
    const button = document.createElement('button');
    button.textContent = '确认';
    button.className = 'random-event-option';
    button.addEventListener('click', () => {
        randomEventModal.classList.remove('warning');
        randomEventModal.classList.add('hidden');
        showRandomEvents();
    });
    optionsContainer.appendChild(button);
    randomEventModal.classList.add('warning');
    randomEventModal.classList.remove('hidden');
}

// 显示下一个随机事件
function showNextRandomEvent() {
    if (randomEventIndex >= currentRandomEvents.length) {
        // 所有随机事件处理完毕
        randomEventModal.classList.add('hidden');
        resetAfterMatch();
        return;
    }
    
    const eventId = currentRandomEvents[randomEventIndex];
    const event = randomEvents[eventId];
    
    document.getElementById('random-event-title').textContent = event.title;
    document.getElementById('random-event-description').textContent = event.description;
    
    const optionsContainer = document.getElementById('random-event-options');
    optionsContainer.innerHTML = '';
    
    let visibleOptionIndex = 0;
    event.options.forEach((option) => {
        if (option.condition && !option.condition()) {
            return;
        }
        visibleOptionIndex++;
        const button = document.createElement('button');
        button.textContent = `${visibleOptionIndex}. ${option.text}`;
        button.className = 'random-event-option';
        button.addEventListener('click', () => {
            // 应用效果
            for (const [stat, delta] of Object.entries(option.effects)) {
                updateStat(stat, delta);
            }
            if (eventId === 3) {
                gameStats.betKingEventUsed = true;
            }
            if (eventId === 5) {
                gameStats.rebateEventCount += 1;
            }
            randomEventIndex++;
            showNextRandomEvent();
        });
        optionsContainer.appendChild(button);
    });
    
    randomEventModal.classList.remove('hidden');
}

function showMatchResult(matchResult) {
    const teamName = matchResult.opponent.name;
    const score = matchResult.score;
    if (matchResult.result === 'win') {
        matchResultTitle.textContent = '比赛结果';
        matchResultText.textContent = `AC Milan以${score}战胜了${teamName}！`;
    } else if (matchResult.result === 'draw') {
        matchResultTitle.textContent = '比赛结果';
        matchResultText.textContent = `AC Milan与${teamName} ${score}打成平手！`;
    } else {
        matchResultTitle.textContent = '比赛结果';
        matchResultText.textContent = `AC Milan以${score}不敌${teamName}！`;
    }
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

closeResultBtn.addEventListener('click', function() {
    matchResultModal.classList.add('hidden');
    if (gameStats.media > 80 && !gameStats.warningEventShown) {
        showWarningEvent();
    } else {
        showRandomEvents();
    }
});

// 重新开始游戏
document.getElementById('restart-game').addEventListener('click', function() {
    document.getElementById('ending-modal').classList.add('hidden');
    // 重置游戏状态
    gameStats = {
        trust: 50,
        media: 50,
        fans: 50,
        player: 50,
        points: 0,
        ranking: 1,
        round: 0,
        lastScore: '0-0',
        budget: 10000000,
        lastOpponent: null,
        consecutiveLosses: 0,
        southStandEventUsed: false,
        betKingEventUsed: false,
        rebateEventCount: 0,
        transferEventUsed: false,
        carCrashEventUsed: false,
        warningEventShown: false
    };
    decisionPoints = 0;
    // 隐藏主界面，显示初始弹窗
    mainInterface.classList.add('hidden');
    eventModal.style.display = 'flex';
});

// 开始比赛
startMatchBtn.addEventListener('click', function() {
    startMatchBtn.disabled = true; // 立即禁用按钮
    const opponentName = drawOpponent();
    const matchResult = playRound(opponentName);
    gameStats.round = Math.min(38, gameStats.round + 1);
    updateScoreboard();
    if (matchResult !== null) {
        showMatchResult(matchResult);
        eventOptions.classList.add('hidden');
    }
    if (gameStats.round >= 38 && matchResult !== null) {
        const seasonEndingKey = getSeasonEndingKey();
        if (seasonEndingKey) {
            showEnding(seasonEndingKey);
        } else {
            alert('赛季结算：38轮已完成，进入赛季总结。');
        }
        eventBtns.forEach(btn => {
            btn.disabled = true;
            btn.style.backgroundColor = '#ccc';
        });
        startMatchBtn.disabled = true;
    }
});