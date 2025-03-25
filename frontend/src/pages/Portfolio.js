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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Refresh as RefreshIcon, Edit as EditIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PortfolioService from '../services/portfolioService';
import MarketService from '../services/marketService';

const Portfolio = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [currentPrices, setCurrentPrices] = useState({});
  const [performance, setPerformance] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
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
      if (openDialog) {
        try {
          setLoadingCryptos(true);
          const cryptos = await MarketService.getListings({ limit: 100 });
          setAvailableCryptos(cryptos.map(crypto => ({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            price: crypto.quote.USD.price
          })));
        } catch (error) {
          console.error('Error fetching available cryptocurrencies:', error);
          setError('Failed to load cryptocurrencies. Please try again.');
        } finally {
          setLoadingCryptos(false);
        }
      }
    };

    fetchAvailableCryptos();
  }, [openDialog]);

  const handleOpenDialog = (holding = null) => {
    setOpenDialog(true);
    setError(null);
    
    if (holding) {
      // Set editing mode
      setIsEditing(true);
      setEditingHoldingId(holding._id);
      
      // Format date from ISO string to YYYY-MM-DD
      const purchaseDate = new Date(holding.purchaseDate).toISOString().split('T')[0];
      
      // Populate form with holding data
      setTransactionForm({
        cryptoId: holding.cryptoId,
        name: holding.name,
        symbol: holding.symbol,
        amount: holding.amount.toString(),
        purchasePrice: holding.purchasePrice.toString(),
        purchaseDate: purchaseDate,
        notes: holding.notes || '',
      });
    } else {
      // Add mode
      setIsEditing(false);
      setEditingHoldingId(null);
      setTransactionForm({
        cryptoId: '',
        name: '',
        symbol: '',
        amount: '',
        purchasePrice: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionForm({
      cryptoId: '',
      name: '',
      symbol: '',
      amount: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setIsEditing(false);
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
      
      // Validate form data
      if (!transactionForm.cryptoId || !transactionForm.name || !transactionForm.symbol) {
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
      
      if (isEditing) {
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
      
      handleCloseDialog();
      
    } catch (error) {
      const actionType = isEditing ? 'update' : 'add';
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
                  onClick={handleOpenDialog}
                  fullWidth
                >
                  Add Holding
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Holdings Table */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Holdings
        </Typography>
        
        {(performance?.holdings?.length === 0 || !performance?.holdings) ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            You don't have any holdings yet. Add your first holding to get started.
          </Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Purchase Price</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="right">Profit/Loss</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {performance?.holdings.map((holding) => (
                  <TableRow key={holding._id}>
                    <TableCell>
                      {holding.name} ({holding.symbol})
                    </TableCell>
                    <TableCell align="right">{holding.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</TableCell>
                    <TableCell align="right">${holding.purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
                          onClick={() => handleOpenDialog(holding)}
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
        )}

        {/* Add/Edit Holding Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{isEditing ? 'Edit Holding' : 'Add New Holding'}</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Autocomplete
                options={availableCryptos}
                getOptionLabel={(option) => `${option.name} (${option.symbol})`}
                onChange={handleCryptoSelect}
                loading={loadingCryptos}
                disabled={isEditing} // Disable cryptocurrency selection when editing
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
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <Box component="li" key={key} {...otherProps}>
                      {option.name} ({option.symbol}) - ${option.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Box>
                  );
                }}
                value={availableCryptos.find(crypto => crypto.symbol === transactionForm.symbol) || null}
                isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
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
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveHolding} 
              variant="contained" 
              color="primary"
              disabled={!transactionForm.name || !transactionForm.amount || !transactionForm.purchasePrice}
            >
              {isEditing ? 'Update Holding' : 'Add Holding'}
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