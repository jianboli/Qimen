// Test to compare reference renderer.js logic with getDiPanGan

console.log('=== Reference Implementation (renderer.js) ===');
console.log('Testing 阳遁 (ascending), starting position = 3\n');

const characters = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
const direction = 'ascending';
const startPosition = 3;

const gridOrder = direction === 'ascending'
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
    : [9, 8, 7, 6, 5, 4, 3, 2, 1];

const startIndex = gridOrder.indexOf(startPosition);
console.log(`gridOrder: [${gridOrder}]`);
console.log(`startPosition: ${startPosition}`);
console.log(`startIndex: ${startIndex}\n`);

console.log('Character placement:');
const placements = {};
for (let i = 0; i < characters.length; i++) {
    const currentIndex = (startIndex + i) % gridOrder.length;
    const currentPosition = gridOrder[currentIndex];
    placements[currentPosition] = characters[i];
    console.log(`  i=${i}: currentIndex=${currentIndex}, currentPosition=${currentPosition}, character='${characters[i]}'`);
}

console.log('\n=== Result (by Position) ===');
for (let pos = 1; pos <= 9; pos++) {
    console.log(`Position ${pos}: ${placements[pos]}`);
}

console.log('\n\n=== Our Implementation (getDiPanGan) ===');

const SAN_QI_LIU_YI = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];

function getDiPanGan(type, ju) {
    const diPan = new Array(9);
    if (type === '阳遁') {
        const startPalace = ju;
        for (let i = 0; i < 9; i++) {
            const targetPalace = ((startPalace - 1 + i) % 9) + 1;
            diPan[targetPalace - 1] = SAN_QI_LIU_YI[i];
        }
    }
    return diPan;
}

const result = getDiPanGan('阳遁', 3);

console.log('\n=== Result (by Palace) ===');
for (let i = 0; i < 9; i++) {
    console.log(`Palace ${i+1} (array[${i}]): ${result[i]}`);
}

console.log('\n\n=== Comparison ===');
let allMatch = true;
for (let i = 0; i < 9; i++) {
    const palace = i + 1;
    const match = placements[palace] === result[i];
    console.log(`Palace ${palace}: Reference='${placements[palace]}' vs Our='${result[i]}' ${match ? '✓' : '✗'}`);
    if (!match) allMatch = false;
}

console.log('\n' + (allMatch ? '✓ Both implementations produce identical results!' : '✗ Implementations differ!'));
