/**
 * SIMPLE Google Apps Script Integration (No Web Service Required)
 * 
 * This approach recreates the rainfall scraping logic directly in Google Apps Script
 * so you don't need to deploy a separate web service.
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this code
 * 4. Save the project
 * 5. Use =getRainfallSimple("590") in your sheet cells
 */

/**
 * Simple function to get rainfall data directly from Harris County FWS
 * This recreates the Python scraper logic in JavaScript
 * 
 * @param {string} locationId - The Harris County FWS location ID (default: "590")
 * @return {number} Total rainfall in inches for the past 7 complete days
 */
function getRainfallSimple(locationId = "590") {
  try {
    // Construct the URL (similar to Python scraper)
    const currentDate = new Date();
    const formattedDate = Utilities.formatDate(currentDate, "America/Chicago", "MM/dd/yyyy hh:mm a");
    const encodedDate = encodeURIComponent(formattedDate);
    
    const url = `https://www.harriscountyfws.org/GageDetail/Index/${locationId}?From=${encodedDate}&span=1%20Month&r=1&v=rainfall&selIdx=1`;
    
    // Fetch the HTML content
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) {
      throw new Error(`HTTP ${response.getResponseCode()}: ${response.getContentText()}`);
    }
    
    const htmlContent = response.getContentText();
    
    // Extract rainfall data using regex (similar to Python approach)
    const rainfallData = extractRainfallData(htmlContent);
    
    if (rainfallData.length === 0) {
      throw new Error('No rainfall data found');
    }
    
    // Filter for the 7 complete days prior to today
    const filteredData = filterLast7Days(rainfallData);
    
    // Calculate total rainfall
    const totalRainfall = filteredData.reduce((sum, record) => sum + record.rainfall, 0);
    
    return Math.round(totalRainfall * 100) / 100; // Round to 2 decimal places
    
  } catch (error) {
    console.error('Error in getRainfallSimple:', error);
    return `ERROR: ${error.message}`;
  }
}

/**
 * Extract rainfall data from HTML content
 * @param {string} htmlContent - The HTML content from the FWS website
 * @return {Array} Array of rainfall records with date and amount
 */
function extractRainfallData(htmlContent) {
  const rainfallData = [];
  
  try {
    // Look for patterns like "7/21/2025 12:00 AM7/22/2025 12:00 AM0.00""
    const pattern = /(\d{1,2}\/\d{1,2}\/\d{4})\s+12:00\s+AM.*?(\d+\.\d+)"/g;
    let match;
    
    const seenDates = new Set(); // To avoid duplicates
    
    while ((match = pattern.exec(htmlContent)) !== null) {
      const dateStr = match[1];
      const rainfallStr = match[2];
      
      try {
        const date = new Date(dateStr);
        const rainfall = parseFloat(rainfallStr);
        
        if (!isNaN(rainfall) && !seenDates.has(dateStr)) {
          rainfallData.push({
            date: date,
            rainfall: rainfall
          });
          seenDates.add(dateStr);
        }
      } catch (e) {
        console.warn('Error parsing date/rainfall:', e);
      }
    }
    
    // Sort by date (most recent first)
    rainfallData.sort((a, b) => b.date - a.date);
    
  } catch (error) {
    console.error('Error extracting rainfall data:', error);
  }
  
  return rainfallData;
}

/**
 * Filter rainfall data for the 7 complete days prior to today
 * @param {Array} rainfallData - Array of rainfall records
 * @return {Array} Filtered array for the past 7 complete days
 */
function filterLast7Days(rainfallData) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  return rainfallData.filter(record => {
    const recordDate = new Date(record.date);
    recordDate.setHours(0, 0, 0, 0);
    
    return recordDate >= sevenDaysAgo && recordDate < today;
  });
}

/**
 * Get rainfall data with details (amount, location, timestamp)
 * @param {string} locationId - The location ID
 * @return {Array} [rainfall, location, timestamp]
 */
function getRainfallDetails(locationId = "590") {
  const rainfall = getRainfallSimple(locationId);
  const locationName = getLocationName(locationId);
  const timestamp = new Date();
  
  return [rainfall, locationName, timestamp];
}

/**
 * Get location name from ID
 * @param {string} locationId - The location ID
 * @return {string} Location description
 */
function getLocationName(locationId) {
  const locations = {
    '520': 'White Oak Bayou @ Heights Boulevard',
    '530': 'White Oak Bayou @ Ella Boulevard',
    '540': 'White Oak Bayou @ Alabonson Road',
    '550': 'White Oak Bayou @ Lakeview Drive',
    '590': 'Cole Creek @ Deihl Road',
    '430': 'Brays Bayou @ Stella Link Road',
    '440': 'Brays Bayou @ Rice Avenue',
    '460': 'Brays Bayou @ Gessner Road',
    '480': 'Keegans Bayou @ Roark Road',
    '490': 'Keegans Bayou @ Keegan Road'
  };
  
  return locations[locationId] || `Location ${locationId}`;
}

/**
 * Create a simple rainfall dashboard
 */
function createSimpleDashboard() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Clear and set up headers
  sheet.clear();
  
  const data = [
    ['Location', 'ID', 'Rainfall (7 days)', 'Last Updated'],
    ['Cole Creek @ Deihl Road', '590', '=getRainfallSimple("590")', '=NOW()'],
    ['White Oak Bayou @ Heights Blvd', '520', '=getRainfallSimple("520")', '=NOW()'],
    ['Brays Bayou @ Stella Link Road', '430', '=getRainfallSimple("430")', '=NOW()'],
    ['White Oak Bayou @ Lakeview Drive', '550', '=getRainfallSimple("550")', '=NOW()']
  ];
  
  const range = sheet.getRange(1, 1, data.length, data[0].length);
  range.setValues(data);
  
  // Format
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  sheet.getRange(2, 3, data.length - 1, 1).setNumberFormat('0.00');
  sheet.getRange(2, 4, data.length - 1, 1).setNumberFormat('mm/dd/yyyy hh:mm:ss');
  
  sheet.autoResizeColumns(1, 4);
}

/**
 * Test function
 */
function testRainfallFunction() {
  const result = getRainfallSimple("590");
  console.log('Test result for location 590:', result);
  
  if (typeof result === 'number') {
    console.log('✅ Success! Rainfall:', result, 'inches');
  } else {
    console.log('❌ Failed:', result);
  }
}
