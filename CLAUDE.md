# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron desktop application for exploring **奇门遁甲 (Qimen Dunjia)** patterns with the Ten Heavenly Stems and Nine Palaces. It features two main interactive visualizations: the Qimen grid system and the traditional Bagua diagram.

## Development Commands

```bash
# Install dependencies
npm install

# Run the application (production mode)
npm start

# Run with DevTools and logging enabled
npm run dev

# Alternative: Run in browser without Electron
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser

# Run test scripts (Node.js, no test framework)
node comprehensive-test.js   # Full 阳遁3局 chart validation
node test-dipan.js           # 地盘干 (Earth Plate) placement tests
node test-reference.js       # Reference date / calculation tests
node test-zhifu.js           # 值符 (Duty Star) position tests
# test-display.html: open in browser via http server for visual test output
```

## Architecture

### Core Components

The application follows a **tab-based architecture** with four independent features:

1. **Qimen Tab** (`renderer.js` + `index.html`)
   - Interactive 3x3 grid for character placement
   - Implements 阳遁 (Yang/ascending) and 阴遁 (Yin/descending) traversal patterns
   - Character sequence: 戊己庚辛壬癸丁丙乙 (Six Instruments + Three Odds)

2. **Bagua Tab** (`bagua-ui.js` + `index.html`)
   - D3.js-based visualization of the Eight Trigrams
   - Displays Taiji (☯) symbol, trigram symbols, Chinese labels, and palace numbers
   - Traditional Fuxi Bagua arrangement

3. **GanZhi Calculator Tab** (`ganzhi.js` + `index.html`)
   - Complete 四柱八字 (Four Pillars) calculator
   - Calculates year, month, day, and hour 干支
   - Accounts for 立春, 24 solar terms, and 时辰 boundaries
   - Displays current time's 干支 with "此刻干支" button

4. **Qimen Paipan Tab** (`qimen-paipan.js` + `index.html`)
   - Complete 时家奇门 chart system with 拆补法
   - Displays 九宫格 (9-palace grid) with all elements
   - Shows 九星 (Nine Stars), 八门 (Eight Gates), 八神 (Eight Spirits)
   - Displays both 天盘干 (Sky Plate) and 地盘干 (Earth Plate)
   - Calculates 值符 (Duty Star) position and bureau number

### File Responsibilities

- **`main.js`**: Electron main process - creates BrowserWindow, handles app lifecycle
- **`index.html`**: UI structure with tab navigation, controls, grid cells, and SVG canvas
- **`renderer.js`**: Qimen grid logic - QimenGrid class handles character placement algorithm
- **`bagua-ui.js`**: D3.js visualization for Bagua diagram (Taiji + 8 trigrams + labels)
- **`ganzhi.js`**: 干支 calculation library - year/month/day/hour stem-branch calculations
- **`qimen-paipan.js`**: 奇门遁甲排盘 system - 时家奇门 with 拆补法 chart generation
- **`styles.css`**: Styling for all tabs, grid layout, animations, and responsive design

### Key Algorithms

#### Character Placement Logic (renderer.js:50-82)

The core algorithm places characters in the grid based on:
- **Starting position** (1-9)
- **Direction**:
  - `ascending` (阳遁): traverses 1→2→3→4→5→6→7→8→9
  - `descending` (阴遁): traverses 9→8→7→6→5→4→3→2→1
- **Character order** (fixed): 戊→己→庚→辛→壬→癸→丁→丙→乙

The algorithm:
1. Creates a grid order array based on direction
2. Finds the starting index in that order
3. Places characters sequentially with modulo wrapping
4. Applies staggered animation for visual effect

#### Grid Position Layout

The grid uses a **non-sequential physical arrangement** matching traditional Qimen:
```
┌─────┬─────┬─────┐
│  4  │  9  │  2  │
├─────┼─────┼─────┤
│  3  │  5  │  7  │
├─────┼─────┼─────┤
│  8  │  1  │  6  │
└─────┴─────┴─────┘
```

This layout is critical: the DOM structure in `index.html` matches this visual arrangement, but the `data-grid-number` attributes define the logical position (1-9) used by the algorithm.

#### GanZhi Calculator (ganzhi.js)

The 干支 calculator implements traditional Chinese stem-branch calculations for the Four Pillars (四柱八字):

**Year Pillar (年柱)** - `getYearGanZhi(year, month, day)`:
- Uses 立春 (Start of Spring, ~Feb 4-5) as the year boundary
- Dates before 立春 use the previous year's 干支
- Base year: 1864 (甲子年) for 60-year cycle calculation

**Month Pillar (月柱)** - `getMonthGanZhi(year, month, day)`:
- Based on 24 solar terms (节气) boundaries
- 寅月 starts at 立春, 卯月 at 惊蛰, etc.
- Month stem determined by year stem using 年上起月表 formula:
  - 甲己年: 寅月从丙开始
  - 乙庚年: 寅月从戊开始
  - 丙辛年: 寅月从庚开始
  - 丁壬年: 寅月从壬开始
  - 戊癸年: 寅月从甲开始

**Day Pillar (日柱)** - `getDayGanZhi(year, month, day)`:
- Direct calculation from reference date (2000-01-01 = 己未日)
- Counts days from reference and applies modulo 60

**Hour Pillar (时柱)** - `getHourGanZhi(year, month, day, hour, minute)`:
- 12 时辰 (double-hour periods): 子丑寅卯辰巳午未申酉戌亥
- Each 时辰 spans 2 hours (子时: 23:00-01:00, 丑时: 01:00-03:00, etc.)
- Special case: 23:00-23:59 belongs to next day's 子时
- Hour stem determined by day stem using 日上起时表 formula:
  - 甲己日: 子时从甲开始
  - 乙庚日: 子时从丙开始
  - 丙辛日: 子时从戊开始
  - 丁壬日: 子时从庚开始
  - 戊癸日: 子时从壬开始

**Helper Functions**:
- `dateTimeToGanZhi(dateString, timeString)`: Complete four-pillar calculation
- `getNowGanZhi()`: Current moment's 干支 with hour
- `getShichenName(hour)`: Converts hour to 时辰 name (e.g., "子时")

#### Qimen Paipan System (qimen-paipan.js)

The 奇门排盘 system implements **时家奇门** (Hourly Qimen) with **拆补法** (Chai Bu method):

**Core Elements**:
- **三奇六仪**: 戊己庚辛壬癸丁丙乙 (Six Instruments + Three Odds)
- **九星**: 天蓬、天芮、天冲、天辅、天禽、天心、天柱、天任、天英
- **八门**: 休门、死门、伤门、杜门、(中宫无门)、开门、惊门、生门、景门
- **八神**: 值符、腾蛇、太阴、六合、(中宫无神)、白虎、玄武、九地、九天

**Bureau Calculation** - `getJuShu(dayGanZhi, hour, jieqi)`:
1. Determine solar term (节气) from date
2. Each solar term pair has 3 bureaus: 上元、中元、下元
3. Day stem determines which yuan:
   - 甲己日: 上元 (1st bureau)
   - 乙庚日: 中元 (2nd bureau)
   - 丙辛日: 下元 (3rd bureau)
   - 丁壬日: 上元
   - 戊癸日: 中元
4. Result: 阳遁1-9局 or 阴遁1-9局

**Sky Plate Arrangement** - `getTianPanGan(type, ju)`:
- **阳遁**: 戊 starts at bureau number, arranges clockwise (1→2→3→4→5→6→7→8→9)
- **阴遁**: 戊 starts at bureau number, arranges counterclockwise (9→8→7→6→5→4→3→2→1)

**Duty Star Position** - `getZhiFuPosition(hourGanZhi, ju, type)`:
- Find hour stem (时干) on sky plate
- The 九星 at that palace becomes 值符 (Duty Star)
- This determines the starting position for all element arrangements

**Element Arrangements**:
- **九星** - `arrangeJiuXing(zhiFuPalace)`: Arranged from 值符 palace following 洛书 order (1→6→8→3→5→7→2→9→4)
- **八门** - `arrangeBaMen(zhiFuPalace)`: Follows same 洛书 sequence from 值使 position
- **八神** - `arrangeBaShen(zhiFuPalace)`: Arranged from 值符 palace in 洛书 order

**Complete Chart** - `createQimenChart(year, month, day, hour, dayGanZhi, hourGanZhi)`:
Returns object with:
- Bureau info (type, number, yuan, solar term)
- 9 palaces with: 宫位、地盘干、天盘干、九星、八门、八神
- 值符 position

## Important Implementation Details

### Electron Configuration
- **Node Integration**: Enabled (`nodeIntegration: true`)
- **Context Isolation**: Disabled (`contextIsolation: false`)
- This allows renderer process to access Node.js APIs directly

### D3.js Visualization
The Bagua diagram uses D3.js v7+ syntax with:
- Arc generators for Taiji symbol halves
- Text rotation calculations for proper trigram orientation
- Transform attributes for precise positioning

### Event Handling
- Grid cells are clickable - clicking sets that position as start and auto-fills
- Keyboard shortcuts: `F` (fill), `C` (clear), `1-9` (set position + fill)
- Tab switching handled via `.tab-button` click handlers (in inline script)

## Development Notes

### When Adding Features to Qimen Tab
- Character sequence must remain fixed: 戊己庚辛壬癸丁丙乙
- Grid positions follow traditional layout (4-9-2 / 3-5-7 / 8-1-6)
- The `QimenGrid` class is globally accessible via `window.qimenGrid` for debugging

### When Modifying Bagua Visualization
- Trigram data structure in `bagua-ui.js:105-114` defines angles, symbols, labels, and numbers
- Text rotation uses transform with angle offset: `rotate(${180+d.angle}, x, y)`
- Taiji radius and subsequent radii (bagua, label, number) are concentrically calculated

### When Modifying GanZhi Calculator
- All 干支 calculations follow traditional Chinese metaphysics rules
- 立春 boundary for year is simplified to Feb 5 (actual varies by year and includes time)
- 24 solar terms boundaries for month are approximated (actual dates vary by year)
- Hour calculations correctly handle 23:00-23:59 as next day's 子时
- The `TIAN_GAN` and `DI_ZHI` arrays must remain in traditional order
- Reference dates: 1864 = 甲子年 (year), 2000-01-01 = 己未日 (day)

### When Modifying Qimen Paipan
- The system implements **拆补法** - each solar term pair has 3 bureaus (上中下元)
- Solar term dates in `JIE_QI_TABLE` are approximations (actual dates vary by year)
- Bureau numbers follow traditional patterns: 冬至 starts 阳遁, 夏至 starts 阴遁
- **洛书 order** (1→6→8→3→5→7→2→9→4) is critical for element arrangements
- Palace numbering matches traditional layout:
  ```
  4(巽) 9(离) 2(坤)
  3(震) 5(中) 7(兑)
  8(艮) 1(坎) 6(乾)
  ```
- The 9-palace grid in HTML must match this layout for correct display
- Future enhancements: 格局分析 (pattern analysis), 断事建议 (divination)

### Testing Changes
Always test in Electron (`npm start`) as browser behavior may differ:
- Node.js APIs won't work in pure browser mode
- DevTools are available in dev mode (`npm run dev`)
- Console logging is extensive for debugging character placement

## Cross-Platform Considerations
- The app uses standard web technologies (HTML/CSS/JS) for maximum compatibility
- Electron provides native desktop window with proper title bar and resizing
- macOS-specific: Window isn't destroyed when clicking red close button (follows platform convention)
