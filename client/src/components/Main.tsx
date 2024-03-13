import React, { useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import Header from './Header'
import Grid from './Grid'

import { START_DAY, END_DAY, DAY_FORMAT_PATTERN } from '../constants'

moment.updateLocale('en', { week: { dow: 1 } })
export type ItemsType = {
  id: string
  name: string,
  day_id: string,
  index: number,
  label_id: string | null,
}

export type EventType = {
  day_id: string,
  name: string
}

export type DayType = {
  day: moment.Moment,
  items: ItemsType[],
  day_id: string,
  events: EventType[] | null,
}

export type LabelType = {
  id: string,
  name: string,
  color: string,
}

export default function Main() {
  const [month, setMonth] = useState(moment)
  const [calendar, setCalendar] = useState<DayType[]>([])
  const [labels, setLabels] = useState<LabelType[]>([])

  const START_DAY = useMemo(() => moment(month).startOf('month').startOf('week'), [month])
  const temp_END_DAY = useMemo(() => moment().endOf('month').endOf('week'), [month])
  const temp_days_difference = useMemo(() => temp_END_DAY.diff(START_DAY, 'days'), [month, calendar])
  if (temp_days_difference + 1 === 28) {
    temp_END_DAY.add(1, 'week')
  }
  if (temp_days_difference + 1 === 35) {
    temp_END_DAY.add(1, 'week')
  }
  const END_DAY = useMemo(() => temp_END_DAY, [month])

  useEffect(() => {
    (async() => {
      const data = (await fetch('https://date.nager.at/api/v3/PublicHolidays/2024/ua'))
      const events: any[] = await data.json()

      const items_request = (await fetch('http://localhost:8080/items'))
      const items: ItemsType[] = await items_request.json() || []
      const labels_request = (await fetch('http://localhost:8080/labels'))
      const labels: LabelType[] = await labels_request.json() || []

      let temp_current_day = START_DAY.clone()
      const temp_calendar = []
      while (!temp_current_day.isAfter(END_DAY)) {
        const day_events = events.filter(event => event.date === temp_current_day.format('YYYY-MM-DD'))
        temp_calendar.push({
          day: temp_current_day.clone(),
          items: items.filter(item => item.day_id === temp_current_day.format('YYYY-MM-DD')).sort((a, b) => a.index - b.index),
          day_id: temp_current_day.format('YYYY-MM-DD'),
          events: day_events.length ? day_events : null,
        })

        temp_current_day = temp_current_day.add(1, 'day')
      }
      setCalendar(temp_calendar)
    })()
  }, [month])

  // console.log(calendar)
  return (
    <div>
      <Header setLabels={setLabels}></Header>
      <Grid labels={labels} calendar={calendar} setCalendar={setCalendar}></Grid>
    </div>
  )
}
