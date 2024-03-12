import React, { useState } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './index.scss'

import { Modal } from './Modal';
import { DAY_FORMAT_PATTERN } from '../constants'
import { DayType, ItemsType, LabelType } from './Main'

type Props = {
  calendar: DayType[],
  labels: LabelType[],
  setCalendar: React.Dispatch<React.SetStateAction<DayType[]>>,
}

const reorder = (list: ItemsType[], startIndex: number, endIndex: number): ItemsType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


export default function Grid({ calendar, labels, setCalendar }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemLabel, setItemLabel] = useState<string | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedDayItemsLength, setSelectedDayItemsLength] = useState(0)

  const onAddItem = (day_id: string | null, index: number) => {
    if(!day_id) {
      setIsOpenModal(false)
      return
    }
    setCalendar(prev => prev.map(day => {
      if(day.day_id === day_id) {
        return { ...day, items: [...day.items, { name: itemName, day_id, id: uuid(), index, label_id: itemLabel }] }
      } else {
        return day
      }
    }))
    setIsOpenModal(false)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const dayIndex = calendar.findIndex(day => day.day_id === source.droppableId);
      const reorderedItems: ItemsType[] = reorder(
        calendar[dayIndex].items,
        source.index,
        destination.index
      );
      const newCalendarState: DayType[] = [...calendar];
      newCalendarState[dayIndex].items = reorderedItems;
      setCalendar(newCalendarState);
    } else {
      const sourceDayIndex = calendar.findIndex(day => day.day_id === source.droppableId);
      const destinationDayIndex = calendar.findIndex(day => day.day_id === destination.droppableId);
      const sourceItems = [...calendar[sourceDayIndex].items];
      const destinationItems = [...calendar[destinationDayIndex].items];
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      const newCalendarState = [...calendar];
      newCalendarState[sourceDayIndex].items = sourceItems;
      newCalendarState[destinationDayIndex].items = destinationItems;
      setCalendar(newCalendarState);
    }
  }

  return (
    <div className='grid-wrapper'>
      <DragDropContext onDragEnd={onDragEnd}>
        { calendar.map(({ day, items, day_id }) => {
            return (
              <Droppable key={day_id} droppableId={day_id}>
                {
                  (provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='cell_wrapper' 
                      onDoubleClick={() => { setIsOpenModal(true); setSelectedDayId(day_id); setSelectedDayItemsLength(items.length) }}
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

      <Modal isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div>
          <input onChange={(e) => setItemName(e.target.value)}></input>
          <select onChange={(e) => setItemLabel(e.target.value)}>
            { labels.map(label => 
                <option 
                  key={label.id} 
                  style={{ display: 'block', backgroundColor: label.color, height: 30, width: 70 }} 
                  value={label.id}
                >
                  {label.name}
                </option>
              ) 
            }
          </select>
          <div onClick={() => {setIsOpenModal(false); setItemName('')}}>Cencel</div>
          <div onClick={() => onAddItem(selectedDayId, selectedDayItemsLength)}>Confirm</div>
        </div>
      </Modal>
    </div>
  )
}

