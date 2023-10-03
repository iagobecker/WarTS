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
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "553be306ef80a2",
      pass: "9ef5afa11f8cf2",
    },
  });

  //Configurando a Mensagem
  const message = {
    // Quem está enviando o E-mail (usando o nome da pessoa que fez a requisição)
    from: `"${req.body.name}" <${req.body.from}>`,
    // Para quem vai ser enviado (o e-mail especificado no campo "email")
    to: req.body.email,
    // Assunto do E-mail
    subject: req.body.subject,
    // Corpo do E-mail (conteúdo do E-mail)
    text: "Olá mister, estou te recomendando este negócio incrível",
  };

  try {
    //Enviando a Mensagem
    const info = await transport.sendMail(message);

    console.log("INFO", info);

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail" });
  }
};
