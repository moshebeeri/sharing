// PriceTag.tsx
import React, { useState } from 'react';
import { TextField, Grid, Typography, MenuItem } from '@mui/material';

type PricingModel = {
  price: number;
  period: 'month' | 'year' | '2 years' | '3 years' | '4 years' | '5 years';
  billingFrequency: 'monthly' | 'yearly';
  currency: 'USD' | 'EUR' | 'CAD' | 'MXN';
};

const getCurrencySymbol = (currency: string) => {
  const currencySymbols: { [key: string]: string } = {
    USD: '$',
    EUR: '€',
    CAD: 'C$',
    MXN: 'MX$',
  };

  return currencySymbols[currency] || currency;
};

interface PriceTagProps {
  value: PricingModel;
  onChange?: (value: PricingModel) => void;
  displayOnly?: boolean;
}

const PriceTag: React.FC<PriceTagProps> = ({
  value,
  onChange,
  displayOnly = false,
}) => {
  const [price, setPrice] = useState(value.price);
  const [period, setPeriod] = useState(value.period);
  const [billingFrequency, setBillingFrequency] = useState(
    value.billingFrequency,
  );
  const [currency, setCurrency] = useState(value.currency);

  const handleChange = () => {
    if (onChange) {
      onChange({ price, period, billingFrequency, currency });
    }
  };

  if (displayOnly) {
    return (
      <div>
        {/* <Typography> */}
          {getCurrencySymbol(currency)}{price} {billingFrequency} -  {period}
        {/* </Typography> */}
      </div>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => {
            setPrice(parseFloat(e.target.value));
            handleChange();
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Currency"
          select
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value as 'USD' | 'EUR' | 'CAD' | 'MXN');
            handleChange();
          }}
          fullWidth
        >
          <MenuItem value="USD">USD</MenuItem>
          <MenuItem value="EUR">EUR</MenuItem>
          <MenuItem value="CAD">CAD</MenuItem>
          <MenuItem value="MXN">MXN</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Period"
          select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value as 'month' | 'year' | '2 years' | '3 years' | '4 years' | '5 years');
            handleChange();
          }}
          fullWidth
        >
          <MenuItem value="month">Month</MenuItem>
          <MenuItem value="year">Year</MenuItem>
          <MenuItem value="week">Week</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={3}>
        <TextField
          label="Billing Frequency"
          select
          value={billingFrequency}
          onChange={(e) => {
            setBillingFrequency(e.target.value as 'monthly' | 'yearly');
            handleChange();
          }}
          fullWidth
        >
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
        </TextField>
      </Grid>
    </Grid>
  );
};

export { PriceTag, type PricingModel };
