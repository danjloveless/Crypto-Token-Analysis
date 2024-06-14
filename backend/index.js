require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dbFile = path.join(__dirname, 'coinData.db');
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

app.post('/api/getTokenData', async (req, res) => {
  const { id } = req.body;
  console.log(`Received request to fetch token data for coin ID: ${id}`);

  db.get('SELECT * FROM coin WHERE id = ?', [id], async (err, coin) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!coin) {
      console.log('Coin not found in the database.');
      return res.status(404).json({ error: 'Coin not found' });
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coin.id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
      },
    };

    console.log(`Fetching token data from CoinGecko for coin ID: ${id}`);
    console.log(`URL: ${url}`);

    try {
      const response = await fetch(url, options);
      const text = await response.text();

      if (!response.ok) {
        console.error('Error fetching token data:', text);
        return res.status(response.status).json({ error: 'Error fetching token data' });
      }

      const data = JSON.parse(text);
      console.log('Fetched data:', data);
      res.json(data);
    } catch (error) {
      console.error('Error parsing or fetching token data:', error);
      res.status(500).json({ error: 'Error fetching token data' });
    }
  });
});

app.get('/api/searchCoins', (req, res) => {
  const { query } = req.query;

  db.all(
    'SELECT id, symbol, name FROM coin WHERE name LIKE ? OR symbol LIKE ?',
    [`%${query}%`, `%${query}%`],
    (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows);
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
