import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Search() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [coinData, setCoinData] = useState(null);

  useEffect(() => {
    if (query.length > 2) {
      axios.get('http://localhost:5000/api/searchCoins', {
        params: { query },
      })
      .then(response => {
        setSuggestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
      });
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSuggestionClick = (coin) => {
    setSelectedCoin(coin);
    setQuery(coin.name);
    setSuggestions([]);
  };

  const handleSearch = async () => {
    if (selectedCoin) {
      try {
        const response = await axios.post('http://localhost:5000/api/getTokenData', {
          id: selectedCoin.id,
        });
        setCoinData(response.data);
      } catch (error) {
        console.error('Error fetching coin data:', error);
      }
    }
  };

  const handleDownloadJson = () => {
    if (coinData) {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(coinData, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${selectedCoin.name}.json`);
      document.body.appendChild(downloadAnchorNode); // required for firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Crypto Token Analysis</h1>
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search for a coin..."
            value={query}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-800 rounded-lg mt-2 shadow-lg">
              {suggestions.map((coin) => (
                <li
                  key={coin.id}
                  onClick={() => handleSuggestionClick(coin)}
                  className="p-4 hover:bg-gray-700 cursor-pointer"
                >
                  {coin.name} ({coin.symbol})
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Search
        </button>
        {coinData && (
          <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">{coinData.name} ({coinData.symbol})</h2>
            {coinData.market_cap_rank !== undefined && (
              <p className="mt-2">Market Cap Rank: {coinData.market_cap_rank}</p>
            )}
            {coinData.market_data?.current_price?.usd !== undefined && (
              <p className="mt-2">Current Price (USD): ${coinData.market_data.current_price.usd}</p>
            )}
            {coinData.market_data?.current_price?.btc !== undefined && (
              <p className="mt-2">Current Price (BTC): {coinData.market_data.current_price.btc} BTC</p>
            )}
            {coinData.links?.homepage && coinData.links.homepage.length > 0 && (
              <p className="mt-2">
                Homepage: <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{coinData.links.homepage[0]}</a>
              </p>
            )}
            {coinData.description?.en && <p className="mt-2">Description: {coinData.description.en}</p>}
            <button
              onClick={handleDownloadJson}
              className="mt-4 px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700"
            >
              Download JSON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
