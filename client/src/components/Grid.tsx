import React, { useState } from 'react'
import moment from 'moment'
import { v4 as uuid } from 'uuid'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Select, MenuItem, Input } from '@mui/material'
import './index.scss'

import { Modal } from './Modal';
import { DayType, ItemsType, LabelType, SERVER_URL } from './Types'

type Props = {
  calendar: DayType[],
  labels: LabelType[],
  setCalendar: React.Dispatch<React.SetStateAction<DayType[]>>,
  month: moment.Moment,
}

const reorder = (list: ItemsType[], startIndex: number, endIndex: number): ItemsType[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  result.map((it, i) => it['index'] = i)
  return result;
};


export default function Grid({ calendar, labels, setCalendar, month }: Props) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [itemName, setItemName] = useState('')
  const [itemLabel, setItemLabel] = useState<string | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedDayItemsLength, setSelectedDayItemsLength] = useState(0)

  const onAddItem = async (day_id: string | null, index: number) => {
    if(!day_id) {
      setIsOpenModal(false)
      return
    }

    const id = uuid()
    await fetch('${SERVER_URL}/items', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day_id, id, name: itemName, label_id: itemLabel, index
      })
    })

    setCalendar(prev => prev.map(day => {
      if(day.day_id === day_id) {
        return { ...day, items: [...day.items, { name: itemName, day_id, id, index, label_id: itemLabel }] }
      } else {
        return day
      }
    }))
    setIsOpenModal(false)
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      if(source.index === destination.index) return
      const dayIndex = calendar.findIndex(day => day.day_id === source.droppableId);
      const start_day_items: ItemsType[] = calendar[dayIndex].items.map(it => ({...it}))
      const reorderedItems: ItemsType[] = reorder(calendar[dayIndex].items,source.index,destination.index);
      const newCalendarState: DayType[] = [...calendar];
      newCalendarState[dayIndex].items = reorderedItems;
      
      setCalendar(newCalendarState);
      const res = await fetch(`${SERVER_URL}/items/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(reorderedItems.map((it, i) => ({ id: it.id, index: it.index })))
      })
      
      if (!res.ok) {
        newCalendarState[dayIndex].items = start_day_items;
        setCalendar(newCalendarState)
      };
    } else {
      const sourceDayIndex = calendar.findIndex(day => day.day_id === source.droppableId);
      const destinationDayIndex = calendar.findIndex(day => day.day_id === destination.droppableId);
      const sourceItems = [...calendar[sourceDayIndex].items];
      const destinationItems = [...calendar[destinationDayIndex].items];
      const startSourceItems = sourceItems.map(it => ({ ...it }))
      const startDestinationItems = destinationItems.map(it => ({ ...it }))
      const [removed] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, removed);
      const newCalendarState = [...calendar];
      newCalendarState[sourceDayIndex].items = sourceItems;
      newCalendarState[destinationDayIndex].items = destinationItems;
      
      setCalendar(newCalendarState);
      const res = await fetch(`${SERVER_URL}/items/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...sourceItems.map((it, i) => ({ id: it.id, index: i, day_id: source.droppableId })), ...destinationItems.map((it, i) => ({ id: it.id, index: i, day_id: destination.droppableId }))])
      })

      if (!res.ok) {
        newCalendarState[sourceDayIndex].items = startSourceItems;
        newCalendarState[destinationDayIndex].items = startDestinationItems;
        setCalendar(newCalendarState)
      };
    }
  }

  return (
    <div className='grid-wrapper'>
      <DragDropContext onDragEnd={onDragEnd}>
        { calendar.map(({ day, items, day_id, events }) => {
            return (
              <Droppable key={day_id} droppableId={day_id}>
                {
                  (provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className='cell_wrapper'
                      style={{
                        backgroundColor: moment(day_id).month() !== month.month() ? '#9da4b0' : '',
                      }}
                      onDoubleClick={() => { setIsOpenModal(true); setSelectedDayId(day_id); setSelectedDayItemsLength(items.length) }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ textAlign: 'left', marginLeft: 14 }}>{day.format('DD')}</div>
                        <div style={{ marginLeft: 6 }}>{ events?.length ? events[0].name : null }</div>
                      </div>
                      <div style={{ overflowY: 'auto', maxHeight: '100px', marginTop: 6, marginBottom: 6, marginRight: 4 }} className='scrollbar'>
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
                                  <div 
                                    style={{ 
                                      width: '80%', maxWidth: '80%', borderRadius: '6px', color: 'black', margin: '4px auto', padding: 4,
                                      backgroundImage: `linear-gradient(to right, ${labels.find(it => it.id === item.label_id)?.color || 'white'} 20%, white 20%)`,
                                    }}
                                  >
                                    {item.name}
                                  </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Input style={{ width: 180 }} placeholder='name' onChange={(e) => setItemName(e.target.value)}></Input>
          {
            labels.length ? (
              <Select style={{ width: 180, height: 40 }} onChange={(e) => setItemLabel(e.target.value as string)}>
                { labels.map(label => 
                    <MenuItem 
                      key={label.id} 
                      style={{ backgroundColor: label.color, height: 40, color: 'white', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)' }}
                      value={label.id}
                    >
                      {label.name}
                    </MenuItem>
                  ) 
                }
              </Select>
            ) : null
          }

          <div onClick={() => {setIsOpenModal(false); setItemName('')}} style={{ cursor: 'pointer' }}>Cencel</div>
          <div onClick={() => onAddItem(selectedDayId, selectedDayItemsLength)} style={{ cursor: 'pointer' }}>Confirm</div>
        </div>
      </Modal>
    </div>
  )
}
