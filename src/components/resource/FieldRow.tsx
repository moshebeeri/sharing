import React from 'react';
import { Grid, Typography, FormControlLabel, Checkbox } from '@mui/material';
import MinMaxEnumInput from './MinMaxEnumInput';

interface FieldRowProps {
  label: string;
  name: 'minutes' | 'hours' | 'daysOfMonth' | 'months' | 'daysOfWeek';
  fromValue: string;
  toValue: string;
  intervalValue: string;
  anyValue: boolean;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onIntervalChange: (value: string) => void;
  onAnyChange: (checked: boolean) => void;
  min?: number;
  max?: number;
  enumValues?: string[];
}

const FieldRow: React.FC<FieldRowProps> = ({ label, name, fromValue, toValue, intervalValue, anyValue, onFromChange, onToChange, onIntervalChange, onAnyChange, min, max, enumValues }) => {
  const handleAnyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAnyChange(event.target.checked);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={3}>
          <MinMaxEnumInput
            label="From"
            value={fromValue}
            onChange={onFromChange}
            min={min}
            max={max}
            enumValues={enumValues}
          />
        </Grid>
        <Grid item xs={3}>
          <MinMaxEnumInput
            label="To"
            value={toValue}
            onChange={onToChange}
            min={min}
            max={max}
            enumValues={enumValues}
          />
        </Grid>
        <Grid item xs={3}>
          <MinMaxEnumInput
            label="Interval"
            value={intervalValue}
            onChange={onIntervalChange}
            min={min}
            max={max}
            enumValues={enumValues}
            />
          </Grid>
          <Grid item xs={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={anyValue}
                  onChange={handleAnyChange}
                  name={name}
                />
              }
              label="Any"
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  export default FieldRow;
