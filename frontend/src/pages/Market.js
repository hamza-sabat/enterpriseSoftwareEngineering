import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Paper,
  Link,
} from '@mui/material';
import { TrendingUp, TrendingDown, Refresh, Search } from '@mui/icons-material';
import MarketService from '../services/marketService';
import { useCurrency } from '../context/CurrencyContext';

function CryptoCard({ crypto }) {
  const { formatCurrency } = useCurrency();
  const change24h = crypto.quote?.USD?.percent_change_24h || 0;
  const isPositive = change24h > 0;
  const color = isPositive ? 'success.main' : 'error.main';
  const price = crypto.quote?.USD?.price || 0;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h6" component="div">
            {crypto.name} ({crypto.symbol})
          </Typography>
          <Chip 
            size="small"
            label={`Rank #${crypto.cmc_rank}`} 
            color="primary" 
            variant="outlined" 
          />
        </Box>

        <Typography variant="h5" component="div" gutterBottom>
          {formatCurrency(price)}
        </Typography>
        
        <Box display="flex" alignItems="center" color={color}>
          {isPositive ? <TrendingUp /> : <TrendingDown />}
          <Typography variant="body1" sx={{ ml: 1 }}>
            {Math.abs(change24h).toFixed(2)}% (24h)
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Market Cap:
            </Typography>
            <Typography variant="body2">
              {formatCurrency(crypto.quote?.USD?.market_cap || 0)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Volume (24h):
            </Typography>
            <Typography variant="body2">
              {formatCurrency(crypto.quote?.USD?.volume_24h || 0)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function MarketOverview({ data }) {
  const { formatCurrency } = useCurrency();
  
  if (!data) return null;
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Market Overview</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Total Market Cap
          </Typography>
          <Typography variant="body1">
            {formatCurrency(data.quote?.USD?.total_market_cap || 0)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            24h Volume
          </Typography>
          <Typography variant="body1">
            {formatCurrency(data.quote?.USD?.total_volume_24h || 0)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            BTC Dominance
          </Typography>
          <Typography variant="body1">
            {(data.btc_dominance || 0).toFixed(2)}%
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="body2" color="text.secondary">
            Active Cryptocurrencies
          </Typography>
          <Typography variant="body1">
            {data.active_cryptocurrencies?.toLocaleString() || 0}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

function Market() {
  const { formatCurrency } = useCurrency();
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortDir, setSortDir] = useState('desc');

  const fetchCryptocurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await MarketService.getListings({
        limit: 100,
        sort: sortBy,
        sortDir,
      });
      setCryptos(data);
      
      // Fetch global market data
      const metrics = await MarketService.getGlobalMetrics();
      setGlobalMetrics(metrics);
    } catch (error) {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptocurrencies();
  }, [sortBy, sortDir]);

  // Filter cryptocurrencies based on search term
  const filteredCryptos = cryptos.filter(crypto =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRefresh = () => {
    fetchCryptocurrencies();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortDirChange = (e) => {
    setSortDir(e.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cryptocurrency Market
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <MarketOverview data={globalMetrics} />

        <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1 }}>
            <Search sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              fullWidth
              label="Search cryptocurrencies"
              variant="standard"
              value={searchTerm}
              onChange={handleSearch}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select value={sortBy} onChange={handleSortChange}>
                <MenuItem value="market_cap">Market Cap</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="volume_24h">Volume 24h</MenuItem>
                <MenuItem value="percent_change_24h">% Change 24h</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl variant="standard" sx={{ minWidth: 120 }}>
              <InputLabel>Order</InputLabel>
              <Select value={sortDir} onChange={handleSortDirChange}>
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
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
            
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Data provided by{' '}
                <Link href="https://coinmarketcap.com" target="_blank" rel="noopener">
                  CoinMarketCap
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}

export default Market; 