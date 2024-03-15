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

export const SERVER_URL = 'https://calendar-uo04.onrender.com/'
// export const SERVER_URL = 'http://localhost:8080'
