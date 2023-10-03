import { DeleteRecomController } from "./controllers/recompensas-Controller/delete-recom/delete-recom";
import { MongoDeleteRecomRepository } from "./repositories/Recompensa-Repo/delete-Recom/mongo-delete-recom";
import { UpdateRecomController } from "./controllers/recompensas-Controller/update-Recom/update-recom";
import { MongoUpdateRecomRepository } from "./repositories/Recompensa-Repo/update-Recom/mongo-update-recom";
import { CreateLogiController } from "./controllers/login-controller/create/create";
import { DeleteIndicatesController } from "./controllers/indications-controller/delete-indic/delete-indic";
import { MongoDeleteIndicatesRepository } from "./repositories/indications-repo/delete-indic/mongo-delete-indic";
import { UpdateIndicatesController } from "./controllers/indications-controller/update-indic/update-indic";
import { MongoUpdateIndicatesRepository } from "./repositories/indications-repo/update-indic/mongo-update-indic";
import express from "express";
import { config } from "dotenv";
import { GetUsersController } from "./controllers/get-users/get-users";
import { GetIndicatesController } from "./controllers/indications-controller/get-indic/get-indic";
import { MongoGetIndicatesRepository } from "./repositories/indications-repo/get-indic/mongo-get-indicates";
import { MongoGetUsersRepository } from "./repositories/get_users/mongo-get-users";
import { MongoClient } from "./database/mongo";
import { MongoCreateUserRepository } from "./repositories/create-user/mongo-create-user";
import { CreateUserController } from "./controllers/create-user/create-user";
import { MongoUpdateUserRepository } from "./repositories/update-user/mongo-update-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
import { MongoDeleteUserRepository } from "./repositories/delete-user/mongo-delete-user";
import { DeleteUserController } from "./controllers/delete-user/delete-user";
import { MongoCreateIndicatedRepository } from "./repositories/indications-repo/create-indic/mongo-create-indic";
import { CreateIndicationController } from "./controllers/indications-controller/create-indic/create-indic";
import { Indicated } from "./models/indicated";
import { MongoCreateLogiRepository } from "./repositories/logi-repo/create/mongo-create-logi";
//import { Auth } from "./middlewares/auth";
//import { Router } from "express";
//import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoCreateRecomRepository } from "./repositories/Recompensa-Repo/create-Recom/mongo-create-recom";
import { CreateRecomController } from "./controllers/recompensas-Controller/create-Recom/create-reco";
import { MongoGetRecomRepository } from "./repositories/Recompensa-Repo/get-Recom/mongo-get-recom";
import { GetRecomController } from "./controllers/recompensas-Controller/get-Recom/get-reco";
import { Router } from "express";
//-----
import { hash } from "bcryptjs";
import { AuthMiddlewares } from "./middlewares/auth";
//import { AuthController } from "./controllers/AuthController";

//const authController = new AuthController();

export const router = Router();

//import axios from "axios";
import bodyParser from "body-parser";

//-----

//imports envio de WhatsApp
import Sender from "./whats-bot/sender";

import * as EmailController from "./emailController/emailController";

dotenv.config();

const main = async () => {
  config();

  const app = express();
  //----------------
  //const sender = new Sender();
  app.use(express.urlencoded({ extended: false }));

  app.use(bodyParser.json());
  app.use(express.json());

  await MongoClient.connect();

  //GET Users
  app.get("/users", async (req, res) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository();

    const getUsersController = new GetUsersController(mongoGetUsersRepository);

    const { body, statusCode } = await getUsersController.handle();

    res.status(statusCode).send(body);
  });

  //GET Indicates
  app.get("/indications", AuthMiddlewares, async (req, res) => {
    const mongoGetIndicatesRepository = new MongoGetIndicatesRepository();

    const getIndicatesController = new GetIndicatesController(
      mongoGetIndicatesRepository
    );

    const { body, statusCode } = await getIndicatesController.handle();

    res.status(statusCode).send(body);
  });

  // Rota para obter indicação por nome da pessoa indicada
  app.get("/indications/:name", async (req, res) => {
    const { name } = req.params;

    try {
      const mongoGetIndicatesRepository = new MongoGetIndicatesRepository();

      const getIndicatesController = new GetIndicatesController(
        mongoGetIndicatesRepository
      );

      // Chamar o controlador para obter as indicações
      const { body, statusCode } = await getIndicatesController.handle();

      if (statusCode !== 200) {
        return res.status(statusCode).send(body);
      }
      // Verificar se 'body' é um array válido antes de acessar suas propriedades
      const indications = Array.isArray(body) ? body : [];

      // Filtrar a indicação com base no nome da pessoa indicada
      const indication = indications.find(
        (indication: Indicated) => indication.name === name
      );

      if (!indication) {
        return res.status(statusCode).send("Indicação não encontrada");
      }

      res.status(200).send(indication);
    } catch (error) {
      console.error("Erro ao obter indicação por nome:", error);
      res.status(500).send("Erro ao obter indicação por nome");
    }
  });

  //GET Recompensas
  app.get("/recompensas", AuthMiddlewares, async (req, res) => {
    const mongoGetRecomRepository = new MongoGetRecomRepository();

    const getRecomController = new GetRecomController(mongoGetRecomRepository);

    const { body, statusCode } = await getRecomController.handle();

    res.status(statusCode).send(body);
  });

  //POST /users
  app.post("/users", async (req, res) => {
    const mongoCreateUserRepository = new MongoCreateUserRepository();

    const createUserController = new CreateUserController(
      mongoCreateUserRepository
    );

    const { body, statusCode } = await createUserController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  //POST /indications
  app.post("/indications", async (req, res) => {
    const mongoCreateIndicatedRepository = new MongoCreateIndicatedRepository();

    const createIndicationController = new CreateIndicationController(
      mongoCreateIndicatedRepository
    );
    EmailController.contato;

    const { body, statusCode } = await createIndicationController.handle({
      body: req.body,
    });

    ///MANDANDO ZAP ZAP
    /* const { phone } = req.body;
    try {
      await sender.sendText(
        phone,
        "Olá mister, estou te recomendando este negócio incrível"
      );
      return res.status(200).json();
    } catch (error) {
      console.error("error", error);
    }*/

    /*app.get("/status", (req, res) => {
      return res.send({
        qr_code: sender.qrCode,
        connected: sender.isConnected,
      });
    });*/

    //----------------------

    /* if (req.body.phone) {
      // Substitua 'Instance_token' pelo token real da API
      const instanceToken = "Instance_token";

      // URL correta para enviar mensagens via Ultramsg API
      const ultramsgUrl = "https://api.ultramsg.com/instance1150/messages/chat";

      try {
        const response = await axios.post(ultramsgUrl, {
          token: instanceToken,
          to: req.body.phone,
          body: "Olá mister, estou te recomendando este negócio incrível",
          priority: "10",
          referenceId: "",
        });

        // Verifique a resposta da API e aja de acordo
        if (response.status === 200) {
          console.log("Mensagem de WhatsApp enviada com sucesso.");
        } else {
          console.error("Erro ao enviar mensagem de WhatsApp:", response.data);
        }
      } catch (error) {
        console.error("Erro ao enviar mensagem de WhatsApp:", error);
      }
    } else {
      console.error("Número de telefone não fornecido na solicitação.");
    }*/

    //------------------------

    res.status(statusCode).send(body);
  });

  ///-----------------------

  /*// Rota para autenticação de usuário (login)
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifique se o email e a senha correspondem a um usuário válido no banco de dados
    const user = await getUserFromDatabase(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gere um token JWT com as informações do usuário
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '2h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error('Erro durante o login:', error);
    res.status(500).json({ message: 'Erro durante o login' });
  }
});

*/

  //POST Login
  app.post("/login", async (req, res) => {
    const mongoCreateLogiRepository = new MongoCreateLogiRepository();

    const createLogiController = new CreateLogiController(
      mongoCreateLogiRepository
    );

    const { body, statusCode } = await createLogiController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  //POST Auth
  // router.post("/auth", authController.authenticate);

  //GET Login
  app.get("/login", async (req, res) => {
    const mongoGetUsersRepository = new MongoGetUsersRepository();

    const getUsersController = new GetUsersController(mongoGetUsersRepository);

    const { body, statusCode } = await getUsersController.handle();

    res.status(statusCode).send(body);
  });

  //POST Recompensa
  app.post("/recompensa", async (req, res) => {
    const mongoCreateRecomRepository = new MongoCreateRecomRepository();

    const createRecomController = new CreateRecomController(
      mongoCreateRecomRepository
    );

    const { body, statusCode } = await createRecomController.handle({
      body: req.body,
    });

    res.status(statusCode).send(body);
  });

  //PATCH Users
  app.patch("/users/:id", async (req, res) => {
    const mongoUpdateUserRepository = new MongoUpdateUserRepository();

    const updateUserController = new UpdateUserController(
      mongoUpdateUserRepository
    );

    const { body, statusCode } = await updateUserController.handle({
      body: req.body,
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  //PATCH Indications
  app.patch("/indications/:id", async (req, res) => {
    const mongoUpdateIndicatesRepository = new MongoUpdateIndicatesRepository();

    const updateIndicatesController = new UpdateIndicatesController(
      mongoUpdateIndicatesRepository
    );

    const { body, statusCode } = await updateIndicatesController.handle({
      body: req.body,
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  //PATCH Recompensa
  app.patch("/recompensa/:id", async (req, res) => {
    const mongoUpdateRecomRepository = new MongoUpdateRecomRepository();

    const updateRecomController = new UpdateRecomController(
      mongoUpdateRecomRepository
    );

    const { body, statusCode } = await updateRecomController.handle({
      body: req.body,
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  //Delete user
  app.delete("/users/:id", async (req, res) => {
    const mongoDeleteUserRepository = new MongoDeleteUserRepository();

    const deleteUserController = new DeleteUserController(
      mongoDeleteUserRepository
    );

    const { body, statusCode } = await deleteUserController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  //Delete Indication
  app.delete("/indications/:id", async (req, res) => {
    const mongoDeleteIndicatesRepository = new MongoDeleteIndicatesRepository();

    const deleteIndicatesController = new DeleteIndicatesController(
      mongoDeleteIndicatesRepository
    );

    const { body, statusCode } = await deleteIndicatesController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  //Delete Recompensa
  app.delete("/recompensa/:id", async (req, res) => {
    const mongoDeleteRecomRepository = new MongoDeleteRecomRepository();

    const deleteRecomController = new DeleteRecomController(
      mongoDeleteRecomRepository
    );

    const { body, statusCode } = await deleteRecomController.handle({
      params: req.params,
    });

    res.status(statusCode).send(body);
  });

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Ouvindo na porta ${port}!`));
};

main();
