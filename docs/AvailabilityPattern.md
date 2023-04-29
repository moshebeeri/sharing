# AvailabilityPattern

The **AvailabilityPattern** class is designed to evaluate if a given date and time match a specific pattern. The pattern is defined as a cron-like expression with 5 fields: minutes, hours, days of the month, months, and days of the week.

## Pattern format

The pattern consists of 5 space-separated fields:

```

* * * * *
- - - - -
| | | | |
| | | | +---- Day of the week (0-7, Sunday is 0 or 7)
| | | +------ Month (1-12)
| | +-------- Day of the month (1-31)
| +---------- Hour (0-23)
+------------ Minute (0-59)

```

### Field values

* Asterisk **(*)**: Represents any possible value or "any" value for a field. It acts as a wildcard.
* Hyphen **(-)**: Specifies a range. For example, **1-5** in the day of the week field means Monday to Friday.
* Slash **(/)**: Defines a step or interval between values. For example, **0-23/2** in the hour field means every two hours.

### Example patterns

```Javascript
'* * * * *': Matches any date and time, meaning the resource is always available.

'0 9-17 * * 1-5': Matches every hour on the hour from 9:00 AM to 5:00 PM, Monday to Friday.

'0 12 * * 0,6': Matches noon on weekends (Saturday and Sunday).
```

### Usage

To create a new AvailabilityPattern instance, pass the pattern string to the constructor:

```Javascript
const pattern = new AvailabilityPattern("0 9-17 * * 1-5");
```

To check if a specific date and time match the pattern, use the matches method:

```Javascript
const date = new Date(Date.UTC(2023, 0, 5, 14, 0, 0));
const result = pattern.matches(date); // Returns true if the date matches the pattern.
```

The matches method returns a boolean value indicating whether the given date and time conform to the pattern.
