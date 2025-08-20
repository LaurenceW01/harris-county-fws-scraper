#!/usr/bin/env python3
"""
Simple web service wrapper for the Harris County FWS Rainfall Scraper
This creates a REST API that Google Sheets can call via UrlFetchApp
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from rainfall_scraper import HarrisCountyRainfallScraper
import logging

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for Google Sheets access

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/rainfall', methods=['GET'])
def get_rainfall():
    """
    Get rainfall data for a specified location.
    
    Query parameters:
    - location: Location ID (default: 590)
    
    Returns JSON with rainfall data
    """
    try:
        # Get location ID from query parameter
        location_id = request.args.get('location', '590')
        
        logger.info(f"Fetching rainfall data for location {location_id}")
        
        # Create scraper and get rainfall data
        scraper = HarrisCountyRainfallScraper()
        total_rainfall = scraper.scrape_rainfall_totals(location_id)
        
        if total_rainfall is not None:
            response = {
                'success': True,
                'location_id': location_id,
                'total_rainfall_inches': round(total_rainfall, 2),
                'period': '7 complete days prior to today',
                'timestamp': scraper.get_current_timestamp()
            }
            logger.info(f"Successfully retrieved rainfall data: {total_rainfall} inches")
        else:
            response = {
                'success': False,
                'error': 'Failed to retrieve rainfall data',
                'location_id': location_id
            }
            logger.error("Failed to retrieve rainfall data")
        
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error in get_rainfall: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Harris County FWS Rainfall Scraper API'
    })

@app.route('/locations', methods=['GET'])
def get_locations():
    """
    Return a list of common Harris County FWS monitoring locations
    """
    locations = {
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
    }
    
    return jsonify({
        'success': True,
        'locations': locations
    })

if __name__ == '__main__':
    # Run the web service
    # For production, use a proper WSGI server like Gunicorn
    app.run(host='0.0.0.0', port=5000, debug=False)
