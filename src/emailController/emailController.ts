import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const contato = async (req: Request, res: Response, recipientEmail: string) => {

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
   
    from: "Thalis Antunes <thalisantunes@hotmail.com>" ,
  
    to: recipientEmail,
   
    subject: "Parabéns, você foi indicado!" ,
   
    html: "<p>Olá mister, estou te recomendando este negócio incrível</p>",
  };

  try {
   
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

  } catch (error) {
    console.error("Erro ao enviar o e-mail:", error);
    res.status(500).json({ success: false, error: "Erro ao enviar o e-mail" });
  }
};
