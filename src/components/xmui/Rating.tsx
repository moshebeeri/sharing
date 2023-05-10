import React from 'react';
import { Rating as MuiRating, Avatar, Box } from '@mui/material';

interface RatingProps {
  value: number;
  readOnly?: boolean;
  sharerImageUrl?: string;
  onChange?: (value: number) => void;
}

const Rating: React.FC<RatingProps> = ({ value, readOnly = false, sharerImageUrl, onChange }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (onChange && newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      {sharerImageUrl && (
        <Avatar
          alt="Sharer"
          src={sharerImageUrl}
          sx={{
            width: 48,
            height: 48,
            marginRight: 1,
          }}
        />
      )}
      <MuiRating
        name="rating"
        value={value}
        readOnly={readOnly}
        onChange={handleChange}
        max={1}
        precision={0.2}
      />
    </Box>
  );
};

export { Rating };
