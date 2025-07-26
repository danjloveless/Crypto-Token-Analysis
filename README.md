# Crypto Token Analysis

A full-stack web application for analyzing cryptocurrency tokens with real-time data fetching, storage, and export capabilities.

## 🚀 Features

- **Real-time Cryptocurrency Data**: Fetch live market data from CoinGecko API
- **Smart Search**: Search cryptocurrencies by name or symbol with auto-suggestions
- **Data Persistence**: SQLite database for storing cryptocurrency information
- **JSON Export**: Download fetched cryptocurrency data as JSON files
- **Multi-Platform Support**: Track tokens across Ethereum, Solana, Binance Smart Chain, and Polygon
- **Comprehensive Market Data**: Price data, market cap, percentage changes, and historical metrics
- **Responsive UI**: Modern React interface with Tailwind CSS styling

## 🛠️ Tech Stack

### Frontend
- **React** - User interface framework
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Programming language

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **node-fetch** - HTTP client for API requests
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **CoinGecko API** - Cryptocurrency market data source

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **CoinGecko API Key** (free tier available)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-token-analysis
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

5. **Set up environment variables**
   
   Create a `.env` file in the `backend` directory:
   ```env
   COINGECKO_API_KEY=your_coingecko_api_key_here
   ```

6. **Initialize the database**
   ```bash
   npm run init-db
   ```

## 🚀 Running the Application

### Development Mode

**Start both frontend and backend simultaneously:**
```bash
npm start
```

This command uses `concurrently` to run:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Alternative: Start with Database Initialization
```bash
npm run startWithInit
```

### Manual Startup

**Start backend only:**
```bash
npm run server
```

**Start frontend only:**
```bash
npm run client
```

## 📁 Project Structure

```
crypto-token-analysis/
├── package.json                 # Root package configuration
├── backend/                     # Backend application
│   ├── index.js                 # Express server and API routes
│   ├── initDB.js                # Database initialization script
│   ├── package.json             # Backend dependencies
│   ├── coinData.db              # SQLite database (created after init)
│   ├── fetchedData/             # Directory for JSON exports
│   └── pre_loads/               # Pre-loaded cryptocurrency data
│       └── CoinList.json        # Master list of cryptocurrencies
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   └── Search.js        # Main search component
│   │   ├── App.js               # Main React component
│   │   └── index.js             # React entry point
│   ├── package.json             # Frontend dependencies
│   └── public/                  # Static assets
└── README.md                    # This file
```

## 🔌 API Endpoints

### Backend API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/getTokenData` | POST | Fetch detailed token data from CoinGecko |
| `/api/searchCoins` | GET | Search cryptocurrencies by name or symbol |

### Request Examples

**Get Token Data:**
```javascript
POST /api/getTokenData
Content-Type: application/json

{
  "id": "bitcoin"
}
```

**Search Coins:**
```javascript
GET /api/searchCoins?query=bitcoin
```

## 💾 Database Schema

The SQLite database contains a `coin` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT (Primary Key) | Unique CoinGecko identifier |
| `symbol` | TEXT | Cryptocurrency symbol (e.g., BTC) |
| `name` | TEXT | Full cryptocurrency name |
| `ethereum` | TEXT | Ethereum contract address |
| `solana` | TEXT | Solana program address |
| `binance_smart_chain` | TEXT | BSC contract address |
| `polygon_pos` | TEXT | Polygon contract address |

## 📊 Data Sources

- **CoinGecko API**: Primary source for real-time cryptocurrency data
- **Local Database**: Cached cryptocurrency metadata for fast search
- **JSON Files**: Exported data stored in `backend/fetchedData/`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `COINGECKO_API_KEY` | Your CoinGecko API key | Yes |

## 📱 Usage

1. **Search for Cryptocurrencies**: Use the search bar to find specific tokens
2. **View Detailed Information**: Click on search results to fetch comprehensive data
3. **Export Data**: Download fetched data as JSON files for further analysis
4. **Monitor Multiple Metrics**: View price data, market cap, and percentage changes

## 🔍 Features in Detail

### Search Functionality
- Type-ahead search with real-time suggestions
- Search by cryptocurrency name or symbol
- Database-backed fast search results

### Data Fetching
- Real-time data from CoinGecko API
- Comprehensive market data including:
  - Current prices (USD and BTC)
  - All-time highs and percentage changes
  - Market cap and volume data
  - Price change percentages (24h, 7d, 14d, 30d, 60d, 200d, 1y)

### Data Storage
- Automatic JSON file generation
- Organized file storage in `fetchedData` directory
- Filtered data focusing on USD and BTC pairs

## 🚨 Troubleshooting

### Common Issues

**Database Not Found:**
```bash
npm run init-db
```

**API Rate Limiting:**
- Ensure you have a valid CoinGecko API key
- Check your API key usage limits

**Port Conflicts:**
- Backend runs on port 5000
- Frontend runs on port 3000
- Ensure these ports are available

**Dependencies Issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 🔮 Future Enhancements

- [ ] Real-time price charts and visualization
- [ ] Portfolio tracking capabilities
- [ ] Price alerts and notifications
- [ ] Historical data analysis
- [ ] Technical indicators integration
- [ ] User authentication and saved searches
- [ ] Mobile app development
- [ ] Additional cryptocurrency exchange integrations

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for the crypto community**
