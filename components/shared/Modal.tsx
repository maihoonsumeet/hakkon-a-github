
import React from 'react';

interface ModalProps {
    title: string;
    message: string;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, message, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>{title}</h2>
            <p>{message}</p>
            <button onClick={onClose}>OKAY!</button>
        </div>
    </div>
);

export default Modal;
