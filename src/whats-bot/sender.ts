import { create, Whatsapp, Message, SocketState } from "venom-bot";
import { start } from "repl";
import { type } from "os";

export type QRCode = {
  base64Qr: string;
  attempts: number;
};

//Envio WhatsApp
class Sender {
  private client: Whatsapp;
  private connected: boolean;
  private qr: QRCode;

  get isConnected(): boolean {
    return this.connected;
  }

  get qrCode(): QRCode {
    return this.qr;
  }

  constructor() {
    this.initialize();
  }

  async sendText(to: string, body: string) {
    // 555591003912@c.us
    if (this.client) {
      await this.client.sendText(to, body);
    } else {
      console.error("Cliente não está definido");
    }
  }

  async sendLinkPreview(to: string, url: string, caption: string) {
    if (this.client) {
      const result = await this.client.sendLinkPreview(to, url, caption);
      return result;
    } else {
      console.error("Cliente não está definido");
      return null;
    }
  }

  private initialize() {
    const qr = (
      base64Qr: string,

      attempts: number
    ) => {
      this.qr = { base64Qr, attempts };
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

      //código a baixo envia a MSG
      this.sendText(
        "555599293516@c.us",
        "Olá Thalis, estou te recomendando este negócio incrível"
      );
    };

    create({ session: "whats-indicate" })
      .then((client) => start(client))
      .catch((error) => console.log(error));
  }
}

export default Sender;
