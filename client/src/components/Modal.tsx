import './index.scss'

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: any
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`modal`}>
      <div className="modal-wraper">
        <div className="modal-content">
          <span className="modal-close-button" onClick={onClose}>X</span>
          {children}
        </div>
      </div>
    </div>
  );
};
