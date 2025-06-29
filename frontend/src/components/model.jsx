import React from 'react';
import { modalStyles as styles } from '../assets/dummystyle';
import { X } from 'lucide-react';

const Modal = ({
  children,
  isOpen,
  onclose,
  title,
  hideHeader,
  showActionBtn,
  actionBtnIcon = null,
  actionBtnText,
  onActionClick = () => {},
}) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {!hideHeader && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            {showActionBtn && (
              <button onClick={onActionClick} className={styles.actionButton}>
                {actionBtnIcon}
                {actionBtnText}
              </button>
            )}
          </div>
        )}
        <button type="button" className={styles.closeButton} onClick={onclose}>
          <X size={40} />
        </button>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
