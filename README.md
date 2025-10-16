# OpenBB MVP - Financial Data Platform

A simplified MVP version of OpenBB Platform that demonstrates core functionality for fetching and displaying stock market data.

## Features

- 📊 Fetch historical stock prices
- 📈 Simple web interface for data visualization
- 🔍 Search for any stock ticker symbol
- 📱 Clean and responsive UI

## Tech Stack

- **Backend**: Python 3.9+ with Flask
- **Data Source**: yfinance (Yahoo Finance API)
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: Modern CSS with responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gitmvp-com/openbb-mvp.git
cd openbb-mvp
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the Flask server:
```bash
python app.py
```

2. Open your browser and navigate to:
```
http://localhost:5000
```

3. Enter a stock ticker symbol (e.g., AAPL, TSLA, MSFT) and click "Get Data" to fetch historical prices.

## API Endpoints

### Get Historical Stock Data
```
GET /api/stock/<ticker>
```

Query Parameters:
- `period` (optional): Time period for data (default: 1mo)
  - Valid values: 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max

Example:
```bash
curl http://localhost:5000/api/stock/AAPL?period=1mo
```

## Project Structure

```
openbb-mvp/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── static/
│   ├── css/
│   │   └── style.css  # Styling
│   └── js/
│       └── main.js    # Frontend logic
├── templates/
│   └── index.html     # Main page template
└── README.md          # This file
```

## Comparison with OpenBB Platform

This MVP is a simplified version focusing on the core feature:

| Feature | OpenBB Platform | OpenBB MVP |
|---------|----------------|------------|
| Data Sources | 100+ providers | Yahoo Finance |
| Asset Classes | Equity, Options, Crypto, Forex, etc. | Equity only |
| Interface | Python SDK, CLI, API | Web UI + REST API |
| Authentication | Full auth system | None (MVP) |
| Advanced Features | AI agents, custom backends | None |
| Installation | pip install openbb[all] | Simple pip install |

## Future Enhancements

- Add more data providers
- Support for cryptocurrency data
- Advanced charting with interactive graphs
- Export data to CSV/Excel
- Real-time price updates
- User authentication and saved watchlists

## License

MIT License - Feel free to use this for learning and experimentation.

## Disclaimer

This is an educational MVP project. For production use, please refer to the official [OpenBB Platform](https://github.com/OpenBB-finance/OpenBB).

Trading in financial instruments involves high risks. This tool is for informational purposes only and should not be used as the sole basis for investment decisions.
