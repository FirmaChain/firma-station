import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";

export const ModalContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px 0;
`;

export const ModalTitle = styled.div`
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: ${({ theme }) => theme.sizes.modalTitle};
  text-align: center;
`;

export const ModalContent = styled.div`
  width: calc(100% - 60px);
  height: 100%;
  padding: 0 30px;
  font-size: ${({ theme }) => theme.sizes.modalLabel};
`;

export const ModalLabel = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  margin-bottom: 8px;
`;

export const ModalInput = styled.div`
  position: relative;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 30px;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const MnemonicContainter = styled.div`
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 10px 0;
`;

export const Mnemonic = styled.div`
  width: 15%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  background-color: #3550de40;
  color: #ccc;
`;

export const MnemonicTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  resize: none;
  border-radius: 4px;
  background-color: #1b1c22;
  color: white;
`;

export const CopyIcon = styled(FileCopyIcon)`
  height: 20px !important;
  position: absolute;
  top: -35px;
  left: 90px;
  cursor: pointer;
`;

export const NextButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
`;

export const CreateButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;
