require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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
  console.log(`Received request to fetch token data for id: ${id}`);

  db.get(
    'SELECT * FROM coin WHERE id = ?',
    [id],
    async (err, coin) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!coin) {
        console.log('Coin not found in the database.');
        return res.status(404).json({ error: 'Coin not found' });
      }

      const url = `https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false`;

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': process.env.COINGECKO_API_KEY,
        },
      };

      console.log(`Fetching token data from CoinGecko for id: ${id}`);
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

        // Filter data for USD and BTC
        const filteredData = {
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          description: data.description,
          links: data.links,
          market_data: {
            current_price: {
              usd: data.market_data.current_price.usd,
              btc: data.market_data.current_price.btc,
            },
            ath: {
              usd: data.market_data.ath.usd,
              btc: data.market_data.ath.btc,
            },
            ath_change_percentage: {
              usd: data.market_data.ath_change_percentage.usd,
              btc: data.market_data.ath_change_percentage.btc,
            },
            ath_date: {
              usd: data.market_data.ath_date.usd,
              btc: data.market_data.ath_date.btc,
            },
            atl: {
              usd: data.market_data.atl.usd,
              btc: data.market_data.atl.btc,
            },
            atl_change_percentage: {
              usd: data.market_data.atl_change_percentage.usd,
              btc: data.market_data.atl_change_percentage.btc,
            },
            atl_date: {
              usd: data.market_data.atl_date.usd,
              btc: data.market_data.atl_date.btc,
            },
            market_cap: {
              usd: data.market_data.market_cap.usd,
              btc: data.market_data.market_cap.btc,
            },
            total_volume: {
              usd: data.market_data.total_volume.usd,
              btc: data.market_data.total_volume.btc,
            },
            high_24h: {
              usd: data.market_data.high_24h.usd,
              btc: data.market_data.high_24h.btc,
            },
            low_24h: {
              usd: data.market_data.low_24h.usd,
              btc: data.market_data.low_24h.btc,
            },
            price_change_24h: data.market_data.price_change_24h,
            price_change_percentage_24h: data.market_data.price_change_percentage_24h,
            price_change_percentage_7d: data.market_data.price_change_percentage_7d,
            price_change_percentage_14d: data.market_data.price_change_percentage_14d,
            price_change_percentage_30d: data.market_data.price_change_percentage_30d,
            price_change_percentage_60d: data.market_data.price_change_percentage_60d,
            price_change_percentage_200d: data.market_data.price_change_percentage_200d,
            price_change_percentage_1y: data.market_data.price_change_percentage_1y,
            market_cap_change_24h: data.market_data.market_cap_change_24h,
            market_cap_change_percentage_24h: data.market_data.market_cap_change_percentage_24h,
          },
          tickers: data.tickers.filter(ticker => ticker.target === 'USD' || ticker.target === 'BTC')
        };

        // Save filtered data to a JSON file
        const filePath = path.join(__dirname, 'fetchedData', `${id}.json`);
        fs.writeFile(filePath, JSON.stringify(filteredData, null, 2), (err) => {
          if (err) {
            console.error('Error saving data to file:', err);
            return res.status(500).json({ error: 'Error saving data to file' });
          }
          console.log(`Data saved to ${filePath}`);
        });

        res.json(filteredData);
      } catch (error) {
        console.error('Error parsing or fetching token data:', error);
        res.status(500).json({ error: 'Error fetching token data' });
      }
    }
  );
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
