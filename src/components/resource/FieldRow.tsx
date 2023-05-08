import React from 'react'
import { Grid, Typography, FormControlLabel, Checkbox, Button } from '@mui/material'
import MinMaxEnumInput from './MinMaxEnumInput'

interface FieldRowProps {
  label: string
  name: 'minutes' | 'hours' | 'daysOfMonth' | 'months' | 'daysOfWeek'
  fromValue: string
  toValue: string
  intervalValue: string
  resetValue: boolean
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onIntervalChange: (value: string) => void
  onReset: (reset: boolean) => void
  min?: number
  max?: number
  enumValues?: string[]
  showInterval: boolean
  showReset: boolean
}

const FieldRow: React.FC<FieldRowProps> = ({
  label,
  name,
  fromValue,
  toValue,
  intervalValue,
  resetValue,
  onFromChange,
  onToChange,
  onIntervalChange,
  onReset,
  min,
  max,
  enumValues,
  showInterval = false,
  showReset = false,
}) => {
  const handleReset = (event: React.MouseEvent<HTMLButtonElement>) => {
    onReset(true)
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems='center'>
        <Grid item xs={2}>
          <Typography>{label}</Typography>
        </Grid>
        <Grid item xs={3}>
          <MinMaxEnumInput
            label='From'
            value={fromValue}
            onChange={onFromChange}
            min={min}
            max={max}
            enumValues={enumValues}
          />
        </Grid>
        <Grid item xs={3}>
          <MinMaxEnumInput
            label='To'
            value={toValue}
            onChange={onToChange}
            min={min}
            max={max}
            enumValues={enumValues}
          />
        </Grid>
        {
          showInterval && (
            <Grid item xs={3}>
              <MinMaxEnumInput
                label='Interval'
                value={intervalValue}
                onChange={onIntervalChange}
                min={min}
                max={max}
                enumValues={enumValues}
                intervalMode={true}
              />
            </Grid>
          )
        }
        {
          showReset && (
            <Grid item xs={1}>
              <Button
                variant='outlined'
                color='primary'
                onClick={handleReset}
                size='small'
                sx={{ padding: '5px' }}
              >
                Reset
              </Button>
            </Grid>
          )
        }
      </Grid>
    </React.Fragment>
  )
}

export default FieldRow
