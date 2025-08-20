/**
 * Google Apps Script code for integrating Harris County FWS Rainfall Scraper with Google Sheets
 * 
 * Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Delete the default code and paste this code
 * 4. Save the project
 * 5. Update the API_BASE_URL to point to your deployed web service
 */

// Configuration - Update this URL to your deployed web service
const API_BASE_URL = 'https://your-app-name.herokuapp.com'; // Or your server URL
// For local testing: const API_BASE_URL = 'http://localhost:5000';

/**
 * Custom function to get rainfall data for a Harris County FWS location
 * Usage in Google Sheets: =getRainfall("590")
 * 
 * @param {string} locationId - The Harris County FWS location ID (default: "590")
 * @return {number} Total rainfall in inches for the past 7 complete days
 */
function getRainfall(locationId = "590") {
  try {
    // Make API request
    const url = `${API_BASE_URL}/rainfall?location=${locationId}`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    // Parse response
    const data = JSON.parse(response.getContentText());
    
    if (data.success) {
      return data.total_rainfall_inches;
    } else {
      throw new Error(data.error || 'Failed to fetch rainfall data');
    }
    
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    return `ERROR: ${error.message}`;
  }
}

/**
 * Custom function to get detailed rainfall information
 * Usage in Google Sheets: =getRainfallDetails("590")
 * 
 * @param {string} locationId - The Harris County FWS location ID
 * @return {Array} Array with [rainfall_amount, location_id, timestamp]
 */
function getRainfallDetails(locationId = "590") {
  try {
    const url = `${API_BASE_URL}/rainfall?location=${locationId}`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    const data = JSON.parse(response.getContentText());
    
    if (data.success) {
      return [
        data.total_rainfall_inches,
        data.location_id,
        new Date(data.timestamp)
      ];
    } else {
      return [`ERROR: ${data.error}`, locationId, new Date()];
    }
    
  } catch (error) {
    console.error('Error fetching rainfall details:', error);
    return [`ERROR: ${error.message}`, locationId, new Date()];
  }
}

/**
 * Function to update rainfall data in specific cells
 * This can be triggered manually or by a time-based trigger
 */
function updateRainfallData() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Update cell A1 with rainfall data for location 590
  const rainfall590 = getRainfall("590");
  sheet.getRange("A1").setValue(rainfall590);
  sheet.getRange("A2").setValue("Cole Creek @ Deihl Road (590)");
  sheet.getRange("A3").setValue(new Date());
  
  // You can add more locations here
  const rainfall520 = getRainfall("520");
  sheet.getRange("B1").setValue(rainfall520);
  sheet.getRange("B2").setValue("White Oak Bayou @ Heights Blvd (520)");
  sheet.getRange("B3").setValue(new Date());
  
  // Format the cells
  sheet.getRange("A1:B1").setNumberFormat("0.00");
  sheet.getRange("A3:B3").setNumberFormat("mm/dd/yyyy hh:mm:ss");
}

/**
 * Function to get available monitoring locations
 * @return {Array} Array of location information
 */
function getMonitoringLocations() {
  try {
    const url = `${API_BASE_URL}/locations`;
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    if (data.success) {
      const locations = data.locations;
      const result = [['Location ID', 'Description']]; // Header row
      
      for (const [id, description] of Object.entries(locations)) {
        result.push([id, description]);
      }
      
      return result;
    } else {
      return [['ERROR', 'Failed to fetch locations']];
    }
  } catch (error) {
    return [['ERROR', error.message]];
  }
}

/**
 * Function to create a comprehensive rainfall dashboard
 * Run this once to set up your sheet with multiple locations
 */
function createRainfallDashboard() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  // Clear existing content
  sheet.clear();
  
  // Set up headers
  const headers = [
    ['Location', 'ID', 'Rainfall (inches)', 'Last Updated'],
    ['Cole Creek @ Deihl Road', '590', '=getRainfall("590")', '=NOW()'],
    ['White Oak Bayou @ Heights Blvd', '520', '=getRainfall("520")', '=NOW()'],
    ['Brays Bayou @ Stella Link Road', '430', '=getRainfall("430")', '=NOW()'],
    ['Brays Bayou @ Rice Avenue', '440', '=getRainfall("440")', '=NOW()'],
    ['White Oak Bayou @ Lakeview Drive', '550', '=getRainfall("550")', '=NOW()']
  ];
  
  // Write headers and data
  const range = sheet.getRange(1, 1, headers.length, headers[0].length);
  range.setValues(headers);
  
  // Format the sheet
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  sheet.getRange(1, 3, headers.length, 1).setNumberFormat('0.00');
  sheet.getRange(1, 4, headers.length, 1).setNumberFormat('mm/dd/yyyy hh:mm:ss');
  
  // Auto-resize columns
  sheet.autoResizeColumns(1, 4);
  
  // Add a refresh button (optional)
  sheet.getRange("F1").setValue("Click to Refresh");
  sheet.getRange("F2").setFormula('=updateRainfallData()');
}

/**
 * Function to set up automatic refresh every hour
 * Run this once to enable automatic updates
 */
function setupAutomaticRefresh() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger to run every hour
  ScriptApp.newTrigger('updateRainfallData')
    .timeBased()
    .everyHours(1)
    .create();
    
  console.log('Automatic refresh set up to run every hour');
}

/**
 * Test function to verify the API connection
 */
function testConnection() {
  try {
    const result = getRainfall("590");
    console.log('Test result:', result);
    
    if (typeof result === 'number') {
      console.log('✅ Connection successful! Rainfall:', result, 'inches');
    } else {
      console.log('❌ Connection failed:', result);
    }
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}
