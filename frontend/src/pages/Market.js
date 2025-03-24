import React, { useState } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

// Mock data for cryptocurrencies
const mockCryptoData = [
  { id: 1, name: 'Bitcoin', symbol: 'BTC', price: 58423.45, change24h: 2.5 },
  { id: 2, name: 'Ethereum', symbol: 'ETH', price: 3240.12, change24h: -1.2 },
  { id: 3, name: 'Solana', symbol: 'SOL', price: 132.45, change24h: 5.8 },
  { id: 4, name: 'Cardano', symbol: 'ADA', price: 0.51, change24h: 3.1 },
  { id: 5, name: 'XRP', symbol: 'XRP', price: 0.62, change24h: -0.8 },
  { id: 6, name: 'Polkadot', symbol: 'DOT', price: 7.23, change24h: 4.2 },
];

function CryptoCard({ crypto }) {
  const isPositive = crypto.change24h > 0;
  const color = isPositive ? 'success.main' : 'error.main';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {crypto.name} ({crypto.symbol})
        </Typography>
        <Typography variant="h5" component="div" gutterBottom>
          ${crypto.price.toLocaleString()}
        </Typography>
        <Box display="flex" alignItems="center" color={color}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
          <Typography variant="body1" sx={{ ml: 1 }}>
            {Math.abs(crypto.change24h)}% (24h)
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function Market() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter cryptocurrencies based on search term
  const filteredCryptos = mockCryptoData.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Market
        </Typography>

        <TextField
          fullWidth
          label="Search cryptocurrencies"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4 }}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCryptos.map((crypto) => (
              <Grid item xs={12} sm={6} md={4} key={crypto.id}>
                <CryptoCard crypto={crypto} />
              </Grid>
            ))}
            {filteredCryptos.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" align="center" color="textSecondary">
                  No cryptocurrencies found matching your search.
                </Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default Market; 