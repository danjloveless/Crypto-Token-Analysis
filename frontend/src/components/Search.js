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
          <p>Market Cap Rank: {coinData.market_cap_rank}</p>
          <p>Current Price (USD): {coinData.market_data.current_price.usd}</p>
          <p>Homepage: <a href={coinData.links.homepage[0]}>{coinData.links.homepage[0]}</a></p>
          <p>Description: {coinData.description.en}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default Search;
