import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

// Mock data for cryptocurrencies
const mockCryptoData = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 63250.42, change24h: 2.5 },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3430.18, change24h: -1.2 },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 145.75, change24h: 5.8 },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.58, change24h: -0.7 },
  { id: 'ripple', name: 'XRP', symbol: 'XRP', price: 0.64, change24h: 1.2 },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', price: 7.82, change24h: 3.1 },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', price: 0.12, change24h: -2.3 },
  { id: 'avalanche', name: 'Avalanche', symbol: 'AVAX', price: 35.42, change24h: 4.6 },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', price: 15.23, change24h: 2.1 },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC', price: 85.34, change24h: 0.8 },
  { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', price: 10.51, change24h: -0.5 },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC', price: 0.81, change24h: 3.7 },
];

const CryptoCard = ({ crypto }: { crypto: typeof mockCryptoData[0] }) => {
  const theme = useTheme();
  const isPositive = crypto.change24h >= 0;

  return (
    <Card sx={{ 
      height: '100%', 
      transition: 'transform 0.2s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
      borderLeft: 4,
      borderColor: isPositive ? 'success.main' : 'error.main'
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {crypto.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {crypto.symbol}
          </Typography>
        </Box>
        <Typography variant="h5" component="div" gutterBottom>
          ${crypto.price.toLocaleString()}
        </Typography>
        <Typography 
          variant="body2" 
          color={isPositive ? 'success.main' : 'error.main'}
        >
          {isPositive ? '+' : ''}{crypto.change24h}% (24h)
        </Typography>
      </CardContent>
    </Card>
  );
};

const Market = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading] = useState(false); // Will be used with real API

  // Filter cryptocurrencies based on search term
  const filteredCryptos = mockCryptoData.filter(crypto => 
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Market
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          View the latest prices and trends for the top cryptocurrencies
        </Typography>

        <Box my={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search cryptocurrency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCryptos.map((crypto) => (
              <Grid item key={crypto.id} xs={12} sm={6} md={4} lg={3}>
                <CryptoCard crypto={crypto} />
              </Grid>
            ))}
            {filteredCryptos.length === 0 && (
              <Box width="100%" textAlign="center" mt={4}>
                <Typography variant="h6">No cryptocurrencies found</Typography>
              </Box>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Market; 