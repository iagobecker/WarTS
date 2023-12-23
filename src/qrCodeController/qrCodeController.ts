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
   
    from: "Thalis Antunes <thalisantunes@hotmail.com>" ,
  
    to: "thalisantunes@hotmail.com",
   
    subject: "Parabéns, você foi indicado!" ,
   
    html: `<p>Escaneie com seu Whatsapp Web Bussiness o seguinte QR - CODE: ${qrCode}</p>`,
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
