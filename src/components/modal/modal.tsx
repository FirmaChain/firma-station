import React, { useEffect } from 'react';

import Portal from './portal';

import { ModalOverlay, ModalWrapper, ModalInner, PrevButton, CloseButton } from './styles';

interface IProps {
  onClose: () => void;
  prev?: () => void;
  closable: boolean;
  visibleClose?: boolean;
  maskClosable?: boolean;

  visible: boolean;
  width: string;
  children?: React.ReactNode;
}

const Modal = ({
  onClose,
  closable,
  visible,
  prev,
  width,
  visibleClose = true,
  maskClosable = false,
  children,
}: IProps) => {
  const close = () => {
    if (onClose) {
      onClose();
    }
  };

  const onMaskClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (maskClosable) {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = `position: ""; top: "";`;
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, []);

  return (
    <Portal elementId='modal-root'>
      <ModalOverlay visible={visible} />
      <ModalWrapper tabIndex={-1} visible={visible} onClick={onMaskClick}>
        <ModalInner tabIndex={0} width={width}>
          {prev && <PrevButton onClick={prev} />}
          {closable && visibleClose && <CloseButton onClick={close} />}
          {children}
        </ModalInner>
      </ModalWrapper>
    </Portal>
  );
};

export default React.memo(Modal);
