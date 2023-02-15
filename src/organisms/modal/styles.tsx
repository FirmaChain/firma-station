import styled, { keyframes } from 'styled-components';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ImportPrivateKeyIcon from '@mui/icons-material/ImportExport';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LogoutIcon from '@mui/icons-material/Logout';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HelpIconOrigin from '@mui/icons-material/Help';
import { getRestakeStatusColor } from '../../utils/common';

export const loginModalWidth = '544px';
export const newWalletModalWidth = '600px';
export const recoverMnemonicModalWidth = '544px';
export const connectLedgerModalWidth = '544px';
export const confirmTxModalWidth = '480px';
export const changePasswordModalWidth = '544px';
export const delegateModalWidth = '544px';
export const exportMnemonicModalWidth = '544px';
export const exportPrivatekeyModalWidth = '544px';
export const newProposalModalWidth = '544px';
export const paperwalletModalWidth = '600px';
export const qrCodeModalWidth = '400px';
export const queueTxModalWidth = '500px';
export const redelegateModalWidth = '544px';
export const depositModalWidth = '544px';
export const undelegateModalWidth = '544px';
export const confirmWalletModalWidth = '544px';
export const gasEstimationModalWidth = '500px';
export const sendModalWidth = '544px';
export const votingModalWidth = '544px';
export const restakeModalWidth = '544px';

export const disconnectModalWidth = '480px';
export const settingModalWidth = '500px';

export const ModalContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const ModalTitle = styled.div`
  width: 100%;
  margin-bottom: 30px;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.sizes.modalTitle};
  color: white;
  text-align: center;
  font-family: 'Metropolis-SemiBold' !important;
  font-weight: 600;

  & > svg {
    cursor: pointer;
    width: 22px;
    height: 22px;
    padding-left: 5px;
  }
`;

export const ModalSubTitle = styled.div`
  width: 100%;
  color: #b4b4b4;
  text-align: center;
  font-size: ${({ theme }) => theme.sizes.modal14};
  margin-bottom: 20px;
`;

export const ModalContent = styled.div`
  width: calc(100%);
  height: 100%;
  font-size: ${({ theme }) => theme.sizes.modalLabel};
  display: flex;
  justify-content: center;
  flex-direction: column;
  & > div:nth-child(1) > div:nth-child(1) {
    margin-top: 0 !important;
  }
`;

export const ButtonStyleByStatus = styled.div<{ status: number }>`
  width: calc(100% - 2px);
  height: 48px;
  line-height: 48px;
  font-size: 1.7rem;
  font-weight: 400;
  border: 1px solid #ffffff00;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  margin-top: 30px;
  ${(props) => {
    switch (props.status) {
      case 0:
        return 'background-color:#3550de;color:white;';
      case 1:
        return 'background-color:#383745;color:white;';
      case 2:
        return 'background-color:#2D2C3A;color:#ffffff50;';
      case 3:
        return 'background-color:#ffffff00;color:#b4b4b4;border:1px solid #ffffff60;';
      default:
        return 'background-color:#383745;color:white;';
    }
  }}
`;

export const InputBoxStyleDefault = styled.input`
  width: calc(100% - 22px);
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding: 0 10px;
  font-size: 1.6rem;
  border: 1px solid #ffffff00;
  background-color: #3d3b48;
  color: white;
  outline: none;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const InputDivBoxStyleDefault = styled.div`
  width: calc(100% - 22px);
  height: 40px;
  line-height: 40px;
  margin: 0;
  padding: 0 10px;
  font-size: 1.6rem;
  border: 1px solid #ffffff00;
  background-color: #3d3b48;
  color: white;
  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const ModalTypoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalTypo = styled.div`
  text-align: center;
  line-height: 40px;
  color: #ffc542;
`;

export const ModalToggleWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: ${({ theme }) => theme.sizes.modal16};
  color: #9090a2;
`;

export const ModalTooltipWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-top: 10px;
`;

export const ModalTooltipTypo = styled.div`
  text-align: left;
  color: #ffc542;
  line-height: 20px;
  flex: 1 1 100%;
  font-size: 1.3rem;
`;

export const ModalTooltipIcon = styled.div`
  width: 20px;
  height: 20px;
  flex: 1 1 25px;
  margin-right: 7px;
  background: url('${({ theme }) => theme.urls.tooltip}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

export const QRContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const QRCodeWrap = styled.div`
  width: 140px;
  height: 140px;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const AddressTypo = styled.div`
  width: 100%;
  text-align: center;
  height: 35px;
  line-height: 35px;
  margin-top: 20px;
  color: #ccc;
  font-size: ${({ theme }) => theme.sizes.modal14};
  border-radius: 10px;
  background-color: #15151f;
`;

export const ModalLabel = styled.div`
  position: relative;
  width: 100%;
  margin-top: 24px;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.modal16};
  font-weight: 400;
  color: #b4b4b4;
`;

export const ModalInput = styled.div`
  position: relative;
  font-size: ${({ theme }) => theme.sizes.modal16};
  color: #ccc;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalValue = styled.div`
  position: relative;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.modal16};
  color: #ccc;
`;

export const ConfirmWrapper = styled.div`
  width: 100%;
  display: flex;
  height: 30px;
  line-height: 30px;
`;

export const ConfirmLabel = styled.div`
  width: 100%;
  font-size: ${({ theme }) => theme.sizes.modal16};
  color: #b4b4b4;
`;

export const ConfirmInput = styled.div<{ point?: boolean }>`
  width: 100%;
  text-align: right;
  position: relative;
  font-size: ${({ theme }) => theme.sizes.modal14};
  color: #b4b4b4;
  & > span {
    font-size: ${({ theme }) => theme.sizes.modal14};
    color: #b4b4b4;
  }
  ${(props) =>
    props.point &&
    `font-size:${props.theme.sizes.modal20};color:white;& > span { font-size: ${props.theme.sizes.modal16};`}
`;

export const InputBoxDefault = styled(InputBoxStyleDefault)<{ isInvalid?: boolean }>`
  border: 1px solid ${(props) => (props.isInvalid ? `${props.theme.colors.mainred}50` : '#ffffff00')};
`;

export const InputBoxNumber = styled(InputBoxStyleDefault)<{ isInvalid?: boolean }>`
  border: 1px solid ${(props) => (props.isInvalid ? `${props.theme.colors.mainred}50` : '#ffffff00')};
  text-align: right;
  padding-right: 63px;
  width: calc(100% - 2px - 10px - 63px);
`;

export const InputMessageText = styled.div<{ isActive: boolean }>`
  width: 100%;
  height: 10px;
  line-height: 10px;
  margin-top: 10px;
  padding: 0 5px;
  ${(props) => (props.isActive ? 'display:block;' : 'display:none;')}
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
  background-color: #525369;
  color: #ccc;
`;

export const MnemonicTextArea = styled.textarea<{ ref: any }>`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: ${({ theme }) => theme.sizes.modal16};
  background-color: #3d3b48;
  color: white;
  border: 0;
  outline: none;
  &:focus {
    border: 0;
    outline-color: #ffffff30;
    text-shadow: none;
  }
`;

export const TextAreaDefault = styled.textarea`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  font-size: ${({ theme }) => theme.sizes.modal16};
  background-color: #3d3b48;
  color: white;
  border: 0;
  outline: none;
  &:focus {
    border: 0;
    outline-color: #ffffff30;
    text-shadow: none;
  }
`;

export const PrivatekeyTextArea = styled.textarea<{ ref: any }>`
  width: calc(100% - 20px);
  height: 100px;
  padding: 10px;
  resize: none;
  outline: none;
  font-size: ${({ theme }) => theme.sizes.modal16};
  background-color: #3d3b48;
  color: white;
  border: 0;
  &:focus {
    border: 0;
    outline-color: #ffffff30;
    text-shadow: none;
  }
`;

export const CopyIcon = styled(FileCopyIcon)`
  height: 20px !important;
  position: absolute;
  top: -25px;
  left: 80px;
  cursor: pointer;
`;

export const CancelButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const NextButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const DownloadButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const ExportButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const ChangeButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const CreateButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const RecoverButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const ImportButton = styled.div<{ active: boolean }>`
  width: 220px;
  height: 48px;
  font-size: ${({ theme }) => theme.sizes.modal18};
  line-height: 48px;
  text-align: center;
  margin: 30px auto 0 auto;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainblue};
  border-radius: 4px;
  cursor: pointer;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const MenuListWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
  white-space: pre-wrap;
`;

export const MenuItemWrap = styled.div<{ disabled?: boolean }>`
  height: 70px;
  padding: 20px 0 28px 0;
  flex: 1;
  ${(props) => (props.disabled ? `border: 1px solid #ffffff10;& > div {color:#888}` : `border: 1px solid #ffffff40;`)}
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #ffffff20;
  }
`;

export const MenuTitleTypo = styled.div`
  line-height: 20px;
  text-align: center;
  margin: 0 20px;
  color: #eee;
  font-size: ${({ theme }) => theme.sizes.modalTypo};
`;

export const MenuIconImg = styled.div`
  text-align: center;
  margin-bottom: 8px;
  color: #eee;
  & > svg {
    font-size: ${({ theme }) => theme.sizes.modalIcon};
  }
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 0 20px;
  margin-bottom: 20px;
`;

export const InputWrapper = styled.div`
  flex: 1;

  & > div {
    margin-top: 0;
  }
`;

export const InputBox = styled(InputDivBoxStyleDefault)<{ active: boolean }>`
  ${(props) => (props.active ? `border: 1px solid #888;` : ``)}
  cursor: pointer;
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
  background-color: #525369;
  color: #ccc;
  margin-bottom: 10px;
  cursor: pointer;
  &:hover {
    background-color: #ffffff50;
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
  gap: 10px 10px;
`;

export const VotingItem = styled.div<{ active: boolean }>`
  width: calc(50% - 10px);
  height: 50px;
  line-height: 50px;
  cursor: pointer;
  color: white;
  border-radius: 4px;
  border: 2px solid #ffffff00;
  text-align: center;
  background-color: #1c1c24;
  ${(props) => props.active && `border:2px solid white`};
`;

export const PasswordWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ExportPasswordWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const SamplePaperWallet = styled.div`
  width: 530px;
  height: 250px;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 30px;
  background: url('${({ theme }) => theme.urls.paperwallet}');
  background-color: #44444f;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: bottom;
  border-radius: 8px;
`;

export const QueueTypoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 17px;
`;

export const QueueTypoOne = styled.div`
  text-align: center;
  line-height: 20px;
  font-size: ${({ theme }) => theme.sizes.modal14};
  color: #999;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const AfterTypo = styled.div<{ isActive: boolean }>`
  display: ${(props) => (props.isActive ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation-duration: 2s;
  animation-timing-function: ease-out;
  animation-name: ${fadeIn};
  animation-fill-mode: forwards;
`;

export const MaxButton = styled.div<{ active: boolean }>`
  width: 50px;
  height: 20px;
  line-height: 19px;
  text-align: center;
  position: absolute;
  font-size: 1.3rem;
  top: 11px;
  right: 0;
  cursor: pointer;
  color: #ddd;
  border-left: 1px solid #888;
  ${(props) => (props.active ? `` : `background-color: #444;color:#777`)}
`;

export const HelpIcon = styled(HelpIconOrigin)`
  opacity: 0.4;
`;

export const ValueContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 1.4rem;
  margin-top: 20px;
`;

export const ValueItem = styled.div`
  width: 100%;
  display: flex;
`;

export const ValueLabel = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  color: #999;
`;

export const ValueText = styled.div`
  width: 100%;
  height: 30px;
  text-align: right;
  color: #efefef;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const MoreViewContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const MoreView = styled.div`
  display: flex;
  color: #5972a8;
  text-decoration: underline;
  font-size: 1.4rem;
  cursor: pointer;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
`;

export const RestakeButton = styled(ButtonStyleByStatus)<{ status: number }>``;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 15px;
  margin-bottom: 15px;
  border-bottom: 1px dashed #555;
`;

export const DividerSolid = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #555;
`;

export const StatusBox = styled.div<{ status: number }>`
  width: auto;
  display: inline-block;
  text-align: center;
  height: 22px;
  line-height: 22px;
  background-color: #555;
  font-size: 1.4rem;
  color: ${(props) => `${getRestakeStatusColor(props.status)}`};
  background-color: ${(props) => `${getRestakeStatusColor(props.status)}30`};
  padding: 1px 8px 1px 8px;
  border-radius: 15px;
`;

export const MoreInformation = styled.div`
  font-size: 1.4rem;
  color: #bbb;
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #292a31;
  border-radius: 4px;
  padding: 10px 15px;
  gap: 10px;
`;

export const ModalTooltipBackWrapper = styled.div`
  width: calc(100% - 30px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background-color: #292a31;
  border-radius: 4px;
  padding: 15px 15px;
  margin-bottom: 10px;
`;

export const MoreLeftContent = styled.div`
  display: flex;
  gap: 5px;
`;
export const ArrowIcon = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  text-align: right;
`;

export const MoreLabelWrapper = styled.div`
  width: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const MoreContents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const MoreContent = styled.div`
  width: 100%;
  min-height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftLabel = styled.div`
  color: #888;
`;

export const RightValue = styled.div`
  color: #999;
`;

export const TimeBox = styled.div`
  height: 20px;
  line-height: 20px;
  text-align: center;
  background-color: #545454;
  color: #ccc;
  padding: 1px 8px 1px 8px;
  border-radius: 15px;
  margin-top: -1px;
`;

export const MobileAppWrapper = styled.div`
  width: 100%;
  display: flex;
`;
export const MobileAppButton = styled.div`
  width: 100%;
  height: 132px;
  background-image: url('${({ theme }) => theme.urls.connectMobileBg}');
  background-size: contain;
  background-color: #3550de;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
`;
export const MobileAppButtonIcon = styled.div`
  width: 131px;
  height: 24px;
  background-image: url('${({ theme }) => theme.urls.loginLogo}');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.7;
`;
export const MobileAppButtonTypo = styled.div`
  font-size: 2.4rem;
  color: white;
`;
export const DividerOR = styled.div`
  width: 100%;
  height: 60px;
  position: relative;
`;
export const DividerORTypo = styled.div`
  position: absolute;
  text-align: center;
  width: 70px;
  top: 50%;
  left: 50%;
  color: #b5b5b5;
  font-size: 1.6rem;
  transform: translate(-50%, -50%);
  background-color: #21212f;
`;
export const DividerORLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: #fff;
  opacity: 0.1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
export const LoginMenuListWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
`;
export const LoginMenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const LoginMenuButton = styled(ButtonStyleByStatus)<{ status: number }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  margin: 0;
`;

export const RecoverTypeWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const RecoverTypeList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3d3b48;
  border-radius: 20px;
  padding: 3px;
`;
export const RecoverTypeItem = styled.div<{ isActive: boolean }>`
  font-size: 1.6rem;
  padding: 7px 20px;
  border-radius: 20px;
  cursor: pointer;
  ${(props) => (props.isActive ? 'color: white;background-color: #3550de;' : 'color: #ffffffaa')}
`;

export const ConfirmContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  background-color: #15151f;
  padding: 20px;
`;

export const ModalInputWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ModalInputRowWrap = styled.div`
  width: 100%;
  display: flex;
  & > div {
    margin: 0;
    width: 100%;
  }
  & > div:nth-child(2) {
    text-align: right;
  }
`;

export const QRContainer = styled.div`
  width: 100%;
  height: 208px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const QRTimerText = styled.div`
  color: white;
  background-color: #3550de;
  padding: 7px 10px;
  border-radius: 20px;
  display: flex;
  gap: 5px;
  cursor: pointer;
`;

export const RefreshIconButton = styled.div`
  width: 16px;
  height: 16px;
  background-image: url('${({ theme }) => theme.urls.refresh}');
  background-size: contain;
  background-position: center;
`;

export const SettingMenuListWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 14px;
`;

export const SettingMenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const SettingMenuButton = styled(ButtonStyleByStatus)<{ status: number }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  margin: 0;
`;

export const DisconnectButton = styled(ButtonStyleByStatus)<{ status: number }>`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 8px;
  margin: 0;
`;

export const MnemonicBox = styled.div`
  background-color: #15151f;
  border-radius: 10px;
  padding: 20px 45px;
  line-height: 24px;
  color: #b4b4b4;
  text-align: center;
  white-space: pre-wrap;
  font-size: 1.5rem;
`;

export const PrivatekeyBox = styled.div`
  background-color: #15151f;
  border-radius: 10px;
  padding: 20px 20px;
  line-height: 24px;
  color: #b4b4b4;
  text-align: center;
  white-space: pre-wrap;
  font-size: 1.6rem;
`;

export const DisconnectIconWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DisconnectIcon = styled.div`
  width: 90px;
  height: 90px;
  background-image: url('${({ theme }) => theme.urls.disconnect}');
  background-size: contain;
  background-position: center;
`;

export const DisconnectTitle = styled.div`
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.sizes.modalTitle};
  color: white;
  text-align: center;
  font-family: 'Metropolis-SemiBold' !important;
  font-weight: 600;
  margin-bottom: 20px;
`;

export const DisconnectDescription = styled.div`
  width: 100%;
  height: 20px;
  line-height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b4b4b4;
  text-align: center;
  white-space: pre;
`;

export const ExportQRContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  margin-bottom: 20px;
`;

export const QRWrapper = styled.div`
  width: 140px;
  height: 140px;
  padding: 14px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ContactUsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;
export const ContactUsLeftTypo = styled.div`
  font-size: 1.6rem;
  color: white;
  opacity: 0.5;
`;
export const ContactUsRightTypo = styled.div`
  text-align: right;
  font-size: 1.6rem;
  color: White;
  text-decoration: underline;
  cursor: pointer;
`;

export const QRGuide = styled.div`
  margin-top: 34px;
  line-height: 24px;
  color: white;
  font-size: 1.6rem;
  text-align: center;
  white-space: pre;
`;

export const GuideContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #15151f;
  padding: 40px 24px;
  margin-left: -24px;
  margin-top: 40px;
  margin-bottom: -34px;
  border-radius: 0 0 4px 4px;
`;

export const GuideStep = styled.div`
  width: 105px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const GuideIcon = styled.div<{ step: number }>`
  width: 54px;
  height: 54px;
  background-image: url('${(props) => props.theme.urls['mobileLoginStep' + props.step]}');
  background-size: contain;
  background-position: center;
  margin-bottom: 10px;
`;

export const GuideText = styled.div`
  white-space: pre;
  text-align: center;
  font-size: 1.4rem;
  color: #dddddd;
`;

export const StepDivider = styled.div`
  height: 40px;
  color: white;
  font-size: 1.4rem;
  opacity: 0.5;
  margin: 0 14px;
`;

export { ImportPrivateKeyIcon, QrCodeIcon, LogoutIcon, PictureAsPdfIcon };
