// 天干地支计算库
// Heavenly Stems and Earthly Branches Calculator

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Base year for calculation (1864 is 甲子年)
const BASE_YEAR = 1864;

/**
 * Calculate year 干支
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} Year stem-branch (e.g., "辛亥")
 */
function getYearGanZhi(year, month, day) {
    // Chinese astrological year starts at 立春 (Start of Spring), not Jan 1
    // 立春 is typically around Feb 3-5
    // If before or on 立春, use previous year's 干支

    let actualYear = year;

    // Simplified: if before Feb 6, use previous year
    // In reality, 立春 varies between Feb 3-5 and includes time-of-day
    // For 2026, 立春 is after Feb 5, so Feb 1-5 use previous year
    if (month === 1 || (month === 2 && day <= 5)) {
        actualYear = year - 1;
    }

    // Calculate offset from base year (1864 is 甲子年)
    const offset = (actualYear - BASE_YEAR) % 60;
    const adjustedOffset = offset >= 0 ? offset : offset + 60;

    const ganIndex = adjustedOffset % 10;
    const zhiIndex = adjustedOffset % 12;

    return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * Calculate month 干支
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} Month stem-branch
 */
function getMonthGanZhi(year, month, day) {
    // Month earthly branch index (0-11)
    // 寅月 starts from 立春 (around Feb 4-5)
    // 卯月 starts from 惊蛰 (around Mar 5-6)
    let monthZhiIndex;

    if (month === 1 || (month === 2 && day < 4)) {
        // Before 立春: 丑月
        monthZhiIndex = 1; // 丑
    } else if (month === 2 || (month === 3 && day < 6)) {
        // After 立春 (Feb 4+), before 惊蛰: 寅月
        monthZhiIndex = 2; // 寅
    } else if (month === 3 || (month === 4 && day < 5)) {
        // 惊蛰 to 清明: 卯月
        monthZhiIndex = 3; // 卯
    } else if (month === 4 || (month === 5 && day < 6)) {
        // 清明 to 立夏: 辰月
        monthZhiIndex = 4; // 辰
    } else if (month === 5 || (month === 6 && day < 6)) {
        // 立夏 to 芒种: 巳月
        monthZhiIndex = 5; // 巳
    } else if (month === 6 || (month === 7 && day < 7)) {
        // 芒种 to 小暑: 午月
        monthZhiIndex = 6; // 午
    } else if (month === 7 || (month === 8 && day < 8)) {
        // 小暑 to 立秋: 未月
        monthZhiIndex = 7; // 未
    } else if (month === 8 || (month === 9 && day < 8)) {
        // 立秋 to 白露: 申月
        monthZhiIndex = 8; // 申
    } else if (month === 9 || (month === 10 && day < 8)) {
        // 白露 to 寒露: 酉月
        monthZhiIndex = 9; // 酉
    } else if (month === 10 || (month === 11 && day < 7)) {
        // 寒露 to 立冬: 戌月
        monthZhiIndex = 10; // 戌
    } else if (month === 11 || (month === 12 && day < 7)) {
        // 立冬 to 大雪: 亥月
        monthZhiIndex = 11; // 亥
    } else {
        // 大雪 to 小寒: 子月
        monthZhiIndex = 0; // 子
    }

    // Determine which year's stem to use for month calculation
    // For 子月 and 丑月 (before 寅月): use astrological year
    // For 寅月 and later: use calendar year
    let yearForMonthCalc = year;
    if (monthZhiIndex <= 1) {
        // For 子月 or 丑月, check if we're before the year boundary
        if (month === 1 || (month === 2 && day <= 5)) {
            yearForMonthCalc = year - 1;
        }
    }

    // Year's heavenly stem affects month stem calculation
    const yearGanIndex = ((yearForMonthCalc - BASE_YEAR) % 60) % 10;

    // Month heavenly stem calculation based on year stem
    // 年上起月表: 甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚上，丁壬壬位顺行流，更有戊癸何方觅，甲寅之上好追求
    // 甲(0)/己(5)年: 寅月从丙开始 (丙=2)
    // 乙(1)/庚(6)年: 寅月从戊开始 (戊=4)
    // 丙(2)/辛(7)年: 寅月从庚开始 (庚=6)
    // 丁(3)/壬(8)年: 寅月从壬开始 (壬=8)
    // 戊(4)/癸(9)年: 寅月从甲开始 (甲=0)
    const monthGanStart = [2, 4, 6, 8, 0]; // 对应年干 0,1,2,3,4 (mod 5)
    const yearGanMod5 = yearGanIndex % 5;

    // Calculate month stem: start from 寅月 (monthZhiIndex=2)
    // Offset from 寅月
    const offsetFromYin = (monthZhiIndex - 2 + 12) % 12;
    const monthGanIndex = (monthGanStart[yearGanMod5] + offsetFromYin) % 10;

    return TIAN_GAN[monthGanIndex] + DI_ZHI[monthZhiIndex];
}

/**
 * Calculate day 干支
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @returns {string} Day stem-branch
 */
function getDayGanZhi(year, month, day) {
    // Use a known reference date for calculation
    // Reference: 2000-01-01 is 己未日
    // 己=5, 未=7, position in 60-day cycle: need (pos%10=5) and (pos%12=7), so pos=55

    const refDate = new Date(2000, 0, 1); // Jan 1, 2000
    const refDayOffset = 55; // 己未 position in 60-day cycle

    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate - refDate) / (1000 * 60 * 60 * 24));

    const dayOffset = (refDayOffset + daysDiff) % 60;
    const adjustedOffset = dayOffset >= 0 ? dayOffset : dayOffset + 60;

    const ganIndex = adjustedOffset % 10;
    const zhiIndex = adjustedOffset % 12;

    return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * Convert a date to complete 干支 (year, month, day)
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @returns {object} Object with year, month, day stem-branches
 */
function dateToGanZhi(dateString) {
    // Parse date correctly to avoid timezone issues
    // Split the string and parse as local date, not UTC
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const yearGZ = getYearGanZhi(year, month, day);
    const monthGZ = getMonthGanZhi(year, month, day);
    const dayGZ = getDayGanZhi(year, month, day);

    return {
        year: yearGZ,
        month: monthGZ,
        day: dayGZ,
        formatted: `${yearGZ} ${monthGZ} ${dayGZ}`
    };
}

/**
 * Calculate hour 干支 (时辰)
 * @param {number} year - Gregorian year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @returns {string} Hour stem-branch
 */
function getHourGanZhi(year, month, day, hour, minute) {
    // Convert time to 时辰 (double hour periods)
    // 子时 23:00-00:59, 丑时 01:00-02:59, etc.

    // Special case: 23:00-23:59 is the start of next day's 子时
    let hourZhiIndex;
    if (hour === 23) {
        hourZhiIndex = 0; // 子时
        // For calculating hour gan, we need next day's day gan
        const nextDay = new Date(year, month - 1, day);
        nextDay.setDate(nextDay.getDate() + 1);
        year = nextDay.getFullYear();
        month = nextDay.getMonth() + 1;
        day = nextDay.getDate();
    } else {
        // Calculate which 时辰 based on hour
        // 子(23-01) 丑(01-03) 寅(03-05) 卯(05-07) 辰(07-09) 巳(09-11)
        // 午(11-13) 未(13-15) 申(15-17) 酉(17-19) 戌(19-21) 亥(21-23)
        hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
    }

    // Get the day's heavenly stem to calculate hour stem
    const dayGZ = getDayGanZhi(year, month, day);
    const dayGanIndex = TIAN_GAN.indexOf(dayGZ[0]);

    // Hour heavenly stem calculation based on day stem
    // 日上起时表: 甲己日从甲开始，乙庚日从丙开始，丙辛日从戊开始，丁壬日从庚开始，戊癸日从壬开始
    // 甲(0)/己(5)日: 子时从甲开始 (甲=0)
    // 乙(1)/庚(6)日: 子时从丙开始 (丙=2)
    // 丙(2)/辛(7)日: 子时从戊开始 (戊=4)
    // 丁(3)/壬(8)日: 子时从庚开始 (庚=6)
    // 戊(4)/癸(9)日: 子时从壬开始 (壬=8)
    const hourGanStart = [0, 2, 4, 6, 8]; // 对应日干 0,1,2,3,4 (mod 5)
    const dayGanMod5 = dayGanIndex % 5;

    // Calculate hour stem: start from 子时 (hourZhiIndex=0)
    const hourGanIndex = (hourGanStart[dayGanMod5] + hourZhiIndex) % 10;

    return TIAN_GAN[hourGanIndex] + DI_ZHI[hourZhiIndex];
}

/**
 * Convert a datetime to complete 干支 (year, month, day, hour)
 * @param {string} dateString - Date in format "YYYY-MM-DD"
 * @param {string} timeString - Time in format "HH:MM" (optional)
 * @returns {object} Object with year, month, day, hour stem-branches
 */
function dateTimeToGanZhi(dateString, timeString) {
    // Parse date correctly to avoid timezone issues
    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    const yearGZ = getYearGanZhi(year, month, day);
    const monthGZ = getMonthGanZhi(year, month, day);
    const dayGZ = getDayGanZhi(year, month, day);

    let hourGZ = null;
    let formatted = `${yearGZ} ${monthGZ} ${dayGZ}`;

    if (timeString) {
        const timeParts = timeString.split(':');
        const hour = parseInt(timeParts[0], 10);
        const minute = parseInt(timeParts[1], 10);
        hourGZ = getHourGanZhi(year, month, day, hour, minute);
        formatted = `${yearGZ} ${monthGZ} ${dayGZ} ${hourGZ}`;
    }

    return {
        year: yearGZ,
        month: monthGZ,
        day: dayGZ,
        hour: hourGZ,
        formatted: formatted
    };
}

/**
 * Get 时辰 name from hour
 * @param {number} hour - Hour (0-23)
 * @returns {string} 时辰 name
 */
function getShichenName(hour) {
    const shichenNames = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时',
                          '午时', '未时', '申时', '酉时', '戌时', '亥时'];

    if (hour === 23) {
        return '子时';
    }
    const index = Math.floor((hour + 1) / 2) % 12;
    return shichenNames[index];
}

/**
 * Get current date and time's 干支
 * @returns {object} Object with year, month, day, hour stem-branches for now
 */
function getNowGanZhi() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return dateTimeToGanZhi(dateString, timeString);
}

/**
 * Get current date's 干支
 * @returns {object} Object with year, month, day stem-branches for today
 */
function getTodayGanZhi() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    return dateToGanZhi(dateString);
}
