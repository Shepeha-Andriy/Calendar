import React, { useState } from 'react'
import { HexColorPicker } from 'react-colorful';
import { v4 as uuid } from 'uuid'
import { Modal } from './Modal'
import { LabelType } from './Main';

type Props = {
  setLabels: React.Dispatch<React.SetStateAction<LabelType[]>>,
}

export default function Header({ setLabels }: Props) {
  const [isOenModal, setIsOpenModal] = useState(false)
  const [labelName, setLabelName] = useState('')
  const [color, setColor] = useState("#aabbcc");

  const onAddLable = () => {
    setLabels(prev => {
      return [...prev, { id: uuid(), name: labelName, color }]
    })
    setIsOpenModal(false)
  }

  return (
    <div>
      Header

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
