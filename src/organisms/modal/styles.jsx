import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import NewWalletIcon from "@mui/icons-material/AddBox";
import RecoverMnemonicIcon from "@mui/icons-material/Restore";
import ImportPrivateKeyIcon from "@mui/icons-material/ImportExport";
import ConnectLedgerIcon from "@mui/icons-material/Usb";

export const loginModalWidth = "900px";
export const newWalletModalWidth = "650px";
export const confirmWalletModalWidth = "650px";
export const recoverMnemonicModalWidth = "600px";
export const importPrivatekeyModalWidth = "600px";
export const connectLedgerModalWidth = "600px";

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
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: 16px;
  border-radius: 4px;
  background-color: #1b1c22;
  color: white;
`;

export const PrivatekeyTextArea = styled.textarea`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: 16px;
  border-radius: 4px;
  background-color: #1b1c22;
  color: white;
`;

export const CopyIcon = styled(FileCopyIcon)`
  height: 20px !important;
  position: absolute;
  top: -35px;
  left: 84px;
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
  margin: 30px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const RecoverButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const ImportButton = styled.div`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: #3550de;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const MenuListWrap = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  gap: 0 30px;
  margin: 10px 20px 0 20px;
  white-space: pre-wrap;
`;

export const MenuItemWrap = styled.div`
  height: 70px;
  padding: 30px 10px;
  flex: 1;
  border: 1px solid #324ab8aa;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #324ab8aa;
  }
`;

export const MenuTitleTypo = styled.div`
  line-height: 20px;
  text-align: center;
  margin: 0 20px;
  color: #eee;
`;

export const MenuIconImg = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 0 20px;
  margin-bottom: 20px;
`;

export const InputWrapper = styled.div`
  flex: 1;
`;

export const InputBox = styled.div`
  width: calc(100% - 12px);
  height: 35px;
  padding-left: 10px;
  line-height: 35px;
  color: #777;
  background-color: #1b1c22;
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `border: 1px solid #324ab8;` : `border: 1px solid #555;`)}
`;

export const SelectContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const SelectMnemonic = styled.div`
  width: 32%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 4px;
  background-color: #3550de40;
  color: #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #3550de80;
  }
`;

export { NewWalletIcon, RecoverMnemonicIcon, ImportPrivateKeyIcon, ConnectLedgerIcon };
