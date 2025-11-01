/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Format date to Vietnamese month-year format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date (e.g., "Tháng 11/2024")
 */
export const formatMonthYear = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `Tháng ${month}/${year}`;
};

/**
 * Format date to short Vietnamese month format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date (e.g., "T11/24")
 */
export const formatShortMonth = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear().toString().slice(-2);
  return `T${month}/${year}`;
};

/**
 * Format date to Vietnamese date format
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date (e.g., "01/11/2024")
 */
export const formatVietnameseDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

/**
 * Format date to relative time
 * @param {string|Date} date - Date to format
 * @returns {string} - Relative time (e.g., "2 ngày trước")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now - targetDate;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? 'Vừa xong' : `${diffInMinutes} phút trước`;
    }
    return `${diffInHours} giờ trước`;
  } else if (diffInDays === 1) {
    return 'Hôm qua';
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} tuần trước`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} năm trước`;
  }
};

/**
 * Group daily data by month
 * @param {Array} dailyData - Array of daily data with date and count
 * @returns {Array} - Array of monthly data
 */
export const groupDataByMonth = (dailyData) => {
  if (!dailyData || dailyData.length === 0) {
    return [];
  }
  
  const monthlyData = {};
  
  dailyData.forEach(item => {
    // Ensure date is a Date object
    const date = new Date(item.date);
    
    // Skip invalid dates
    if (isNaN(date.getTime())) {
      console.warn('Invalid date found:', item.date);
      return;
    }
    
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`,
        count: 0
      };
    }
    
    monthlyData[monthKey].count += (item.count || 0);
  });
  
  return Object.values(monthlyData).sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Generate month labels for the last N months
 * @param {number} months - Number of months to generate
 * @returns {Array} - Array of month labels
 */
export const generateMonthLabels = (months = 6) => {
  const labels = [];
  const now = new Date();
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    labels.push({
      date: dateString,
      label: formatShortMonth(date),
      fullLabel: formatMonthYear(date)
    });
  }
  
  return labels;
};

/**
 * Fill missing months with zero data
 * @param {Array} data - Existing data array
 * @param {number} months - Number of months to fill
 * @returns {Array} - Complete data array with filled months
 */
export const fillMissingMonths = (data, months = 6) => {
  if (!data || data.length === 0) {
    return generateMonthLabels(months).map(monthInfo => ({
      date: monthInfo.date,
      count: 0
    }));
  }
  
  // Find the date range from actual data
  const dates = data.map(item => new Date(item.date)).filter(date => !isNaN(date.getTime()));
  if (dates.length === 0) {
    return generateMonthLabels(months).map(monthInfo => ({
      date: monthInfo.date,
      count: 0
    }));
  }
  
  // Get the latest date from data and work backwards
  const latestDate = new Date(Math.max(...dates));
  const monthLabels = [];
  
  // Generate labels based on actual data range
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    monthLabels.push({
      date: dateString,
      label: formatShortMonth(date),
      fullLabel: formatMonthYear(date)
    });
  }
  
  const dataMap = new Map();
  
  // Create map of existing data
  data.forEach(item => {
    // Ensure date is a Date object
    const date = new Date(item.date);
    
    // Skip invalid dates
    if (isNaN(date.getTime())) {
      console.warn('Invalid date found in fillMissingMonths:', item.date);
      return;
    }
    
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dataMap.set(key, {
      ...item,
      date: item.date // Keep original date format
    });
  });
  
  // Fill missing months
  return monthLabels.map(monthInfo => {
    // monthInfo.date is now a string like "2024-10-01"
    const key = monthInfo.date.substring(0, 7); // Get "2024-10" from "2024-10-01"
    return dataMap.get(key) || {
      date: monthInfo.date,
      count: 0
    };
  });
};
