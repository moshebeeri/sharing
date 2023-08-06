import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Grid,
  Box,
  FormLabel
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import FieldRow from './FieldRow'
import { useAppDispatch } from '../../app/hooks'
import { setAvailabilityPatternError } from '../../features/availabilityPattern/availabilityPatternSlice'

type PatternType = {
  minutes: string
  hours: string
  daysOfMonth: string
  weeks: string
  months: string
  daysOfWeek: string
}

interface AvailabilityPatternFormProps {
  value: string
  onChange: (value: string) => void
  onAddPattern: (value: string) => void
  fields?: (keyof PatternType)[]
  showInterval?: boolean
  showReset?: boolean
}

const parsePatternString = (patternString: string) => {
  const parts = patternString.split(' ')
  return {
    minutes: parts[0] || '*',
    hours: parts[1] || '*',
    daysOfMonth: parts[2] || '*',
    months: parts[3] || '*',
    daysOfWeek: parts[4] || '*'
  }
}

const AvailabilityPatternForm: React.FC<AvailabilityPatternFormProps> = ({
  value,
  onChange,
  fields,
  onAddPattern,
  showInterval = false,
  showReset = false
}) => {
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)
  const [pattern, setPattern] = useState({
    minutes: '*',
    hours: '*',
    daysOfMonth: '*',
    months: '*',
    daysOfWeek: '*'
  })
  const [ResetOptions, setResetOptions] = useState({
    minutes: false,
    hours: false,
    daysOfMonth: false,
    months: false,
    daysOfWeek: false
  })
  const [formValid, setFormValid] = useState(false)


  useEffect(() => {
    setPattern(parsePatternString(value))
  }, [value])

  useEffect(() => {
    const parts = value.split(' ')
    if (parts.length === 5) {
      setPattern({
        minutes: parts[0],
        hours: parts[1],
        daysOfMonth: parts[2],
        months: parts[3],
        daysOfWeek: parts[4]
      })
    }
  }, [value])
  useEffect(() => {
    if (fields) {
      const updatedPattern = { ...pattern }

      Object.keys(pattern).forEach(key => {
        if (!fields.includes(key as keyof typeof pattern)) {
          updatedPattern[key as keyof typeof pattern] = '*'
        }
      })

      onChange(Object.values(updatedPattern).join(' '))
    }
  }, [fields])

  useEffect(() => {
    onChange(Object.values(pattern).join(' '))
  }, [pattern, onChange])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (updatedValue: string, name: keyof typeof pattern) => {
    setPattern({ ...pattern, [name]: updatedValue })
  }

  const handleAddPattern = () => {
    onAddPattern(Object.values({ ...pattern }).join(' '))
  }

  const handleFieldChange = (
    value: string,
    name: keyof typeof pattern,
    field: 'from' | 'to' | 'interval'
  ) => {
    const currentValue = pattern[name]
    const parts = currentValue.split('-')
    let fromValue = parts.length === 2 ? parts[0] : ''
    let toValue = parts.length === 2 ? parts[1].split('/')[0] : ''
    let repeatValue =
      parts.length === 2 && parts[1].split('/').length === 2
        ? parts[1].split('/')[1]
        : ''

    // Validate fromValue < toValue
    // if (field === 'from' && parseFloat(value) >= parseFloat(toValue)) {
    //   console.error("The 'from' value should be less than the 'to' value.");
    //   dispatch(setAvailabilityPatternError({ hasError: true, message: "The 'from' value should be less than the 'to' value." }));
    //   return;
    // } else if (field === 'to' && parseFloat(value) <= parseFloat(fromValue)) {
    //   console.error("The 'to' value should be greater than the 'from' value.");
    //   dispatch(setAvailabilityPatternError({ hasError: true, message: "The 'to' value should be greater than the 'from' value." }));
    //   return;
    // } else {
    //   dispatch(setAvailabilityPatternError({ hasError: false, message: "" }));
    // }
    if (field === 'from') {
      fromValue = value
    } else if (field === 'to') {
      toValue = value
    } else if (field === 'interval') {
      repeatValue = value
    }

    const updatedValue = `${fromValue}-${toValue}${
      repeatValue ? '/' + repeatValue : ''
    }`
    handleChange(updatedValue, name)
  }

  const handleResetChange = (reset: boolean, name: keyof typeof pattern) => {
    setResetOptions({ ...ResetOptions, [name]: reset })
    setPattern({ ...pattern, [name]: reset ? '*' : '' })
    if (reset) {
      onChange(Object.values({ ...pattern, [name]: '*' }).join(' '))
    }
  }

  const getFromValue = (name: keyof typeof pattern) => {
    const value = pattern[name]
    const parts = value.split('-')
    return parts.length === 2 ? parts[0] : ''
  }

  const getToValue = (name: keyof typeof pattern) => {
    const value = pattern[name]
    const parts = value.split('-')
    return parts.length === 2 ? parts[1].split('/')[0] : ''
  }

  const getIntervalValue = (name: keyof typeof pattern) => {
    const value = pattern[name]
    const parts = value.split('/')
    return parts.length === 2 ? parts[1] : ''
  }
  const validateForm = () => {
    setFormValid(true)
    // if (!required || (required && value !== "")) {
    //   setFormValid(true);
    // } else {
    //   setFormValid(false);
    // }
  }

  useEffect(() => {
    validateForm()
  }, [value])



  const renderFields = (
    label: string,
    name: keyof typeof pattern,
    min?: number,
    max?: number,
    enumValues?: string[]
  ) => {
    if (fields && !fields.includes(name)) {
      return null
    }
    return (
      <FieldRow
        label={label}
        name={name}
        fromValue={getFromValue(name)}
        toValue={getToValue(name)}
        intervalValue={getIntervalValue(name)}
        resetValue={ResetOptions[name]}
        onFromChange={value => handleFieldChange(value, name, 'from')}
        onToChange={value => handleFieldChange(value, name, 'to')}
        onIntervalChange={value => handleFieldChange(value, name, 'interval')}
        onReset={(reset) => handleResetChange(reset, name)}
        min={min}
        max={max}
        enumValues={enumValues}
        showInterval={showInterval}
        showReset={showReset}
      />
    )
  }

  return (
    <div>
      <Card>
        <CardHeader
          title={`Pattern: [${value}]`}
          action={
            <IconButton onClick={handleOpen} size='small'>
              <InfoIcon />
            </IconButton>
          }
        />
        <CardContent>
          {renderFields('Minutes', 'minutes', 0, 59)}
          {renderFields('Hours', 'hours', 0, 23)}
          {renderFields('Days of Month', 'daysOfMonth', 1, 31)}
          {renderFields('Months', 'months', 1, 12)}
          {renderFields('Days of Week', 'daysOfWeek', undefined, undefined, [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
          ])}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Pattern Explanation</DialogTitle>
        <DialogContent>
          <Typography>
            The pattern consists of 5 space-separated fields: - Minutes (0-59) -
            Hours (0-23) - Days of the month (1-31) - Months (1-12) - Days of
            the week (1-7, Sunday is 1) Each field can contain a single value, a
            range of values (e.g., 1-3), or an asterisk (*) to represent all
            possible values. Additionally, a step value can be added after a
            range using a slash (e.g., 1-3/2, which means every 2nd value within
            the range).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export { AvailabilityPatternForm, type PatternType }
