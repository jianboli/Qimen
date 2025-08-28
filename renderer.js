// Qimen Grid App - Renderer Process
class QimenGrid {
    constructor() {
        // Chinese character sequence
        this.characters = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙'];
        
        // Grid order sequence (1-9)
        this.gridOrder = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Get DOM elements
        this.startPositionSelect = document.getElementById('startPosition');
        this.directionSelect = document.getElementById('direction');
        this.fillGridBtn = document.getElementById('fillGrid');
        this.clearGridBtn = document.getElementById('clearGrid');
        this.gridCells = document.querySelectorAll('.grid-cell');

        // Add event listeners
        this.fillGridBtn.addEventListener('click', () => this.fillGrid());
        this.clearGridBtn.addEventListener('click', () => this.clearGrid());
        
        // Add click listeners to grid cells for manual selection
        this.gridCells.forEach(cell => {
            cell.addEventListener('click', () => this.onCellClick(cell));
        });
    }

    onCellClick(cell) {
        const position = parseInt(cell.dataset.gridNumber);
        this.startPositionSelect.value = position;
        this.fillGrid();
    }

    fillGrid() {
        this.clearGrid();
        
        const startPosition = parseInt(this.startPositionSelect.value);
        const direction = this.directionSelect.value;
        
        // Characters always stay in the same order
        const characters = [...this.characters];
        
        // Calculate positions and fill the grid
        this.placeCharacters(startPosition, characters, direction);
    }

    placeCharacters(startPosition, characters, direction) {
        // Create grid position order based on direction
        const gridOrder = direction === 'ascending' 
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9]  // ascending order
            : [9, 8, 7, 6, 5, 4, 3, 2, 1]; // descending order
        
        // Find the starting index in the grid order
        const startIndex = gridOrder.indexOf(startPosition);
        
        for (let i = 0; i < characters.length; i++) {
            // Calculate current position with wrapping
            const currentIndex = (startIndex + i) % gridOrder.length;
            const currentPosition = gridOrder[currentIndex];
            
            // Find the corresponding DOM element and fill it
            const cell = document.querySelector(`[data-grid-number="${currentPosition}"]`);
            if (cell) {
                const characterSpan = cell.querySelector('.character');
                characterSpan.textContent = characters[i];
                cell.classList.add('filled');
                
                // Add a subtle animation delay
                setTimeout(() => {
                    cell.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        cell.style.transform = '';
                    }, 200);
                }, i * 100);
            }
        }
        
        this.displayPlacementInfo(startPosition, characters, direction, gridOrder);
    }

    displayPlacementInfo(startPosition, characters, direction, gridOrder) {
        // Log the placement for debugging
        console.log('Placement Info:');
        console.log(`Starting Position: ${startPosition}`);
        console.log(`Direction: ${direction}`);
        console.log('Character placement:');
        
        const startIndex = gridOrder.indexOf(startPosition);
        for (let i = 0; i < characters.length; i++) {
            const currentIndex = (startIndex + i) % gridOrder.length;
            const currentPosition = gridOrder[currentIndex];
            console.log(`${characters[i]} -> Position ${currentPosition}`);
        }
    }

    clearGrid() {
        this.gridCells.forEach(cell => {
            const characterSpan = cell.querySelector('.character');
            characterSpan.textContent = '';
            cell.classList.remove('filled');
            cell.style.transform = '';
        });
    }

    // Method to get current grid state
    getGridState() {
        const state = {};
        this.gridCells.forEach(cell => {
            const position = cell.dataset.gridNumber;
            const character = cell.querySelector('.character').textContent;
            if (character) {
                state[position] = character;
            }
        });
        return state;
    }

    // Method to set grid state (useful for loading saved states)
    setGridState(state) {
        this.clearGrid();
        Object.keys(state).forEach(position => {
            const cell = document.querySelector(`[data-grid-number="${position}"]`);
            if (cell) {
                const characterSpan = cell.querySelector('.character');
                characterSpan.textContent = state[position];
                cell.classList.add('filled');
            }
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const qimenGrid = new QimenGrid();
    
    // Make it globally accessible for debugging
    window.qimenGrid = qimenGrid;
    
    console.log('Qimen Grid App initialized');
    console.log('Grid order:', qimenGrid.gridOrder);
    console.log('Characters:', qimenGrid.characters);
});

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        document.getElementById('fillGrid').click();
    } else if (event.key === 'c' || event.key === 'C') {
        document.getElementById('clearGrid').click();
    } else if (event.key >= '1' && event.key <= '9') {
        document.getElementById('startPosition').value = event.key;
        document.getElementById('fillGrid').click();
    }
});
