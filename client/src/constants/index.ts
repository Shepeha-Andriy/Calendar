import moment from "moment"
moment.updateLocale('en', { week: { dow: 1 } })

export const DAY_FORMAT_PATTERN = 'YYYY-MM-DD'
export const START_DAY = moment().startOf('month').startOf('week')
const temp_END_DAY = moment().endOf('month').endOf('week')

const temp_days_difference = temp_END_DAY.diff(START_DAY, 'days')
if (temp_days_difference + 1 === 28) {
  temp_END_DAY.add(1, 'week')
}

if (temp_days_difference + 1 === 35) {
  temp_END_DAY.add(1, 'week')
}

export const END_DAY = temp_END_DAY