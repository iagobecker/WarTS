import nodemailer from "nodemailer";

export const contato = async (qrCode: any) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "iagosbm97@gmail.com",
      pass: "rqkshgzaqvnxigrx",
    },
  });

  const message = {
    from: "Cardial I.T <thalisantunes@hotmail.com>",

    to: "iago.mendonca20@gmail.com",

    subject: "Bem vindo ao app Indiki",

    html: `<p>Olá, tudo bem? Seja muito bem vindo. Para começar escaneie o seguinte QR-CODE: </p> <img src="cid:qrCode@nodemailer.com" alt="QR Code" />`,
    attachments: [
      {
        filename: "qrcode.png",
        content: qrCode.split("base64,")[1],
        encoding: "base64",
        cid: "qrCode@nodemailer.com",
      },
    ],
  };

  try {
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Erro ao enviar o e-mail:", error);
      } else {
        console.log("E-mail enviado: " + info.response);
      }
    });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
  }
};
