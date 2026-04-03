function addDays(date, days) {
  const nextDate = new Date(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function formatWeekday(date) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
  }).format(date)
}

export function getPickupDates(baseDate = new Date()) {
  const today = new Date(baseDate)

  return [
    {
      label: 'Today',
      sublabel: formatShortDate(today),
    },
    {
      label: 'Tomorrow',
      sublabel: formatShortDate(addDays(today, 1)),
    },
    {
      label: formatWeekday(addDays(today, 2)),
      sublabel: formatShortDate(addDays(today, 2)),
    },
  ]
}

export function getDefaultPickupDate(baseDate = new Date()) {
  return getPickupDates(baseDate)[0]
}

export function getValidSelectedPickupDate(selectedDate, selectedDateLabel, baseDate = new Date()) {
  const pickupDates = getPickupDates(baseDate)
  const matchedDate = pickupDates.find((pickupDate) => pickupDate.label === selectedDate)

  if (!matchedDate) {
    return getDefaultPickupDate(baseDate)
  }

  if (matchedDate.sublabel !== selectedDateLabel) {
    return matchedDate
  }

  return {
    label: selectedDate,
    sublabel: selectedDateLabel,
  }
}
