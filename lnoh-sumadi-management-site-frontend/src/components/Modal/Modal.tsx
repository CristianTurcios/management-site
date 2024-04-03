import React, { FC } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
    isShowing: boolean
}
const Modal: FC<ModalProps> = ({ isShowing, children }) => (isShowing ? ReactDOM.createPortal(
  <>
    {children}
  </>, document.body,
) : null);

export default Modal;
