import React from 'react';
import { MenuItem, TextField } from '@mui/material';

interface MinMaxEnumInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  enumValues?: string[];
  intervalMode?: boolean;
}

const MinMaxEnumInput: React.FC<MinMaxEnumInputProps> = ({ label, value, onChange, min, max, enumValues, intervalMode = false }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  const renderMenuItems = () => {
    if (enumValues && !intervalMode) {
      return enumValues.map((val, index) => (
        <MenuItem key={index} value={val}>
          {val}
        </MenuItem>
      ));
    }

    if (intervalMode) {
      const items = [];
      const minVal = min ?? 1;
      const limit = enumValues ? enumValues.length : (max ?? 1);
      for (let i = minVal; i <= limit; i++) {
        items.push(
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        );
      }
      return items;
    }

    if (min !== undefined && max !== undefined) {
      const items = [];
      for (let i = min; i <= max; i++) {
        items.push(
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        );
      }
      return items;
    }

    return null;
  };

  return (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      fullWidth
      select
    >
      {renderMenuItems()}
    </TextField>
  );
};

export default MinMaxEnumInput;
