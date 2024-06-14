import React, { useState } from 'react';
import axios from 'axios';

const InputForm = ({ onDataFetch }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/getTokenData', { address });
      onDataFetch(response.data);
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter token contract address"
      />
      <button type="submit">Fetch Data</button>
    </form>
  );
};

export default InputForm;
