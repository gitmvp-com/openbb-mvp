// DOM Elements
const tickerInput = document.getElementById('tickerInput');
const periodSelect = document.getElementById('periodSelect');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');

// Event Listeners
searchBtn.addEventListener('click', fetchStockData);
tickerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchStockData();
    }
});

// Main function to fetch stock data
async function fetchStockData() {
    const ticker = tickerInput.value.trim().toUpperCase();
    const period = periodSelect.value;

    // Validation
    if (!ticker) {
        showError('Please enter a stock ticker symbol');
        return;
    }

    // Clear previous error
    hideError();

    // Show loading state
    showLoading();

    try {
        const response = await fetch(`/api/stock/${ticker}?period=${period}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch stock data');
        }

        // Hide loading and display results
        hideLoading();
        displayResults(data);
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Display results
function displayResults(data) {
    // Update stock header
    document.getElementById('stockName').textContent = data.name;
    document.getElementById('stockTicker').textContent = data.ticker;

    // Update summary cards
    if (data.summary) {
        const currencySymbol = data.currency === 'USD' ? '$' : data.currency + ' ';
        
        document.getElementById('currentPrice').textContent = currencySymbol + data.summary.current_price.toFixed(2);
        
        const change = data.summary.change;
        const changePercent = data.summary.change_percent;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changeSign = change >= 0 ? '+' : '';
        
        const changeElement = document.getElementById('priceChange');
        changeElement.textContent = changeSign + currencySymbol + change.toFixed(2);
        changeElement.className = 'card-value ' + changeClass;
        
        const percentElement = document.getElementById('percentChange');
        percentElement.textContent = changeSign + changePercent.toFixed(2) + '%';
        percentElement.className = 'card-value ' + changeClass;
        
        document.getElementById('highPrice').textContent = currencySymbol + data.summary.highest.toFixed(2);
        document.getElementById('lowPrice').textContent = currencySymbol + data.summary.lowest.toFixed(2);
        document.getElementById('avgPrice').textContent = currencySymbol + data.summary.average.toFixed(2);
    }

    // Populate table
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    // Reverse to show most recent first
    const reversedData = [...data.data].reverse();

    reversedData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.date}</td>
            <td>$${row.open.toFixed(2)}</td>
            <td>$${row.high.toFixed(2)}</td>
            <td>$${row.low.toFixed(2)}</td>
            <td>$${row.close.toFixed(2)}</td>
            <td>${formatVolume(row.volume)}</td>
        `;
        tableBody.appendChild(tr);
    });

    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Utility functions
function showLoading() {
    loadingSpinner.style.display = 'block';
    resultsSection.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
}

function hideError() {
    errorMessage.classList.remove('show');
}

function formatVolume(volume) {
    if (volume >= 1000000000) {
        return (volume / 1000000000).toFixed(2) + 'B';
    } else if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
}

// Focus on input when page loads
window.addEventListener('load', () => {
    tickerInput.focus();
});
