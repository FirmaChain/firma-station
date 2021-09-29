import React, { useEffect } from "react";

import Portal from "./portal";
import { ModalOverlay, ModalWrapper, ModalInner, PrevButton, CloseButton } from "./styles";

function Modal({ onClose, closable, visible, prev, width, children }) {
  const close = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.cssText = `position: fixed; top: -${window.scrollY}px`;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = `position: ""; top: "";`;
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, []);

  return (
    <Portal elementId="modal-root">
      <ModalOverlay visible={visible} />
      <ModalWrapper tabIndex={-1} visible={visible}>
        <ModalInner tabIndex={0} width={width}>
          {prev && <PrevButton onClick={prev} />}
          {closable && <CloseButton onClick={close} />}
          {children}
        </ModalInner>
      </ModalWrapper>
    </Portal>
  );
}

export default Modal;
