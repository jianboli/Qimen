// 测试值符确定逻辑

const fs = require('fs');
const code = fs.readFileSync('./qimen-paipan.js', 'utf8');
eval(code);

console.log('=== 测试值符确定逻辑 ===\n');
console.log('规则：旬首"甲"隐藏在"戊"下，戊所在宫位的本宫九星就是值符\n');

// 测试阳遁3局
console.log('【测试1：阳遁3局】');
const diPan1 = getDiPanGan('阳遁', 3);
console.log('地盘排列:', diPan1);

// 找戊的位置
let wuPalace = -1;
for (let i = 0; i < 9; i++) {
    if (diPan1[i] === '戊') {
        wuPalace = i + 1;
        console.log(`戊在第${wuPalace}宫 (array index ${i})`);
        break;
    }
}

const zhiFuInfo1 = getZhiFuInfo(diPan1);
console.log('值符信息:', zhiFuInfo1);

// 九星本宫对照
const palaceNames = ['', '坎一宫', '坤二宫', '震三宫', '巽四宫', '中五宫', '乾六宫', '兑七宫', '艮八宫', '离九宫'];
const palaceStars = ['', '天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];
console.log(`${palaceNames[wuPalace]}的本宫星是${palaceStars[wuPalace]}`);
console.log(`因此，值符 = ${zhiFuInfo1.zhiFuStar}\n`);

// 测试阳遁1局
console.log('【测试2：阳遁1局】');
const diPan2 = getDiPanGan('阳遁', 1);
console.log('地盘排列:', diPan2);

wuPalace = -1;
for (let i = 0; i < 9; i++) {
    if (diPan2[i] === '戊') {
        wuPalace = i + 1;
        console.log(`戊在第${wuPalace}宫 (array index ${i})`);
        break;
    }
}

const zhiFuInfo2 = getZhiFuInfo(diPan2);
console.log('值符信息:', zhiFuInfo2);
console.log(`${palaceNames[wuPalace]}的本宫星是${palaceStars[wuPalace]}`);
console.log(`因此，值符 = ${zhiFuInfo2.zhiFuStar}\n`);

// 测试阴遁9局
console.log('【测试3：阴遁9局】');
const diPan3 = getDiPanGan('阴遁', 9);
console.log('地盘排列:', diPan3);

wuPalace = -1;
for (let i = 0; i < 9; i++) {
    if (diPan3[i] === '戊') {
        wuPalace = i + 1;
        console.log(`戊在第${wuPalace}宫 (array index ${i})`);
        break;
    }
}

const zhiFuInfo3 = getZhiFuInfo(diPan3);
console.log('值符信息:', zhiFuInfo3);
console.log(`${palaceNames[wuPalace]}的本宫星是${palaceStars[wuPalace]}`);
console.log(`因此，值符 = ${zhiFuInfo3.zhiFuStar}\n`);

console.log('=== 结论 ===');
console.log('值符 = 戊所在宫位的本宫九星');
console.log('这符合"旬首在地盘的九星即为该局值符"的规则');
console.log('（因为旬首"甲"隐藏在"戊"下）');
