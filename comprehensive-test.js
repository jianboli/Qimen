// Load both files
const ganzhi = require('./ganzhi.js');
const fs = require('fs');
const qimenCode = fs.readFileSync('./qimen-paipan.js', 'utf8');

// Execute qimen-paipan.js code to load functions
eval(qimenCode);

// Test with a specific date that should give 阳遁3局
// Using 雨水节气 (2月19日-3月6日) with 丙日 (下元) → 阳遁6局
// Or using 惊蛰节气 (3月6日-3月21日) with 甲日 (上元) → 阳遁3局

console.log('=== Comprehensive Test for 阳遁3局 ===\n');

// Test date: March 10, 2024 (惊蛰节气), time 10:00
// Need a 甲日 or 己日 (上元) to get阳遁3局

const year = 2024;
const month = 3;
const day = 10;
const hour = 10;

// Get Ganzhi
const dayGanZhi = ganzhi.getDayGanZhi(year, month, day);
const hourGanZhi = ganzhi.getHourGanZhi(year, month, day, hour, 0);

console.log(`Date: ${year}-${month}-${day} ${hour}:00`);
console.log(`Day GanZhi: ${dayGanZhi}`);
console.log(`Hour GanZhi: ${hourGanZhi}`);
console.log('');

// Create chart
const chart = createQimenChart(year, month, day, hour, dayGanZhi, hourGanZhi);

console.log('=== Chart Info ===');
console.log(`节气: ${chart.jieqi}`);
console.log(`局数: ${chart.juInfo.type}${chart.juInfo.ju}局 (${chart.juInfo.yuan})`);
console.log(`值符位置: ${chart.zhiFuPalace}`);
console.log('');

console.log('=== Palace Details ===');
console.log('Palace | 地盘干 | 天盘干 | 九星   | 八门   | 八神');
console.log('-------|--------|--------|--------|--------|-------');

for (let i = 0; i < 9; i++) {
    const p = chart.palaces[i];
    console.log(
        `  ${p.palace}    | ${p.diPanGan.padEnd(4)} | ${p.tianPanGan.padEnd(4)} | ${(p.jiuXing || '').padEnd(4)} | ${(p.baMen || '').padEnd(4)} | ${(p.baShen || '').padEnd(4)}`
    );
}

console.log('\n=== Verification for 阳遁3局 ===');
const expected = ['丙', '乙', '戊', '己', '庚', '辛', '壬', '癸', '丁'];
console.log('Palace | Expected | Actual | Match');
console.log('-------|----------|--------|------');
let allMatch = true;
for (let i = 0; i < 9; i++) {
    const match = chart.palaces[i].diPanGan === expected[i];
    console.log(`  ${i+1}    | ${expected[i].padEnd(8)} | ${chart.palaces[i].diPanGan.padEnd(6)} | ${match ? '✓' : '✗'}`);
    if (!match) allMatch = false;
}

console.log('\nResult: ' + (allMatch ? '✓ All values match!' : '✗ Mismatch detected!'));

// Also test with manual阳遁3局
console.log('\n\n=== Direct Test with阳遁3局 ===');
const testType = '阳遁';
const testJu = 3;
const testDiPan = getDiPanGan(testType, testJu);

console.log('\nDirect getDiPanGan result:');
for (let i = 0; i < 9; i++) {
    console.log(`Palace ${i+1}: ${testDiPan[i]}`);
}
