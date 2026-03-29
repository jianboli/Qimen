// Test script for getDiPanGan function

const SAN_QI_LIU_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

function getDiPanGan(type, ju) {
    const diPan = new Array(9);

    if (type === '阳遁') {
        // 阳遁：戊从几宫起，顺序排列 1→2→3→4→5→6→7→8→9
        const startPalace = ju;
        for (let i = 0; i < 9; i++) {
            // 从起始宫位开始，顺序填充
            const targetPalace = ((startPalace - 1 + i) % 9) + 1; // 1-9
            diPan[targetPalace - 1] = SAN_QI_LIU_YI[i];
            console.log(`  i=${i}: targetPalace=${targetPalace}, diPan[${targetPalace-1}] = '${SAN_QI_LIU_YI[i]}'`);
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

    console.log(`\ngetDiPanGan: ${type}${ju}局`);
    console.log('Final diPan array:', diPan);
    console.log('\nPalace mappings:');
    for (let i = 0; i < 9; i++) {
        console.log(`  Palace ${i+1} (array index ${i}): '${diPan[i]}'`);
    }
    return diPan;
}

// Test 阳遁3局
console.log('=== Testing 阳遁3局 ===\n');
const result = getDiPanGan('阳遁', 3);

console.log('\n=== Expected Values for 阳遁3局 ===');
console.log('Palace 1: 丙');
console.log('Palace 2: 乙');
console.log('Palace 3: 戊');
console.log('Palace 4: 己');
console.log('Palace 5: 庚');
console.log('Palace 6: 辛');
console.log('Palace 7: 壬');
console.log('Palace 8: 癸');
console.log('Palace 9: 丁');

console.log('\n=== Verification ===');
const expected = ['丙', '乙', '戊', '己', '庚', '辛', '壬', '癸', '丁'];
let allCorrect = true;
for (let i = 0; i < 9; i++) {
    const match = result[i] === expected[i];
    console.log(`Palace ${i+1}: ${result[i]} ${match ? '✓' : '✗ (expected: ' + expected[i] + ')'}`);
    if (!match) allCorrect = false;
}

console.log('\n' + (allCorrect ? '✓ All values correct!' : '✗ Some values are incorrect!'));
