import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortfolioService from '../services/portfolioService';
import MarketService from '../services/marketService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [currentPrices, setCurrentPrices] = useState({});
  const [performance, setPerformance] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableCryptos, setAvailableCryptos] = useState([]);
  const [loadingCryptos, setLoadingCryptos] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    cryptoId: '',
    name: '',
    symbol: '',
    amount: '',
    purchasePrice: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingHoldingId, setEditingHoldingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('value');
  const [sortDir, setSortDir] = useState('desc');

  const theme = useTheme();

  // Check if user is authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: { pathname: '/portfolio' } } });
    }
  }, [currentUser, navigate]);

  // Fetch portfolio data and current prices
  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch portfolio data
      const portfolioData = await PortfolioService.getPortfolio();
      setPortfolio(portfolioData);

      // Fetch current prices for all holdings
      if (portfolioData.holdings && portfolioData.holdings.length > 0) {
        await fetchPricesForHoldings(portfolioData.holdings);
      } else {
        // Set empty performance when no holdings
        setPerformance({
          totalValue: 0,
          totalInvestment: 0,
          totalProfit: 0,
          totalProfitPercentage: 0,
          holdings: []
        });
      }
    } catch (err) {
      setError('Failed to fetch portfolio data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch prices for all holdings
  const fetchPricesForHoldings = async (holdings) => {
    try {
      if (!holdings || holdings.length === 0) return;
      
      const symbols = holdings.map(h => h.symbol);
      const params = { limit: 100 };
      
      // Add symbols parameter if we have symbols
      if (symbols.length > 0) {
        params.symbols = symbols.join(',');
      }
      
      const listings = await MarketService.getListings(params);
      
      // Create price map from listings
      const priceMap = {};
      listings.forEach(crypto => {
        priceMap[crypto.symbol] = crypto.quote.USD;
      });
      
      setCurrentPrices(priceMap);
      
      // Calculate performance
      const performanceData = PortfolioService.calculatePerformance(
        holdings,
        priceMap
      );
      
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Still calculate performance with empty prices if we fail
      const performanceData = PortfolioService.calculatePerformance(
        holdings,
        {}
      );
      setPerformance(performanceData);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (currentUser) {
      fetchPortfolioData();
    }
  }, [currentUser]);

  // Fetch available cryptocurrencies when dialog opens
  useEffect(() => {
    const fetchAvailableCryptos = async () => {
      if (openAddDialog) {
        try {
          setLoadingCryptos(true);
          const cryptos = await MarketService.getListings({ limit: 100 });
          // Format the cryptocurrency data for the dropdown
          const formattedCryptos = cryptos.map(crypto => ({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.quote.USD.price
          }));
          console.log('Fetched cryptocurrencies:', formattedCryptos.length);
          setAvailableCryptos(formattedCryptos);
        } catch (error) {
          console.error('Error fetching available cryptocurrencies:', error);
          setError('Failed to load cryptocurrencies. Please try again.');
        } finally {
          setLoadingCryptos(false);
        }
      }
    };

    fetchAvailableCryptos();
  }, [openAddDialog]);

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
    setError(null);
    
    // Reset form
    setTransactionForm({
      cryptoId: '',
      name: '',
      symbol: '',
      amount: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleOpenEditDialog = (holding) => {
    setOpenEditDialog(true);
    setError(null);
    setEditingHoldingId(holding._id);
    
    // Use a default date if purchase date is invalid
    let safeDate = new Date().toISOString().split('T')[0];
    try {
      if (holding.purchaseDate) {
        const date = new Date(holding.purchaseDate);
        if (!isNaN(date.getTime())) {
          safeDate = date.toISOString().split('T')[0];
        }
      }
    } catch (error) {
      console.error('Error parsing date:', error);
    }
    
    // Populate form with holding data with safe fallbacks
    setTransactionForm({
      cryptoId: holding.cryptoId || '',
      name: holding.name || '',
      symbol: holding.symbol || '',
      amount: typeof holding.amount === 'number' ? holding.amount.toString() : '',
      purchasePrice: typeof holding.purchasePrice === 'number' ? holding.purchasePrice.toString() : '',
      purchaseDate: safeDate,
      notes: holding.notes || '',
    });
  };

  const handleCloseDialogs = () => {
    setOpenAddDialog(false);
    setOpenEditDialog(false);
    setEditingHoldingId(null);
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTransactionForm({
      ...transactionForm,
      [name]: value,
    });
  };

  const handleCryptoSelect = (event, newValue) => {
    if (newValue) {
      setTransactionForm({
        ...transactionForm,
        cryptoId: newValue.id,
        name: newValue.name,
        symbol: newValue.symbol,
        purchasePrice: newValue.price.toString(), // Set current price as default purchase price
      });
    }
  };

  const handleSaveHolding = async () => {
    try {
      setError(null);
      
      // Different validation for add vs edit
      if (openAddDialog && (!transactionForm.cryptoId || !transactionForm.name || !transactionForm.symbol)) {
        setError('Please select a cryptocurrency');
        return;
      }
      
      if (!transactionForm.amount || parseFloat(transactionForm.amount) <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      if (!transactionForm.purchasePrice || parseFloat(transactionForm.purchasePrice) <= 0) {
        setError('Please enter a valid purchase price');
        return;
      }
      
      // Convert string values to numbers
      const holdingData = {
        ...transactionForm,
        amount: parseFloat(transactionForm.amount),
        purchasePrice: parseFloat(transactionForm.purchasePrice),
      };
      
      let updatedPortfolio;
      
      if (openEditDialog) {
        // Update existing holding
        updatedPortfolio = await PortfolioService.updateHolding(editingHoldingId, holdingData);
        setSuccess('Holding updated successfully!');
      } else {
        // Add new holding
        updatedPortfolio = await PortfolioService.addHolding(holdingData);
        setSuccess('Holding added successfully!');
      }
      
      setPortfolio(updatedPortfolio);
      
      // Refresh prices and performance
      await fetchPricesForHoldings(updatedPortfolio.holdings);
      
      handleCloseDialogs();
      
    } catch (error) {
      const actionType = openEditDialog ? 'update' : 'add';
      setError(`Failed to ${actionType} holding. Please try again.`);
      console.error(`Error ${actionType} holding:`, error);
    }
  };

  const handleDeleteHolding = async (holdingId) => {
    try {
      setError(null);
      const updatedPortfolio = await PortfolioService.removeHolding(holdingId);
      setPortfolio(updatedPortfolio);
      
      // Refresh prices and performance
      await fetchPricesForHoldings(updatedPortfolio.holdings);
      
      setSuccess('Holding removed successfully!');
    } catch (error) {
      setError(error.message || 'Failed to remove holding. Please try again.');
      console.error('Error removing holding:', error);
    }
  };

  const handleRefreshPrices = async () => {
    if (portfolio && portfolio.holdings) {
      try {
        await fetchPricesForHoldings(portfolio.holdings);
        setSuccess('Prices updated successfully!');
      } catch (error) {
        setError('Failed to update prices. Please try again.');
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSortDirChange = (e) => {
    setSortDir(e.target.value);
  };

  const getFilteredAndSortedHoldings = () => {
    if (!performance || !performance.holdings) return [];

    // First filter by search term
    const filtered = performance.holdings.filter(holding => 
      holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      holding.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then sort based on selected criteria
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'symbol':
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'purchasePrice':
          comparison = a.purchasePrice - b.purchasePrice;
          break;
        case 'currentPrice':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'value':
          comparison = a.holdingValue - b.holdingValue;
          break;
        case 'profit':
          comparison = a.profit - b.profit;
          break;
        case 'date':
          comparison = new Date(a.purchaseDate) - new Date(b.purchaseDate);
          break;
        default:
          comparison = a.holdingValue - b.holdingValue;
      }
      
      return sortDir === 'desc' ? -comparison : comparison;
    });
  };

  // Function to prepare data for pie chart
  const preparePieChartData = () => {
    if (!performance || !performance.holdings || performance.holdings.length === 0) {
      return [];
    }

    // Group holdings by symbol and sum their values
    const holdingsBySymbol = performance.holdings.reduce((acc, holding) => {
      const symbol = holding.symbol;
      if (!acc[symbol]) {
        acc[symbol] = {
          name: holding.name,
          symbol: symbol,
          value: 0
        };
      }
      acc[symbol].value += holding.holdingValue;
      return acc;
    }, {});

    // Convert grouped holdings to array and sort by value
    const groupedHoldings = Object.values(holdingsBySymbol)
      .sort((a, b) => b.value - a.value);
    
    // Take top 5 holdings
    const topHoldings = groupedHoldings.slice(0, 5);
    
    // Calculate the sum of the remaining holdings
    const restValue = groupedHoldings
      .filter((_, index) => index >= 5)
      .reduce((sum, h) => sum + h.value, 0);
    
    const chartData = topHoldings.map(h => ({
      name: h.symbol,
      value: h.value
    }));
    
    // Add "Others" category if there are more than 5 unique assets
    if (groupedHoldings.length > 5 && restValue > 0) {
      chartData.push({
        name: 'Others',
        value: restValue
      });
    }
    
    return chartData;
  };

  // Update COLORS with more vibrant colors and make it a function to ensure theme is available
  const getChartColors = () => [
    theme.palette.primary.main,
    '#FF6B6B', // Custom coral color
    '#4ECDC4', // Custom teal color
    '#FFD166', // Custom yellow color
    '#6A0572', // Custom purple color
    '#1A535C', // Custom dark teal
    theme.palette.secondary.main,
    theme.palette.grey[500],
  ];

  if (!currentUser) {
    return null; // Will redirect to login via the useEffect
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            My Portfolio
          </Typography>
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />} 
            onClick={handleRefreshPrices}
            disabled={!portfolio || !portfolio.holdings || portfolio.holdings.length === 0}
          >
            Refresh Prices
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Portfolio Summary */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h5" component="div">
                  ${performance?.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Profit/Loss
                </Typography>
                <Typography 
                  variant="h5" 
                  component="div"
                  color={performance?.totalProfit >= 0 ? 'success.main' : 'error.main'}
                >
                  ${performance?.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'} 
                  ({performance?.totalProfitPercentage >= 0 ? '+' : ''}{performance?.totalProfitPercentage.toFixed(2) || '0.00'}%)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Number of Assets
                </Typography>
                <Typography variant="h5" component="div">
                  {portfolio?.holdings?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenAddDialog}
                  fullWidth
                >
                  Add Holding
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Portfolio Composition Chart */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Portfolio Composition
        </Typography>

        {(performance?.holdings?.length === 0 || !performance?.holdings) ? (
          <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
            You don't have any holdings yet. Add your first holding to see the portfolio composition.
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Pie Chart */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={preparePieChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={90}
                        outerRadius={150}
                        paddingAngle={4}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={false}
                      >
                        {preparePieChartData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getChartColors()[index % getChartColors().length]}
                            stroke={theme.palette.background.paper}
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          borderColor: theme.palette.divider,
                          borderRadius: 8,
                          boxShadow: theme.shadows[3],
                          padding: 12
                        }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        labelStyle={{ fontWeight: 'bold', marginBottom: 5 }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        layout="horizontal" 
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ paddingTop: 20 }}
                        formatter={(value, entry) => {
                          const { payload } = entry;
                          const percent = (payload.value / performance?.totalValue) * 100;
                          return `${value} (${percent.toFixed(1)}%)`;
                        }} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
            
            {/* Performance Metrics */}
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom>
                  Performance Insights
                </Typography>
                
                {/* Portfolio Metrics */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Initial Investment</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${performance?.totalInvestment?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Current Value</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      ${performance?.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total Return</Typography>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      color={performance?.totalProfit >= 0 ? 'success.main' : 'error.main'}
                    >
                      ${performance?.totalProfit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'} 
                      ({performance?.totalProfitPercentage >= 0 ? '+' : ''}{performance?.totalProfitPercentage?.toFixed(2) || '0.00'}%)
                    </Typography>
                  </Box>
                </Box>
                
                {/* Best & Worst Performers */}
                {(() => {
                  if (!performance?.holdings || performance.holdings.length === 0) return null;
                  
                  // Find best and worst performing assets by percentage
                  const sortedByPerformance = [...performance.holdings].sort((a, b) => b.profitPercentage - a.profitPercentage);
                  const bestPerformer = sortedByPerformance[0];
                  const worstPerformer = sortedByPerformance[sortedByPerformance.length - 1];
                  
                  return (
                    <>
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Top Performers
                      </Typography>
                      
                      {performance.holdings.length > 0 && (
                        <Box sx={{ mb: 2, p: 1.5, bgcolor: 'success.light', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">{bestPerformer.name} ({bestPerformer.symbol})</Typography>
                            <Typography 
                              variant="body2" 
                              fontWeight="medium"
                              color="success.dark"
                            >
                              {bestPerformer.profitPercentage >= 0 ? '+' : ''}{bestPerformer.profitPercentage.toFixed(2)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Current: ${bestPerformer.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            <Typography variant="body2" color="text.secondary">Bought: ${bestPerformer.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                          </Box>
                        </Box>
                      )}
                      
                      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Underperformers
                      </Typography>
                      
                      {performance.holdings.length > 0 && (
                        <Box sx={{ p: 1.5, bgcolor: 'error.light', borderRadius: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">{worstPerformer.name} ({worstPerformer.symbol})</Typography>
                            <Typography 
                              variant="body2" 
                              fontWeight="medium"
                              color="error.dark"
                            >
                              {worstPerformer.profitPercentage >= 0 ? '+' : ''}{worstPerformer.profitPercentage.toFixed(2)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Current: ${worstPerformer.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                            <Typography variant="body2" color="text.secondary">Bought: ${worstPerformer.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                          </Box>
                        </Box>
                      )}
                    </>
                  );
                })()}
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Holdings Table */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Holdings
        </Typography>
        
        {(performance?.holdings?.length === 0 || !performance?.holdings) ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            You don't have any holdings yet. Add your first holding to get started.
          </Alert>
        ) : (
          <>
            {/* Search and Sort Controls */}
            <Box sx={{ mb: 3, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1 }}>
                <TextField
                  fullWidth
                  label="Search assets"
                  variant="standard"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search by name or symbol"
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select value={sortBy} onChange={handleSortChange}>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="symbol">Symbol</MenuItem>
                    <MenuItem value="amount">Amount</MenuItem>
                    <MenuItem value="purchasePrice">Purchase Price</MenuItem>
                    <MenuItem value="currentPrice">Current Price</MenuItem>
                    <MenuItem value="value">Value</MenuItem>
                    <MenuItem value="profit">Profit/Loss</MenuItem>
                    <MenuItem value="date">Purchase Date</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl variant="standard" sx={{ minWidth: 120 }}>
                  <InputLabel>Order</InputLabel>
                  <Select value={sortDir} onChange={handleSortDirChange}>
                    <MenuItem value="desc">Descending</MenuItem>
                    <MenuItem value="asc">Ascending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Get filtered and sorted holdings */}
            {(() => {
              const filteredAndSortedHoldings = getFilteredAndSortedHoldings();
              
              return filteredAndSortedHoldings.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No holdings match your search criteria.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Asset</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell align="right">Purchase Price</TableCell>
                        <TableCell align="right">Purchase Date</TableCell>
                        <TableCell align="right">Current Price</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Profit/Loss</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAndSortedHoldings.map((holding) => (
                        <TableRow key={holding._id}>
                          <TableCell>
                            {holding.name} ({holding.symbol})
                          </TableCell>
                          <TableCell align="right">{holding.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</TableCell>
                          <TableCell align="right">${holding.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell align="right">{new Date(holding.purchaseDate).toLocaleDateString()}</TableCell>
                          <TableCell align="right">${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell align="right">${holding.holdingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                          <TableCell 
                            align="right"
                            sx={{ color: holding.profit >= 0 ? 'success.main' : 'error.main' }}
                          >
                            ${holding.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({holding.profitPercentage.toFixed(2)}%)
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => handleOpenEditDialog(holding)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteHolding(holding._id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              );
            })()}
          </>
        )}

        {/* Add New Holding Dialog */}
        <Dialog open={openAddDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Add New Holding</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Autocomplete
                id="crypto-select"
                options={availableCryptos}
                getOptionLabel={(option) => option ? `${option.name || ''} (${option.symbol || ''})` : ''}
                onChange={handleCryptoSelect}
                loading={loadingCryptos}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Cryptocurrency"
                    required
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCryptos ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.name} ({option.symbol}) - ${option.price.toFixed(2)}
                  </li>
                )}
              />
              
              <TextField
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={transactionForm.amount}
                onChange={handleFormChange}
                required
                inputProps={{ step: 'any', min: "0.00000001" }}
                helperText="Enter the quantity of cryptocurrency you own"
              />
              <TextField
                name="purchasePrice"
                label="Purchase Price"
                type="number"
                fullWidth
                value={transactionForm.purchasePrice}
                onChange={handleFormChange}
                required
                inputProps={{ step: 'any', min: "0.00000001" }}
                helperText="Enter the price per unit when purchased"
              />
              <TextField
                name="purchaseDate"
                label="Purchase Date"
                type="date"
                fullWidth
                value={transactionForm.purchaseDate}
                onChange={handleFormChange}
                required
                InputLabelProps={{ shrink: true }}
                helperText="When did you purchase this cryptocurrency?"
              />
              <TextField
                name="notes"
                label="Notes"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={transactionForm.notes}
                onChange={handleFormChange}
                helperText="Optional notes about this holding"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button 
              onClick={handleSaveHolding} 
              variant="contained" 
              color="primary"
              disabled={!transactionForm.name || !transactionForm.amount || !transactionForm.purchasePrice}
            >
              Add Holding
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Edit Holding Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Holding</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                disabled
                fullWidth
                label="Cryptocurrency"
                value={`${transactionForm.name} (${transactionForm.symbol})`}
                InputLabelProps={{ shrink: true }}
                helperText="Cannot change cryptocurrency when editing"
              />
              <TextField
                name="amount"
                label="Amount"
                type="number"
                fullWidth
                value={transactionForm.amount}
                onChange={handleFormChange}
                required
                inputProps={{ step: 'any', min: "0.00000001" }}
                helperText="Enter the quantity of cryptocurrency you own"
              />
              <TextField
                name="purchasePrice"
                label="Purchase Price"
                type="number"
                fullWidth
                value={transactionForm.purchasePrice}
                onChange={handleFormChange}
                required
                inputProps={{ step: 'any', min: "0.00000001" }}
                helperText="Enter the price per unit when purchased"
              />
              <TextField
                name="purchaseDate"
                label="Purchase Date"
                type="date"
                fullWidth
                value={transactionForm.purchaseDate}
                onChange={handleFormChange}
                required
                InputLabelProps={{ shrink: true }}
                helperText="When did you purchase this cryptocurrency?"
              />
              <TextField
                name="notes"
                label="Notes"
                type="text"
                fullWidth
                multiline
                rows={3}
                value={transactionForm.notes}
                onChange={handleFormChange}
                helperText="Optional notes about this holding"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogs}>Cancel</Button>
            <Button 
              onClick={handleSaveHolding} 
              variant="contained" 
              color="primary"
              disabled={!transactionForm.amount || !transactionForm.purchasePrice}
            >
              Update Holding
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Success Message Snackbar */}
        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={success}
        />
      </Box>
    </Container>
  );
};

export default Portfolio; 