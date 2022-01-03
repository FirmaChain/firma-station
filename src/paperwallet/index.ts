import { PDFDocument, PDFFont, PDFImage, PDFPage, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import QRCode from "qrcode";

import { encodedMnemonicPdf, encodedPrivatekeyPdf, encodedFont } from "../constants/paperwallet";

import {
  MNEMONIC_POSITION,
  PRIVATEKEY_POSITION,
  ADDRESS1_POSITION,
  ADDRESS2_POSITION,
  MNEMONIC_QR_POSITION,
  PRIVATEKEY_QR_POSITION,
  ADDRESS1_QR_POSITION,
  ADDRESS2_QR_POSITION,
} from "./constants";

type IWalletInfo = {
  address: string;
  mnemonic: string;
  privateKey: string;
};

type IPosition = {
  x: number;
  y: number;
};

type IQrPosition = {
  x: number;
  y: number;
  width: number;
  height: number;
};

class FirmaPaperWallet {
  public wallet: IWalletInfo;

  constructor(walletInfo: IWalletInfo) {
    this.wallet = walletInfo;
  }

  async mnemonicToDataURI(): Promise<string> {
    const plainPdfFile = Buffer.from(encodedMnemonicPdf, "base64");

    let pdfDoc = await PDFDocument.load(plainPdfFile);

    pdfDoc.registerFontkit(fontkit);
    pdfDoc = await this.writeMnemonicWallet(pdfDoc);

    return pdfDoc.saveAsBase64({ dataUri: true });
  }

  async privatekeyToDataURI(): Promise<string> {
    const plainPdfFile = Buffer.from(encodedPrivatekeyPdf, "base64");

    let pdfDoc = await PDFDocument.load(plainPdfFile);

    pdfDoc.registerFontkit(fontkit);
    pdfDoc = await this.writePrivatekeyWallet(pdfDoc);

    return pdfDoc.saveAsBase64({ dataUri: true });
  }

  private async writeMnemonicWallet(pdfDoc: PDFDocument): Promise<PDFDocument> {
    const notoSansFontBytes = Buffer.from(encodedFont, "base64");
    const notoSansFont = await pdfDoc.embedFont(notoSansFontBytes);

    const pages = pdfDoc.getPages();

    this.writeFont(pages[0], notoSansFont, this.wallet.address, ADDRESS1_POSITION);
    this.writeMnemonic(pages[0], notoSansFont, this.wallet.mnemonic, MNEMONIC_POSITION);

    const addressQrCodeBase64 = await QRCode.toDataURL(this.wallet.address);
    const addressQrCodePng = await pdfDoc.embedPng(addressQrCodeBase64);

    this.drawQrCode(pages[0], addressQrCodePng, ADDRESS1_QR_POSITION);

    const mnemonicQrCodeBase64 = await QRCode.toDataURL(this.wallet.mnemonic);
    const mnemonicQrCodePng = await pdfDoc.embedPng(mnemonicQrCodeBase64);

    this.drawQrCode(pages[0], mnemonicQrCodePng, MNEMONIC_QR_POSITION);

    return pdfDoc;
  }

  private async writePrivatekeyWallet(pdfDoc: PDFDocument): Promise<PDFDocument> {
    const notoSansFontBytes = Buffer.from(encodedFont, "base64");
    const notoSansFont = await pdfDoc.embedFont(notoSansFontBytes);

    const pages = pdfDoc.getPages();

    this.writeFont(pages[0], notoSansFont, this.wallet.address, ADDRESS2_POSITION);
    this.writeFont(pages[0], notoSansFont, this.wallet.privateKey, PRIVATEKEY_POSITION);

    const addressQrCodeBase64 = await QRCode.toDataURL(this.wallet.address);
    const addressQrCodePng = await pdfDoc.embedPng(addressQrCodeBase64);

    this.drawQrCode(pages[0], addressQrCodePng, ADDRESS2_QR_POSITION);

    const privateKeyQrCodeBase64 = await QRCode.toDataURL(this.wallet.privateKey);
    const privateKeyQrCodePng = await pdfDoc.embedPng(privateKeyQrCodeBase64);

    this.drawQrCode(pages[0], privateKeyQrCodePng, PRIVATEKEY_QR_POSITION);

    return pdfDoc;
  }

  private writeMnemonic(page: PDFPage, font: PDFFont, mnemonic: string, position: IPosition) {
    const mnemonicWords = mnemonic.split(" ");
    const firstMnemonic = mnemonicWords.slice(0, Math.round(mnemonicWords.length / 2));
    const secondMnemonic = mnemonicWords.slice(Math.round(mnemonicWords.length / 2), mnemonicWords.length);

    page.drawText(firstMnemonic.join(" "), {
      x: position.x,
      y: position.y,
      size: 7,
      font: font,
      color: rgb(1, 1, 1),
    });

    page.drawText(secondMnemonic.join(" "), {
      x: position.x,
      y: position.y - 11,
      size: 7,
      font: font,
      color: rgb(1, 1, 1),
    });
  }

  private writeFont(page: PDFPage, font: PDFFont, content: string, position: IPosition) {
    page.drawText(content, {
      x: position.x,
      y: position.y,
      size: 8,
      font: font,
      color: rgb(1, 1, 1),
    });
  }

  private drawQrCode(page: PDFPage, qrCodeImage: PDFImage, qrPosition: IQrPosition) {
    page.drawImage(qrCodeImage, {
      x: qrPosition.x,
      y: qrPosition.y,
      width: qrPosition.width,
      height: qrPosition.height,
    });
  }
}

export { FirmaPaperWallet };
