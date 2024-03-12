import { Transition } from 'react-transition-group';
import './index.scss'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const onCloseClick = (e: any) => {
    e.stopPropagation()

    onClose()
  }

  return (
    // <Transition in={isOpen} timeout={1350} unmountOnExit={true}>
    //   {
    //     (state: any) => (
          // <div className={`modal modal--${state}`}>
        <div className={`modal`}>
          <div className="modal-wraper">
            <div className="modal-content">
              <span className="modal-close-button" onClick={onClose}>X</span>
              {children}
            </div>
          </div>
        </div>
        // )
      // }
    // </Transition>
  );
};
