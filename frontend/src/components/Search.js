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

  return (
    <div>
      <h1>Crypto Token Analysis</h1>
      <input
        type="text"
        placeholder="Search for a coin..."
        value={query}
        onChange={handleInputChange}
      />
      <ul>
        {suggestions.map((coin) => (
          <li key={coin.id} onClick={() => handleSuggestionClick(coin)}>
            {coin.name} ({coin.symbol})
          </li>
        ))}
      </ul>
      <button onClick={handleSearch}>Search</button>
      {coinData && (
        <div>
          <h2>{coinData.name} ({coinData.symbol})</h2>
          {coinData.market_cap_rank !== undefined && (
            <p>Market Cap Rank: {coinData.market_cap_rank}</p>
          )}
          {coinData.market_data?.current_price?.usd !== undefined && (
            <p>Current Price (USD): ${coinData.market_data.current_price.usd}</p>
          )}
          {coinData.market_data?.current_price?.btc !== undefined && (
            <p>Current Price (BTC): {coinData.market_data.current_price.btc} BTC</p>
          )}
          {coinData.links?.homepage && coinData.links.homepage.length > 0 && (
            <p>Homepage: <a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer">{coinData.links.homepage[0]}</a></p>
          )}
          {coinData.description?.en && <p>Description: {coinData.description.en}</p>}
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default Search;
