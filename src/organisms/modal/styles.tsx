import styled from "styled-components";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import NewWalletIcon from "@mui/icons-material/AddBox";
import RecoverMnemonicIcon from "@mui/icons-material/Restore";
import ImportPrivateKeyIcon from "@mui/icons-material/ImportExport";
import ConnectLedgerIcon from "@mui/icons-material/Usb";

export const qrCodeModalWidth = "500px";
export const loginModalWidth = "900px";
export const newWalletModalWidth = "650px";
export const confirmWalletModalWidth = "650px";
export const recoverMnemonicModalWidth = "600px";
export const importPrivatekeyModalWidth = "600px";
export const connectLedgerModalWidth = "600px";
export const confirmTxModalWidth = "400px";
export const delegateModalWidth = "500px";
export const depositModalWidth = "500px";
export const networksModalWidth = "500px";
export const newProposalModalWidth = "500px";
export const queueTxModalWidth = "500px";
export const redelegateModalWidth = "500px";
export const resultTxModalWidth = "500px";
export const sendModalWidth = "500px";
export const undelegateModalWidth = "500px";
export const votingModalWidth = "500px";

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

export const QRContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const QRCodeWrap = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eee;
  & > div {
    margin: auto;
  }
`;

export const AddressTypo = styled.div`
  margin-top: 20px;
  font-size: 14px;
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

export const ConfirmWrapper = styled.div`
  width: 100%;
  display: flex;
`;

export const ConfirmLabel = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
`;

export const ConfirmInput = styled.div`
  width: 100%;
  height: 30px;
  line-height: 30px;
  text-align: right;
  position: relative;
  font-size: 14px;
  color: #ccc;
`;

export const InputBoxDefault = styled.input<{ isInvalid?: boolean }>`
  width: calc(100% - 24px);
  height: 30px;
  line-height: 30px;
  margin: 0;
  padding: 0 10px;
  color: white;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border: 1px solid ${(props) => (props.isInvalid ? `${props.theme.colors.mainred}` : "#324ab8aa")};
  border-radius: 4px;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const InputMessageText = styled.div`
  width: 100%;
  height: 10px;
  line-height: 10px;
  margin-top: 10px;
  padding: 0 5px;
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
  background-color: ${({ theme }) => theme.colors.mainblue}40;
  color: #ccc;
`;

export const MnemonicTextArea = styled.textarea<{ ref: any }>`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  color: white;
`;

export const TextAreaDefault = styled.textarea`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  border: 1px solid #324ab8aa;
  color: white;
`;

export const PrivatekeyTextArea = styled.textarea<{ ref: any }>`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: 16px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  color: white;
`;

export const CopyIcon = styled(FileCopyIcon)`
  height: 20px !important;
  position: absolute;
  top: -35px;
  left: 84px;
  cursor: pointer;
`;

export const NextButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 10px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const CreateButton = styled.div<{ isActive: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.isActive ? `` : `background-color: #444;color:#777`)}
`;

export const RecoverButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const ImportButton = styled.div<{ active: boolean }>`
  width: 100px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
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

export const InputBox = styled.div<{ active: boolean }>`
  width: calc(100% - 12px);
  height: 35px;
  padding-left: 10px;
  line-height: 35px;
  color: #777;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
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
  background-color: ${({ theme }) => theme.colors.mainblue}40;
  color: #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.mainblue}80;
  }
`;

export const LoadingWrapper = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
`;

export const NetworkList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  text-align: center;
  gap: 20px 0;
`;
export const NetworkItem = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

export const SelectWrapper = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

export const ParamTable = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ParamHeader = styled.div`
  display: flex;
  border-top: 1px solid #888;
  border-bottom: 1px solid #888;
`;

export const ParamBody = styled.div`
  display: flex;
`;

export const Param = styled.div`
  width: 30%;
  padding: 5px 10px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  &:last-child {
    width: 10%;
  }
`;

export const AddButton = styled.div`
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  position: absolute;
  top: -35px;
  left: 70px;
`;

export const DeleteButton = styled.div`
  width: 24px;
  height: 24px;
  line-height: 24px;
  margin-top: 4px;
  margin-left: 3px;
  text-align: center;
  color: white;
  background-color: #d8424a;
  border-radius: 4px;
  cursor: pointer;
`;

export const VotingWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
`;
export const VotingItem = styled.div<{ active: boolean }>`
  width: calc(50% - 12px);
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.mainblue}80;
  text-align: center;
  ${(props) => props.active && `background-color:${props.theme.colors.mainblue}80`};
`;

export const PasswordWrapper = styled.div`
  display: flex;
  width: 100%;
  margin-top: 40px;
`;

export { NewWalletIcon, RecoverMnemonicIcon, ImportPrivateKeyIcon, ConnectLedgerIcon };
