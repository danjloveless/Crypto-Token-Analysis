const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'coinData.db');
const coinListFile = path.join(__dirname, 'pre_loads', 'CoinList.json');

// Create a new database file if it doesn't exist
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the SQLite database.');
});

const createTable = `
  CREATE TABLE IF NOT EXISTS coin (
    id TEXT PRIMARY KEY,
    symbol TEXT,
    name TEXT,
    ethereum TEXT,
    solana TEXT,
    binance_smart_chain TEXT,
    polygon_pos TEXT
  )
`;

const insertData = `
  INSERT OR IGNORE INTO coin (id, symbol, name, ethereum, solana, binance_smart_chain, polygon_pos)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`;

// Create table and insert data
db.serialize(() => {
  db.run(createTable, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created.');

      const coinList = JSON.parse(fs.readFileSync(coinListFile, 'utf8'));
      const stmt = db.prepare(insertData);

      coinList.forEach((coin) => {
        stmt.run(
          coin.id,
          coin.symbol,
          coin.name,
          coin.platforms.ethereum || null,
          coin.platforms.solana || null,
          coin.platforms['binance-smart-chain'] || null,
          coin.platforms['polygon-pos'] || null
        );
      });

      stmt.finalize((err) => {
        if (err) {
          console.error('Error finalizing statement:', err.message);
        } else {
          console.log('Coin data inserted.');
          // Close the database connection
          db.close((err) => {
            if (err) {
              console.error('Error closing the database connection:', err.message);
            }
            console.log('Closed the database connection.');
          });
        }
      });
    }
  });
});
