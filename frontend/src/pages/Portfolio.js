import React, { useState } from 'react';
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
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

// Mock data for portfolio
const mockPortfolioSummary = {
  totalValue: 15420.83,
  totalProfit: 3245.67,
  totalProfitPercentage: 26.7,
  assets: 5,
};

// Mock transaction data
const mockTransactions = [
  { 
    id: 1, 
    coin: 'Bitcoin', 
    symbol: 'BTC', 
    type: 'buy', 
    amount: 0.15, 
    price: 58423.45, 
    value: 8763.52,
    date: '2023-02-15' 
  },
  { 
    id: 2, 
    coin: 'Ethereum', 
    symbol: 'ETH', 
    type: 'buy', 
    amount: 1.5, 
    price: 3240.12, 
    value: 4860.18,
    date: '2023-03-22' 
  },
  { 
    id: 3, 
    coin: 'Solana', 
    symbol: 'SOL', 
    type: 'sell', 
    amount: 5, 
    price: 132.45, 
    value: 662.25,
    date: '2023-04-10' 
  },
  { 
    id: 4, 
    coin: 'Cardano', 
    symbol: 'ADA', 
    type: 'buy', 
    amount: 1200, 
    price: 0.51, 
    value: 612.00,
    date: '2023-05-05' 
  },
];

// Mock data for available coins in the dropdown
const availableCoins = [
  { name: 'Bitcoin', symbol: 'BTC' },
  { name: 'Ethereum', symbol: 'ETH' },
  { name: 'Solana', symbol: 'SOL' },
  { name: 'Cardano', symbol: 'ADA' },
  { name: 'XRP', symbol: 'XRP' },
  { name: 'Polkadot', symbol: 'DOT' },
];

const Portfolio = () => {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [openDialog, setOpenDialog] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    coin: '',
    type: 'buy',
    amount: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTransactionForm({
      coin: '',
      type: 'buy',
      amount: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionForm({
      ...transactionForm,
      [name]: value,
    });
  };

  const handleAddTransaction = () => {
    const selectedCoin = availableCoins.find(c => c.name === transactionForm.coin);
    if (!selectedCoin) return;

    const amount = parseFloat(transactionForm.amount);
    const price = parseFloat(transactionForm.price);
    
    if (isNaN(amount) || isNaN(price)) return;

    const newTransaction = {
      id: transactions.length + 1,
      coin: transactionForm.coin,
      symbol: selectedCoin.symbol,
      type: transactionForm.type,
      amount,
      price,
      value: amount * price,
      date: transactionForm.date,
    };

    setTransactions([...transactions, newTransaction]);
    handleCloseDialog();
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 2, pb: 6 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Portfolio
        </Typography>

        {/* Portfolio Summary */}
        <Grid container spacing={3} sx={{ mb: 4, mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h5" component="div">
                  ${mockPortfolioSummary.totalValue.toLocaleString()}
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
                  color={mockPortfolioSummary.totalProfit >= 0 ? 'success.main' : 'error.main'}
                >
                  ${mockPortfolioSummary.totalProfit.toLocaleString()} 
                  ({mockPortfolioSummary.totalProfit >= 0 ? '+' : ''}{mockPortfolioSummary.totalProfitPercentage}%)
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
                  {mockPortfolioSummary.assets}
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
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Transactions Table */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Transactions
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Coin</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    {transaction.coin} ({transaction.symbol})
                  </TableCell>
                  <TableCell sx={{ textTransform: 'capitalize', color: transaction.type === 'buy' ? 'success.main' : 'error.main' }}>
                    {transaction.type}
                  </TableCell>
                  <TableCell align="right">{transaction.amount}</TableCell>
                  <TableCell align="right">${transaction.price.toLocaleString()}</TableCell>
                  <TableCell align="right">${transaction.value.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteTransaction(transaction.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No transactions found. Add your first transaction!
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Transaction Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Coin"
              name="coin"
              value={transactionForm.coin}
              onChange={handleFormChange}
            >
              {availableCoins.map((coin) => (
                <MenuItem key={coin.symbol} value={coin.name}>
                  {coin.name} ({coin.symbol})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Type"
              name="type"
              value={transactionForm.type}
              onChange={handleFormChange}
            >
              <MenuItem value="buy">Buy</MenuItem>
              <MenuItem value="sell">Sell</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={transactionForm.amount}
              onChange={handleFormChange}
              inputProps={{ step: 'any' }}
            />
            <TextField
              fullWidth
              label="Price per Coin (USD)"
              name="price"
              type="number"
              value={transactionForm.price}
              onChange={handleFormChange}
              inputProps={{ step: 'any' }}
            />
            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={transactionForm.date}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddTransaction} 
            variant="contained"
            disabled={!transactionForm.coin || !transactionForm.amount || !transactionForm.price}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Portfolio; 