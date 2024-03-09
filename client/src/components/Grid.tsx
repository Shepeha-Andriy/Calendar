import React from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.scss'

import { DAY_FORMAT_PATTERN } from '../constants'
import { CalendarType } from './Main'

type Props = {
  calendar: CalendarType[],
  setCalendar: React.Dispatch<React.SetStateAction<CalendarType[]>>,
}

export default function Grid({ calendar, setCalendar }: Props) {

  const onAddItem = (day_id: string, ) => {
    setCalendar(prev => prev.map(day => {
      if(day.day_id === day_id) {
        return { ...day, items: [...day.items, { name: `test ${Math.random() * 20}`, day_id, id: uuid()}] }
      } else {
        return day
      }
    }))
  }

  return (
    <div className='grid-wrapper'>
      <DragDropContext onDragEnd={() => {}}>
        { calendar.map(({ day, items, day_id }) => {
            return (
              <Droppable key={day_id} droppableId={day_id}>
                {
                  (provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='cell_wrapper' 
                      onDoubleClick={() => onAddItem(day_id)}
                    >
                      <div>{day.format('DD')}</div>
                      <div>
                        { items.map((item, index) => 
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {
                              (provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{ ...provided.draggableProps.style, }}
                                >
                                  {item.name}
                                </div>
                              )
                            }
                          </Draggable>
                          )
                        }
                      </div>
                    </div>
                  )
                }
              </Droppable>
            )
          })
        }
      </DragDropContext>
    </div>
  )
}

