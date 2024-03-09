import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import Header from './Header'
import Grid from './Grid'

import { START_DAY, END_DAY, DAY_FORMAT_PATTERN } from '../constants'

moment.updateLocale('en', { week: { dow: 1 } })
type ItemsType = {
  id: string
  name: string,
  day_id: string
}

export type CalendarType = {
  day: moment.Moment,
  items: ItemsType[],
  day_id: string,
}

export default function Main() {
  const [month, setMonth] = useState(moment)
  const [calendar, setCalendar] = useState<CalendarType[]>([])

  const START_DAY = useMemo(() => moment(month).startOf('month').startOf('week'), [month])
  const temp_END_DAY = useMemo(() => moment().endOf('month').endOf('week'), [month])
  const temp_days_difference = useMemo(() => temp_END_DAY.diff(START_DAY, 'days'), [month])
  if (temp_days_difference + 1 === 28) {
    temp_END_DAY.add(1, 'week')
  }
  if (temp_days_difference + 1 === 35) {
    temp_END_DAY.add(1, 'week')
  }
  const END_DAY = useMemo(() => temp_END_DAY, [month])

  useEffect(() => {
    let temp_current_day = START_DAY.clone()
    const temp_calendar = []
    while (!temp_current_day.isAfter(END_DAY)) {
      temp_calendar.push({
        day: temp_current_day.clone(),
        items: [],
        day_id: temp_current_day.format('YYYY-MM-DD')
      })

      temp_current_day = temp_current_day.add(1, 'day')
    }
    setCalendar(temp_calendar)
  }, [month])

  console.log(1111)
  return (
    <div>
      <Header></Header>
      <Grid calendar={calendar} setCalendar={setCalendar}></Grid>
    </div>
  )
}
