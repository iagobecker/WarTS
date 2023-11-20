import fs = require("fs");
import venom from "venom-bot";
//import writeFile from "./writeFile/out.png"

async function generateQRCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    venom.create("whats-indicate", (base64Qr, asciiQR) => {
      //console.log(asciiQR); // Opcional: exibir o QR no terminal
      const matches = base64Qr.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

      const response: Record<string, any> = {};

      if (!matches || matches.length !== 3) {
        reject(new Error("Invalid input string"));
      }
      if (!matches || matches.length !== 3) {
        throw new Error("String de entrada inválida");
      }

      response.type = matches[1];
      response.data = Buffer.from(matches[2], "base64");

      const imageBuffer = response;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require("fs")
        .writeFile(
          "out.png",
          imageBuffer["data"],
          "binary",
          function (err: null) {
            if (err != null) {
              console.log(err);
            }
          },
          undefined,
          { logQR: false }
        )
        .then((client: any) => {
          start(client);
        })
        .catch((erro: any) => {
          console.log(erro);
        });
    });
  });
}

export default generateQRCode;

function start(client: any) {
  throw new Error("Function not implemented.");
}
