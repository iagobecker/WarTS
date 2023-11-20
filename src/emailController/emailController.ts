import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const contato = async (req: Request, res: Response) => {
  //configurando o Transporter
  //para fazer um envio REAL tem que trocar o transport
  /*
  host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "553be306ef80a2",
      pass: "9ef5afa11f8cf2",
  */
  /* const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "553be306ef80a2",
      pass: "9ef5afa11f8cf2",
    },
  });
*/
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "iagosbm97@gmail.com",
      pass: "rqkshgzaqvnxigrx",
    },
  });

  //Configurando a Mensagem
  const message = {
    // Quem está enviando o E-mail (usando o nome da pessoa que fez a requisição)
    from: "iagosbm97@gmail.com" /* `"${req.body.name}" <${req.body.email}>`,*/,
    // Para quem vai ser enviado (o e-mail especificado no campo "email")
    to: "beckeriago83@gmail.com",
    // Assunto do E-mail
    subject: "Parabéns, você foi indicado!" /*req.body.subject,*/,
    // Corpo do E-mail (conteúdo do E-mail)
    //text: "Olá mister, estou te recomendando este negócio incrível",
    html: "<p>Olá mister, estou te recomendando este negócio incrível</p>",
  };

  try {
    //Enviando a Mensagem
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.error("Erro ao enviar o e-mail:", error);
        res
          .status(500)
          .json({ message: "Ocorreu um erro ao enviar o e-mail." });
      } else {
        console.log("E-mail enviado: " + info.response);
        res.status(200).json({ message: "E-mail enviado com sucesso!" });
      }
    });

    //const info = await transport.sendMail(message);

    //console.log("INFO", info);

    //res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail" });
  }
};
