// 奇门遁甲排盘系统 - 时家奇门 拆补法
// Qimen Dunjia Chart System - Hourly Qimen with Chai Bu Method

// ==================== 基础数据 ====================

// 三奇六仪 (Three Odds and Six Instruments)
const SAN_QI_LIU_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

// 九星旋转顺序 (Nine Stars rotation sequence, 8 outer stars; 天禽 fixed at 中宫)
const JIU_XING = ['天蓬', '天任', '天冲', '天辅', '天英', '天芮', '天柱', '天心'];

// 九星本宫 (base palace mapping by palace 1-9, index = palace-1)
// 坎1天蓬, 坤2天芮, 震3天冲, 巽4天辅, 中5天禽, 乾6天心, 兑7天柱, 艮8天任, 离9天英
const PALACE_STAR = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];

// 八门 (Eight Gates) - 中宫无门
const BA_MEN = ['休门', '死门', '伤门', '杜门', '', '开门', '惊门', '生门', '景门'];

// 八神 (Eight Spirits) - 中宫无神
const BA_SHEN = ['值符', '腾蛇', '太阴', '六合', '', '白虎', '玄武', '九地', '九天'];

// 地盘宫位对应 (Palace to Stem mapping)
const GONG_WEI = {
    1: '坎宫',
    2: '坤宫',
    3: '震宫',
    4: '巽宫',
    5: '中宫',
    6: '乾宫',
    7: '兑宫',
    8: '艮宫',
    9: '离宫'
};

// 24节气对应阳遁/阴遁局数 (Solar Terms to Bureau mapping)
// 冬至到夏至前 - 阳遁, 夏至到冬至前 - 阴遁
const JIE_QI_TABLE = [
    { name: '冬至', startMonth: 12, startDay: 21, endMonth: 1, endDay: 5, type: '阳遁', ju: [1, 7, 4] },      // 一七四
    { name: '小寒', startMonth: 1, startDay: 5, endMonth: 1, endDay: 20, type: '阳遁', ju: [1, 7, 4] },
    { name: '大寒', startMonth: 1, startDay: 20, endMonth: 2, endDay: 4, type: '阳遁', ju: [2, 8, 5] },       // 二八五
    { name: '立春', startMonth: 2, startDay: 4, endMonth: 2, endDay: 19, type: '阳遁', ju: [2, 8, 5] },
    { name: '雨水', startMonth: 2, startDay: 19, endMonth: 3, endDay: 6, type: '阳遁', ju: [3, 9, 6] },       // 三九六
    { name: '惊蛰', startMonth: 3, startDay: 6, endMonth: 3, endDay: 21, type: '阳遁', ju: [3, 9, 6] },
    { name: '春分', startMonth: 3, startDay: 21, endMonth: 4, endDay: 5, type: '阳遁', ju: [4, 1, 7] },       // 四一七
    { name: '清明', startMonth: 4, startDay: 5, endMonth: 4, endDay: 20, type: '阳遁', ju: [4, 1, 7] },
    { name: '谷雨', startMonth: 4, startDay: 20, endMonth: 5, endDay: 6, type: '阳遁', ju: [5, 2, 8] },       // 五二八
    { name: '立夏', startMonth: 5, startDay: 6, endMonth: 5, endDay: 21, type: '阳遁', ju: [5, 2, 8] },
    { name: '小满', startMonth: 5, startDay: 21, endMonth: 6, endDay: 6, type: '阳遁', ju: [6, 3, 9] },       // 六三九
    { name: '芒种', startMonth: 6, startDay: 6, endMonth: 6, endDay: 21, type: '阳遁', ju: [6, 3, 9] },
    { name: '夏至', startMonth: 6, startDay: 21, endMonth: 7, endDay: 7, type: '阴遁', ju: [9, 3, 6] },       // 九三六
    { name: '小暑', startMonth: 7, startDay: 7, endMonth: 7, endDay: 23, type: '阴遁', ju: [9, 3, 6] },
    { name: '大暑', startMonth: 7, startDay: 23, endMonth: 8, endDay: 8, type: '阴遁', ju: [8, 2, 5] },       // 八二五
    { name: '立秋', startMonth: 8, startDay: 8, endMonth: 8, endDay: 23, type: '阴遁', ju: [8, 2, 5] },
    { name: '处暑', startMonth: 8, startDay: 23, endMonth: 9, endDay: 8, type: '阴遁', ju: [7, 1, 4] },       // 七一四
    { name: '白露', startMonth: 9, startDay: 8, endMonth: 9, endDay: 23, type: '阴遁', ju: [7, 1, 4] },
    { name: '秋分', startMonth: 9, startDay: 23, endMonth: 10, endDay: 8, type: '阴遁', ju: [6, 9, 3] },      // 六九三
    { name: '寒露', startMonth: 10, startDay: 8, endMonth: 10, endDay: 24, type: '阴遁', ju: [6, 9, 3] },
    { name: '霜降', startMonth: 10, startDay: 24, endMonth: 11, endDay: 7, type: '阴遁', ju: [5, 8, 2] },     // 五八二
    { name: '立冬', startMonth: 11, startDay: 7, endMonth: 11, endDay: 22, type: '阴遁', ju: [5, 8, 2] },
    { name: '小雪', startMonth: 11, startDay: 22, endMonth: 12, endDay: 7, type: '阴遁', ju: [4, 7, 1] },     // 四七一
    { name: '大雪', startMonth: 12, startDay: 7, endMonth: 12, endDay: 21, type: '阴遁', ju: [4, 7, 1] }
];

// ==================== 核心算法 ====================

/**
 * 根据日期和时间确定节气
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {object} 节气信息
 */
function getJieQi(month, day) {
    for (let i = 0; i < JIE_QI_TABLE.length; i++) {
        const jieqi = JIE_QI_TABLE[i];

        // 处理跨年情况
        if (jieqi.startMonth > jieqi.endMonth) {
            // 跨年：如冬至 12/21 - 1/5
            if (month === jieqi.startMonth && day >= jieqi.startDay) {
                return jieqi;
            }
            if (month === jieqi.endMonth && day < jieqi.endDay) {
                return jieqi;
            }
        } else {
            // 不跨年
            if (month === jieqi.startMonth && day >= jieqi.startDay && day < jieqi.endDay) {
                return jieqi;
            }
            if (month > jieqi.startMonth && month < jieqi.endMonth) {
                return jieqi;
            }
            if (month === jieqi.endMonth && day < jieqi.endDay) {
                return jieqi;
            }
        }
    }
    return JIE_QI_TABLE[0]; // 默认返回冬至
}

/**
 * 根据时辰和节气确定局数 (拆补法)
 * @param {string} dayGanZhi - 日干支
 * @param {number} hour - Hour (0-23)
 * @param {object} jieqi - 节气信息
 * @returns {object} 局数信息 {type: '阳遁'/'阴遁', ju: 1-9}
 */
function getJuShu(dayGanZhi, hour, jieqi) {
    // 获取日干
    const dayGan = dayGanZhi[0];

    // 根据日干确定上中下元
    // 甲己日上元，乙庚日中元，丙辛日下元，丁壬日上元，戊癸日中元
    const ganToYuan = {
        '甲': 0, '己': 0,  // 上元
        '乙': 1, '庚': 1,  // 中元
        '丙': 2, '辛': 2,  // 下元
        '丁': 0, '壬': 0,  // 上元
        '戊': 1, '癸': 1   // 中元
    };

    const yuan = ganToYuan[dayGan];
    const juNumber = jieqi.ju[yuan];

    return {
        type: jieqi.type,
        ju: juNumber,
        jieqiName: jieqi.name,
        yuan: ['上元', '中元', '下元'][yuan]
    };
}

/**
 * 根据局数排地盘干（五天内固定）
 * @param {string} type - '阳遁' or '阴遁'
 * @param {number} ju - 局数 1-9
 * @returns {array} 地盘九宫天干排列
 */
function getDiPanGan(type, ju) {
    const diPan = new Array(9);

    if (type === '阳遁') {
        // 阳遁：戊从几宫起，顺序排列 1→2→3→4→5→6→7→8→9
        const startPalace = ju;
        for (let i = 0; i < 9; i++) {
            // 从起始宫位开始，顺序填充
            const targetPalace = ((startPalace - 1 + i) % 9) + 1; // 1-9
            diPan[targetPalace - 1] = SAN_QI_LIU_YI[i];
        }
    } else {
        // 阴遁：戊从几宫起，逆序排列 9→8→7→6→5→4→3→2→1
        const startPalace = ju;
        for (let i = 0; i < 9; i++) {
            // 从起始宫位开始，逆序填充
            const targetPalace = ((startPalace - 1 - i + 9) % 9) + 1; // 1-9
            diPan[targetPalace - 1] = SAN_QI_LIU_YI[i];
        }
    }

    console.log(`getDiPanGan: ${type}${ju}局`, diPan);
    return diPan;
}

/**
 * 根据时干和地盘，计算天盘（随时辰变化）
 * @param {string} hourGan - 时干
 * @param {array} diPan - 地盘排列
 * @param {string} type - '阳遁' or '阴遁'
 * @returns {array} 天盘九宫天干排列
 */
function getTianPanGan(hourGan, diPan, type) {
    const tianPan = new Array(9);

    // 找到时干在地盘的位置
    let hourGanPalace = -1;
    for (let i = 0; i < 9; i++) {
        if (diPan[i] === hourGan) {
            hourGanPalace = i + 1; // 宫位号 1-9
            break;
        }
    }

    if (hourGanPalace === -1) {
        // 如果没找到，返回地盘
        return [...diPan];
    }

    // 从时干所在宫位开始，按同样的阳遁/阴遁再排一次
    if (type === '阳遁') {
        // 阳遁顺排
        const order = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const startPalace = hourGanPalace;
        for (let i = 0; i < 9; i++) {
            const targetIndex = (startPalace - 1 + i) % 9;
            tianPan[order[targetIndex] - 1] = SAN_QI_LIU_YI[i];
        }
    } else {
        // 阴遁逆排：戊从时干宫位起，逆序排列
        const startPalace = hourGanPalace;
        for (let i = 0; i < 9; i++) {
            const targetPalace = ((startPalace - 1 - i + 90) % 9) + 1;
            tianPan[targetPalace - 1] = SAN_QI_LIU_YI[i];
        }
    }

    return tianPan;
}

/**
 * 根据时干支确定旬首和对应六仪
 * @param {string} hourGanZhi - 时干支 (e.g. '庚午')
 * @returns {object} {name: 旬首名, liuYi: 旬首六仪}
 */
function getXunShou(hourGanZhi) {
    const TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
    const DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
    const XUN_NAMES = ['甲子','甲戌','甲申','甲午','甲辰','甲寅'];
    const XUN_YI   = ['戊',  '己',  '庚',  '辛',  '壬',  '癸'];

    const tgIdx = TG.indexOf(hourGanZhi[0]);
    const dzIdx = DZ.indexOf(hourGanZhi[1]);

    let gzIndex = 0;
    for (let i = 0; i < 60; i++) {
        if (i % 10 === tgIdx && i % 12 === dzIdx) { gzIndex = i; break; }
    }

    const xunNum = Math.floor(gzIndex / 10);
    return { name: XUN_NAMES[xunNum], liuYi: XUN_YI[xunNum] };
}

/**
 * 根据地盘和时干支确定值符星和位置
 * 值符随时干：时干在地盘所在宫位即为值符宫（天盘戊也落于此宫）
 * 九星按洛书顺序固定对应各宫：坎1天蓬→乾6天芮→艮8天冲→震3天辅→中5天禽→兑7天心→坤2天柱→离9天任→巽4天英
 * @param {array} diPan - 地盘排列
 * @param {string} hourGanZhi - 时干支
 * @returns {object} {xunShou, xunYi, zhiFuStar, zhiFuPalace}
 */
function getZhiFuInfo(diPan, hourGanZhi) {
    const hourGan = hourGanZhi[0];
    const xunShou = getXunShou(hourGanZhi);

    // 值符宫 = 时干在地盘所在的宫位
    let zhiFuPalace = 5;
    for (let i = 0; i < 9; i++) {
        if (diPan[i] === hourGan) { zhiFuPalace = i + 1; break; }
    }

    // 值符星 = 旬首六仪在地盘所在宫位的本宫九星
    // 例：甲寅旬六仪癸 在地盘艮8宫 → 天任 → 值符星为天任
    let xunYiPalace = 5;
    for (let i = 0; i < 9; i++) {
        if (diPan[i] === xunShou.liuYi) { xunYiPalace = i + 1; break; }
    }
    const zhiFuStar = PALACE_STAR[xunYiPalace - 1];

    return {
        xunShou: xunShou.name,
        xunYi: xunShou.liuYi,
        zhiFuStar,
        zhiFuPalace
    };
}

/**
 * 排九星 - 从值符宫起，阳遁顺时针，阴遁逆时针
 * 天禽固定中宫，其余8星从值符星按顺时针顺序排于8外宫
 * 顺时针外宫顺序：离9→坤2→兑7→乾6→坎1→艮8→震3→巽4
 * @param {string} zhiFuStar - 值符星名称
 * @param {number} zhiFuPalace - 值符所在宫位
 * @param {string} type - '阳遁' or '阴遁'
 * @returns {array} 九星排列
 */
function arrangeJiuXing(zhiFuStar, zhiFuPalace, type) {
    const jiuXing = new Array(9);
    jiuXing[4] = '天禽'; // 天禽固定中宫

    const clockwisePalaces = [9, 2, 7, 6, 1, 8, 3, 4]; // 8外宫顺时针顺序
    const startIdx = clockwisePalaces.indexOf(zhiFuPalace);
    const dir = type === '阴遁' ? -1 : 1;
    const zhiFuStarIndex = JIU_XING.indexOf(zhiFuStar);

    for (let i = 0; i < 8; i++) {
        const palaceIdx = ((startIdx + dir * i) % 8 + 8) % 8;
        const palace = clockwisePalaces[palaceIdx];
        jiuXing[palace - 1] = JIU_XING[(zhiFuStarIndex + i) % 8];
    }

    return jiuXing;
}

/**
 * 排八门 - 时家奇门中八门固定于本宫，不随时辰移动
 * 坎1-休, 坤2-死, 震3-伤, 巽4-杜, 中5-无, 乾6-开, 兑7-惊, 艮8-生, 离9-景
 * @returns {array} 八门排列 (index = palace - 1)
 */
function arrangeBaMen() {
    return [...BA_MEN];
}

/**
 * 排八神 - 阳遁顺排，阴遁逆排
 * @param {number} zhiFuPalace - 值符所在宫位
 * @param {string} type - '阳遁' or '阴遁'
 * @returns {array} 八神排列
 */
function arrangeBaShen(zhiFuPalace, type) {
    const bashen = new Array(9);
    const luoshuOrder = [1, 6, 8, 3, 5, 7, 2, 9, 4];
    const startIndex = luoshuOrder.indexOf(zhiFuPalace);
    const dir = type === '阴遁' ? -1 : 1;

    for (let i = 0; i < 9; i++) {
        const targetIndex = ((startIndex + dir * i) % 9 + 9) % 9;
        const targetPalace = luoshuOrder[targetIndex];
        if (BA_SHEN[i]) {
            bashen[targetPalace - 1] = BA_SHEN[i];
        }
    }

    return bashen;
}

/**
 * 完整排盘
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @param {number} hour - Hour (0-23)
 * @param {string} dayGanZhi - 日干支
 * @param {string} hourGanZhi - 时干支
 * @returns {object} 完整盘面信息
 */
function createQimenChart(year, month, day, hour, dayGanZhi, hourGanZhi) {
    // 1. 确定节气
    const jieqi = getJieQi(month, day);

    // 2. 确定局数
    const juInfo = getJuShu(dayGanZhi, hour, jieqi);

    // 3. 排地盘干（五天内固定）
    const diPanGan = getDiPanGan(juInfo.type, juInfo.ju);

    // 4. 获取时干
    const hourGan = hourGanZhi[0];

    // 5. 排天盘干（根据时干在地盘的位置）
    const tianPanGan = getTianPanGan(hourGan, diPanGan, juInfo.type);

    // 6. 确定旬首六仪、值符星和位置（时干在地盘所在宫位的洛书九星即为值符）
    const zhiFuInfo = getZhiFuInfo(diPanGan, hourGanZhi);

    // 7. 排九星（阳遁顺排，阴遁逆排）
    const jiuXing = arrangeJiuXing(zhiFuInfo.zhiFuStar, zhiFuInfo.zhiFuPalace, juInfo.type);

    // 8. 排八门（固定于本宫，不随时辰移动）
    const baMen = arrangeBaMen();

    // 9. 排八神（阳遁顺排，阴遁逆排）
    const baShen = arrangeBaShen(zhiFuInfo.zhiFuPalace, juInfo.type);

    // 10. 值使门 = 时干在地盘所在宫位的八门
    let zhiShiPalace = 5;
    for (let i = 0; i < 9; i++) {
        if (diPanGan[i] === hourGan) { zhiShiPalace = i + 1; break; }
    }
    const zhiShiMen = baMen[zhiShiPalace - 1] || '无';

    // Debug logging
    console.log('=== Chart Creation Debug ===');
    console.log('diPanGan array:', diPanGan);
    console.log('值符确定逻辑：时干在地盘所在宫位的洛书九星');
    console.log('值符信息:', zhiFuInfo);
    console.log(`时干${hourGan}在地盘第${zhiFuInfo.zhiFuPalace}宫，该宫洛书九星为${zhiFuInfo.zhiFuStar}，即为值符`);
    console.log('Palace mappings:');
    for (let i = 0; i < 9; i++) {
        console.log(`  Palace ${i+1} (index ${i}): 地盘=${diPanGan[i]}`);
    }

    return {
        datetime: `${year}年${month}月${day}日 ${hour}时`,
        jieqi: jieqi.name,
        juInfo: juInfo,
        xunShou: zhiFuInfo.xunShou,
        xunYi: zhiFuInfo.xunYi,
        zhiFuStar: zhiFuInfo.zhiFuStar,
        zhiFuPalace: zhiFuInfo.zhiFuPalace,
        zhiShiMen: zhiShiMen,
        zhiShiPalace: zhiShiPalace,
        palaces: Array.from({ length: 9 }, (_, i) => ({
            palace: i + 1,
            gongWei: GONG_WEI[i + 1],
            diPanGan: diPanGan[i],
            tianPanGan: tianPanGan[i],
            jiuXing: jiuXing[i],
            baMen: baMen[i],
            baShen: baShen[i]
        }))
    };
}
