import styled from "styled-components";

export const ModalWrapper = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  height: auto;
`;

export const ModalOverlay = styled.div<{ visible: boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
`;

export const ModalInner = styled.div<{ width: string }>`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: #21212f;
  border-radius: 4px;
  width: ${(props) => (props.width ? props.width : "300px")};
  max-width: ${(props) => (props.width ? props.width : "300px")};
  height: auto;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
  padding: 40px 20px;
  color: ${({ theme }) => theme.colors.defaultWhite};
`;

export const PrevButton = styled.div`
  &:after {
    position: absolute;
    top: 6px;
    left: 8px;
    padding: 15px;
    display: inline-block;
    content: "〈 ";
    cursor: pointer;
    font-size: ${({ theme }) => theme.sizes.modalButton};
    font-weight: 900;
    color: #888;
  }
`;

export const CloseButton = styled.div`
  position: absolute;
  width: 18px;
  height: 18px;
  top: 0px;
  right: 0px;
  display: inline-block;
  cursor: pointer;
  margin: 20px;
  color: ${({ theme }) => theme.colors.defaultWhite};
  background-image: url("${({ theme }) => theme.urls.close}");
  background-size: contain;
`;
