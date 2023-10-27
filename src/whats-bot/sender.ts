import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import { create, Whatsapp, Message, SocketState } from "venom-bot";

export type QRCode = {
  base64Qr: string;
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
  private initialize() {
    const qr = (base64Qr: string, attempts: number, asciiQR: string) => {
      this.qr = { base64Qr, attempts, asciiQR };
      //console.log("base64 image string qrcode: ", base64Qrimg);
    };

    const status = (statusSession: string, session: string) => {
      //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail
      // || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable
      // || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser
      // || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp
      // || waitForLogin || waitChat || successChat

      this.connected = ["isLogged", "qrReadSuccess", "chatsAvailable"].includes(
        statusSession
      );
      //console.log("Status Session: ", statusSession);
      //console.log("Session name: ", session);
    };

    const start = (client: Whatsapp) => {
      this.client = client;

      client.onStateChange((state) => {
        this.connected = state === SocketState.CONNECTED;
      });
    };

    create({ session: "whats-indicate" })
      .then((client) => start(client))
      .catch((error) => console.log(error));
  }
}

export default Sender;
