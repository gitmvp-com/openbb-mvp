from flask import Flask, render_template, jsonify, request
import yfinance as yf
import pandas as pd
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    """Render the main page"""
    return render_template('index.html')

@app.route('/api/stock/<ticker>')
def get_stock_data(ticker):
    """
    Fetch historical stock data for a given ticker
    
    Args:
        ticker (str): Stock ticker symbol (e.g., AAPL, TSLA)
    
    Query Parameters:
        period (str): Time period for data (default: 1mo)
                     Valid values: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
    
    Returns:
        JSON response with stock data or error message
    """
    try:
        # Get period from query parameters, default to 1 month
        period = request.args.get('period', '1mo')
        
        # Validate period
        valid_periods = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max']
        if period not in valid_periods:
            return jsonify({
                'error': f'Invalid period. Valid values are: {", ".join(valid_periods)}'
            }), 400
        
        # Fetch stock data
        stock = yf.Ticker(ticker.upper())
        hist = stock.history(period=period)
        
        if hist.empty:
            return jsonify({
                'error': f'No data found for ticker: {ticker.upper()}. Please check the symbol and try again.'
            }), 404
        
        # Get stock info
        info = stock.info
        
        # Prepare the response data
        data = {
            'ticker': ticker.upper(),
            'name': info.get('longName', ticker.upper()),
            'currency': info.get('currency', 'USD'),
            'period': period,
            'data': []
        }
        
        # Convert historical data to list of dictionaries
        for date, row in hist.iterrows():
            data['data'].append({
                'date': date.strftime('%Y-%m-%d'),
                'open': round(row['Open'], 2),
                'high': round(row['High'], 2),
                'low': round(row['Low'], 2),
                'close': round(row['Close'], 2),
                'volume': int(row['Volume'])
            })
        
        # Add summary statistics
        if len(data['data']) > 0:
            closes = [d['close'] for d in data['data']]
            data['summary'] = {
                'current_price': closes[-1],
                'highest': max(closes),
                'lowest': min(closes),
                'average': round(sum(closes) / len(closes), 2),
                'change': round(closes[-1] - closes[0], 2),
                'change_percent': round(((closes[-1] - closes[0]) / closes[0]) * 100, 2)
            }
        
        return jsonify(data)
    
    except Exception as e:
        return jsonify({
            'error': f'An error occurred: {str(e)}'
        }), 500

@app.route('/api/search/<query>')
def search_stocks(query):
    """
    Search for stocks (simplified version - just validates ticker)
    
    Args:
        query (str): Search query or ticker symbol
    
    Returns:
        JSON response with validation result
    """
    try:
        stock = yf.Ticker(query.upper())
        info = stock.info
        
        if 'symbol' in info or 'longName' in info:
            return jsonify({
                'valid': True,
                'ticker': query.upper(),
                'name': info.get('longName', query.upper())
            })
        else:
            return jsonify({
                'valid': False,
                'message': 'Ticker not found'
            }), 404
    
    except Exception as e:
        return jsonify({
            'valid': False,
            'message': str(e)
        }), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
