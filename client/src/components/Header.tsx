import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful';
import { v4 as uuid } from 'uuid'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { Modal } from './Modal'
import { LabelType, SERVER_URL } from './Types';

type Props = {
  setLabels: React.Dispatch<React.SetStateAction<LabelType[]>>,
  month: moment.Moment,
  setMonth: React.Dispatch<React.SetStateAction<moment.Moment>>
}

export default function Header({ setLabels, setMonth, month }: Props) {
  const [isOenModal, setIsOpenModal] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [color, setColor] = useState("#aabbcc");

  const onAddLable = async () => {
    const id = uuid()
    const res = await fetch(`${SERVER_URL}/labels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color, id, name: labelName
      })
    })
    const label = await res.json()
    if (label) {
      setLabels(prev => {
        return [...prev, { id, name: labelName, color }]
      })
    }
    setIsOpenModal(false)
  }

  return (
    <div className='header' style={{ paddingTop: 14 }}>

      <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
        <div 
          onClick={() => 
            setMonth(prev => {
              const copy = prev.clone()
              copy.subtract(1, 'month')
              return copy
            }
          )} style={{ cursor: 'pointer' }}><KeyboardArrowLeft /></div>
        <div>{month.format('MM-YYYY')}</div>
        <div 
          onClick={() => 
            setMonth(prev => {
              const copy = prev.clone()
              copy.add(1, 'month')
              return copy
            }
          )} 
          style={{ cursor: 'pointer' }}><KeyboardArrowRight /></div>
      </div>

      <div onClick={() => setIsOpenModal(true)}>Create Lable</div>
      
      <Modal isOpen={isOenModal} onClose={() => { setIsOpenModal(false) }}>
        <div>
          <input onChange={(e) => setLabelName(e.target.value)}></input>
          <h2>Pick Color</h2>
          <HexColorPicker color={color} onChange={setColor} />
          <p>Picked color: {color}</p>
        </div>
        <div onClick={onAddLable}>Confirm</div>
      </Modal>
    </div>
  )
}
