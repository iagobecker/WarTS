import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { create, Whatsapp, SocketState } from "venom-bot";
import qrcode from "qrcode";

export type QRCode = {
  base64Qrimg: string;
  attempts: number;
  asciiQR: string;
};

//Envio WhatsApp
class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QRCode;
  private status: string;

  get isConnected(): boolean {
    return this.connected;
  }

  get qrCode(): QRCode {
    return this.qr;
  }

  //Este método Construtor chama o método initialize
  constructor() {
    this.initialize();
  }

  async sendText(to: string, body: string) {
    // 555591003912@c.us ---- o "to" é o phone
    if (!isValidPhoneNumber(to, "BR")) {
      throw new Error("Esse número não é válido");
    }

    //Formata o número para receber o +55 do Brasil e tirar o "+", e receber o @c.us para usar a API
    let phoneNumber = parsePhoneNumber(to, "BR")
      ?.format("E.164")
      .replace("+", "") as string;

    phoneNumber = phoneNumber.includes("@c.us")
      ? phoneNumber
      : `${phoneNumber}@c.us`;

    console.log("phoneNumber", phoneNumber);

    if (this.client) {
      await this.client.sendText(phoneNumber, body);
    } else {
      console.error("Cliente não está definido");
    }
  }

  //Cria o VenomBot e associa a propriedade Sender client
  private async generateQRCode(text: string): Promise<string> {
    try {
      return await qrcode.toDataURL(text);
    } catch (error) {
      throw new Error("Erro ao gerar QR Code: " + error);
    }
  }

  private initialize() {
    const qr = (base64Qrimg: string, attempts: number, asciiQR: string) => {
      this.qr = { base64Qrimg, attempts, asciiQR };
    };

    const status = (statusSession: string, session: string) => {
      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(
        statusSession
      );
    };

    const start = (client: Whatsapp) => {
      this.client = client;

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED;
      });

      client.onMessage(async (message) => {
        if (message.body === "!qr") {
          const qrText = "Texto do QRcode";
          const base64Qrimg = await this.generateQRCode(qrText);
          this.qr = { base64Qrimg, attempts: 0, asciiQR: "" };
          console.log("QR Code gerado:", base64Qrimg);
        }
      });
    };

    create({ session: "whats-indicate" })
      .then((client) => start(client))
      .catch((error) => console.log(error));
  }
}

export default Sender;
