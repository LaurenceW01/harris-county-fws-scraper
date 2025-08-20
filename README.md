# Harris County FWS Rainfall Scraper

[![Python 3.7+](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Python scraper that extracts rainfall data from the Harris County Flood Warning System and calculates the total rainfall over the past 7 complete days for a specified monitoring location. Includes Google Sheets integration for easy data access and visualization.

## Features

- Scrapes rainfall data from Harris County FWS website
- Extracts data from DevExpress grid controls and HTML tables
- Calculates total rainfall for the past 7 complete days (excludes current day partial data)
- Handles multiple data extraction methods for robustness
- Google Sheets integration with custom functions
- Web API service for external applications
- Comprehensive error handling and logging
- Clean and well-documented code

## Requirements

- Python 3.7+
- Virtual environment (recommended)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/harris-county-fws-scraper.git
   cd harris-county-fws-scraper
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows (Git Bash/PowerShell):
   source venv/Scripts/activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Basic Usage

Run the scraper with default settings (location 590 - Cole Creek @ Deihl Road):

```bash
python rainfall_scraper.py
```

### Programmatic Usage

```python
from rainfall_scraper import HarrisCountyRainfallScraper

# Create scraper instance
scraper = HarrisCountyRainfallScraper()

# Get 7-day rainfall total for default location (590)
total_rainfall = scraper.scrape_rainfall_totals()

if total_rainfall is not None:
    print(f"Total rainfall in the past 7 days: {total_rainfall:.2f} inches")
else:
    print("Failed to retrieve rainfall data")

# Get rainfall data for a different location
total_rainfall = scraper.scrape_rainfall_totals(location_id="520")  # White Oak Bayou @ Heights Boulevard
```

## How It Works

1. **URL Construction**: Builds a properly formatted URL using the current date and 1-month span
2. **Data Extraction**: Uses multiple methods to extract rainfall data:
   - JSON data embedded in HTML
   - DevExpress grid controls
   - Standard HTML tables
   - Text pattern matching
3. **Date Filtering**: Filters data to include only the last 7 days
4. **Summation**: Calculates the total rainfall amount

## Monitoring Locations

The scraper defaults to location ID `590` (Cole Creek @ Deihl Road), but you can specify other Harris County FWS monitoring locations. Some examples:

- `520`: White Oak Bayou @ Heights Boulevard
- `430`: Brays Bayou @ Stella Link Road
- `460`: Brays Bayou @ Gessner Road
- `550`: White Oak Bayou @ Lakeview Drive

Find more location IDs by browsing the [Harris County FWS website](https://www.harriscountyfws.org/).

## Data Format

The scraper extracts rainfall data in the following format:
- **Reading Date From**: Start date/time of measurement period
- **Reading Date To**: End date/time of measurement period  
- **Rain**: Rainfall amount in inches

## Error Handling

The scraper includes comprehensive error handling for:
- Network connection issues
- HTML parsing errors
- Data format changes
- Missing or invalid data
- Date parsing failures

## Debugging

For debugging purposes, you can use the debug script:

```bash
python test_scraper_debug.py
```

This will provide detailed information about:
- HTML structure analysis
- Table detection
- Data extraction methods
- Pattern matching results

## Dependencies

- **requests**: HTTP library for web scraping
- **beautifulsoup4**: HTML parsing and navigation
- **lxml**: XML/HTML parser backend
- **python-dateutil**: Enhanced date parsing

## Google Sheets Integration

### Setup Instructions:
1. Open your Google Sheet
2. Go to Extensions > Apps Script  
3. Delete the default code and paste the contents of `google_sheets_simple.js`
4. Save the project
5. Use these formulas in your sheet:

```
=getRainfallSimple("590")          // Cole Creek @ Deihl Road
=getRainfallSimple("520")          // White Oak Bayou @ Heights Blvd
=getRainfallDetails("590")         // [rainfall, location, timestamp]
```

### Quick Dashboard:
Run the `createSimpleDashboard()` function to automatically create a formatted dashboard.

## Output Example

```
Harris County FWS Rainfall Scraper
========================================
Fetching rainfall data for location 590 (Cole Creek @ Deihl Road)
Calculating total rainfall for the 7 complete days prior to today...

Fetching data from: https://www.harriscountyfws.org/GageDetail/Index/590?From=08/20/2025%2010%3A42%20AM&span=1%20Month&r=1&v=rainfall&selIdx=1

Found 7 rainfall records for the 7 complete days prior to today
Total rainfall for the 7 complete days prior to today: 0.48 inches
```

## Limitations

- Depends on the Harris County FWS website structure
- Requires internet connection
- Data availability depends on the monitoring station status
- Limited to locations within Harris County, Texas

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational and research purposes. Please respect the Harris County FWS website's terms of service and use responsibly.

## Disclaimer

This scraper is not affiliated with Harris County or the Harris County Flood Warning System. The data retrieved is for informational purposes only and should not be used for critical decision-making without verification from official sources.

## Support

If you encounter issues or have questions:
1. Check that your virtual environment is activated
2. Ensure all dependencies are installed
3. Verify your internet connection
4. Check if the Harris County FWS website is accessible

For technical issues, please review the error messages and check the debug output for more detailed information.
