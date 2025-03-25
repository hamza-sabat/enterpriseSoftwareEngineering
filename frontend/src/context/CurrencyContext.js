import React, { createContext, useState, useContext, useEffect } from 'react';

// Exchange rates relative to USD (1 USD = X of currency)
const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.85, // 1 USD = 0.85 EUR
  GBP: 0.73, // 1 USD = 0.73 GBP
};

const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  // Initialize currency from localStorage or default to USD
  const [currency, setCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem('currency');
    return savedCurrency || 'USD';
  });

  // Update localStorage when currency changes
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Format a USD value to the selected currency with the correct symbol
  const formatCurrency = (valueInUSD, options = {}) => {
    if (valueInUSD === null || valueInUSD === undefined) {
      return '';
    }

    const {
      maximumFractionDigits = 2,
      minimumFractionDigits = 2,
      notation = 'standard',
    } = options;

    // Convert USD to the selected currency
    const convertedValue = valueInUSD * EXCHANGE_RATES[currency];
    
    // Format the number
    return `${CURRENCY_SYMBOLS[currency]}${convertedValue.toLocaleString(undefined, {
      maximumFractionDigits,
      minimumFractionDigits,
      notation,
    })}`;
  };

  // Convert an amount from one currency to another
  const convertCurrency = (value, fromCurrency, toCurrency = currency) => {
    if (value === null || value === undefined) {
      return null;
    }

    // Convert to USD first (as base currency)
    const valueInUSD = value / EXCHANGE_RATES[fromCurrency];
    
    // Then convert from USD to the target currency
    return valueInUSD * EXCHANGE_RATES[toCurrency];
  };

  // Convert an amount from the selected currency to USD
  const toUSD = (value) => {
    return convertCurrency(value, currency, 'USD');
  };

  // Convert an amount from USD to the selected currency
  const fromUSD = (valueInUSD) => {
    return convertCurrency(valueInUSD, 'USD', currency);
  };

  // Get the symbol for the current currency
  const getCurrencySymbol = () => CURRENCY_SYMBOLS[currency];

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    convertCurrency,
    toUSD,
    fromUSD,
    getCurrencySymbol,
    CURRENCY_SYMBOLS,
    EXCHANGE_RATES,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export default CurrencyContext; 