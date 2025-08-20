# Changelog

All notable changes to the Harris County FWS Rainfall Scraper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-20

### Added
- Initial release of Harris County FWS Rainfall Scraper
- Core scraping functionality for rainfall data extraction
- Support for multiple Harris County FWS monitoring locations
- Calculation of 7-day rainfall totals (excluding current day partial data)
- Multiple data extraction methods for robustness:
  - JSON data parsing from embedded scripts
  - DevExpress grid control parsing
  - HTML table parsing
  - Text pattern matching
- Comprehensive error handling and logging
- Data deduplication to prevent double-counting
- Google Sheets integration with Apps Script
- Web service API for remote access
- Virtual environment setup with requirements.txt
- Complete documentation and setup instructions

### Features
- **Accurate rainfall calculations**: Sums rainfall for 7 complete days prior to today
- **Robust data extraction**: Multiple parsing methods ensure reliability
- **Google Sheets integration**: Custom functions for spreadsheet use
- **Web API**: RESTful service for external applications
- **Easy setup**: Virtual environment and dependency management
- **Comprehensive docs**: README with usage examples and troubleshooting

### Locations Supported
- 590: Cole Creek @ Deihl Road (default)
- 520: White Oak Bayou @ Heights Boulevard
- 530: White Oak Bayou @ Ella Boulevard
- 540: White Oak Bayou @ Alabonson Road
- 550: White Oak Bayou @ Lakeview Drive
- 430: Brays Bayou @ Stella Link Road
- 440: Brays Bayou @ Rice Avenue
- 460: Brays Bayou @ Gessner Road
- 480: Keegans Bayou @ Roark Road
- 490: Keegans Bayou @ Keegan Road

### Technical Details
- Python 3.7+ compatibility
- BeautifulSoup4 for HTML parsing
- Requests library for HTTP communications
- Flask for web service functionality
- Google Apps Script for spreadsheet integration
- Comprehensive test coverage and validation
