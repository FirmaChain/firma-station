import styled from "styled-components";

export const ModalWrapper = styled.div`
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

export const ModalOverlay = styled.div`
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

export const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
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
    top: 4px;
    left: 4px;
    padding: 15px;
    display: inline-block;
    content: "〈 ";
    cursor: pointer;
    font-size: 20px;
    font-weight: 900;
    color: ${({ theme }) => theme.colors.defaultWhite};
  }
`;

export const CloseButton = styled.div`
  &:after {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 15px;
    display: inline-block;
    content: "X";
    font-size: 22px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.defaultWhite};
  }
`;
