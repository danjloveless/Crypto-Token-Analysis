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
        value={query}
        onChange={handleInputChange}
        placeholder="Search for a coin..."
      />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((coin) => (
            <li key={coin.id} onClick={() => handleSuggestionClick(coin)}>
              {coin.name} ({coin.symbol})
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleSearch}>Search</button>
      {coinData && (
        <div>
          <h2>{coinData.name}</h2>
          <p>Symbol: {coinData.symbol}</p>
          <p>Platform: {coinData.asset_platform_id}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default Search;
