import { DeleteRecomController } from "./controllers/recompensas-Controller/delete-recom/delete-recom";
import { MongoDeleteRecomRepository } from "./repositories/Recompensa-Repo/delete-Recom/mongo-delete-recom";
import { UpdateRecomController } from "./controllers/recompensas-Controller/update-Recom/update-recom";
import { MongoUpdateRecomRepository } from "./repositories/Recompensa-Repo/update-Recom/mongo-update-recom";
import { DeleteIndicatesController } from "./controllers/indications-controller/delete-indic/delete-indic";
import { MongoDeleteIndicatesRepository } from "./repositories/indications-repo/delete-indic/mongo-delete-indic";
import { UpdateIndicatesController } from "./controllers/indications-controller/update-indic/update-indic";
import { MongoUpdateIndicatesRepository } from "./repositories/indications-repo/update-indic/mongo-update-indic";
import { GetUsersController } from "./controllers/get-users/get-users";
import { MongoGetUsersRepository } from "./repositories/get_users/mongo-get-users";
import { GetIndicatesController } from "./controllers/indications-controller/get-indic/get-indic";
import { MongoGetIndicatesRepository } from "./repositories/indications-repo/get-indic/mongo-get-indicates";
import { CreateUserController } from "./controllers/create-user/create-user";
import { MongoCreateUserRepository } from "./repositories/create-user/mongo-create-user";
import { UpdateUserController } from "./controllers/update-user/update-user";
import { MongoUpdateUserRepository } from "./repositories/update-user/mongo-update-user";
import { DeleteUserController } from "./controllers/delete-user/delete-user";
import { MongoDeleteUserRepository } from "./repositories/delete-user/mongo-delete-user";
import { CreateIndicationController } from "./controllers/indications-controller/create-indic/create-indic";
import { MongoCreateIndicatedRepository } from "./repositories/indications-repo/create-indic/mongo-create-indic";
import { CreateRecomController } from "./controllers/recompensas-Controller/create-Recom/create-reco";
import { MongoCreateRecomRepository } from "./repositories/Recompensa-Repo/create-Recom/mongo-create-recom";
import { GetRecomController } from "./controllers/recompensas-Controller/get-Recom/get-reco";
import { MongoGetRecomRepository } from "./repositories/Recompensa-Repo/get-Recom/mongo-get-recom";
import { CreateLogiController } from "./controllers/login-controller/create/create";
import { MongoCreateLogiRepository } from "./repositories/logi-repo/create/mongo-create-logi";
import * as EmailController from "./emailController/emailController";
import { contato } from "../src/qrCodeController/qrCodeController";
import { AuthMiddlewares } from "./middlewares/auth";
import { Indicated } from "./models/indicated";
//import { Router } from "express";
import { MongoClient } from "./database/mongo";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { config } from "dotenv";
import { create, Whatsapp, SocketState } from "venom-bot";
import bodyParser from "body-parser";
//export const router = Router();
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";

dotenv.config();

const main = async () => {
  config();
  const app = express();

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

  app.post("/register-admin", async (req, res) => {
    try {
      const sessionName = `admin_${Date.now()}`;
      const qrCode = await createVenomInstance(req, res, sessionName);
      res.status(200).json({ sessionName, qrCode });
    } catch (error) {
      console.error("Erro ao registrar o administrador:", error);
      res
        .status(500)
        .json({ success: false, error: "Erro ao registrar o administrador" });
    }
  });

  let globalClientInstance: any;

  //Objeto para armazenar diferentes instâncias
  const sessions: Record<string, Whatsapp> = {};

  async function createVenomInstance(
    req: Request,
    res: Response,
    sessionName: string
  ) {
    try {
      const client = await create(
        sessionName,
        async (base64Qr, asciiQR, attempts, urlCode) => {
          await contato(base64Qr);

          res.status(200).json({ message: "Email enviado com sucesso!" });
        },
        undefined,
        { logQR: false }
      );

      sessions[sessionName] = client;

      console.log(`Instância ${sessionName} criada com sucesso.`);
      return client;
    } catch (error) {
      console.error(`Erro ao criar a instância ${sessionName}:`, error);
      throw error;
    }
  }

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
    try {
      const { body, statusCode } = await createIndicationController.handle({
        body: req.body,
      });
      const { phone, name, email } = req.body;
      await EmailController.contato(req, res, email);
      await sendMessage(
        globalClientInstance,
        phone,
        "Olá, tudo bem? Você foi indicado a experimentar o nosso aplicativo. Participe, indique amigos e ganhe recompensas."
      );
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ status: "error", message: error });
    }
  });

  async function sendMessage(
    client: any,
    phoneNumber: string,
    message: string
  ) {
    if (!isValidPhoneNumber(phoneNumber, "BR")) {
      throw new Error("Número de telefone inválido");
    }

    let formattedPhoneNumber = parsePhoneNumber(phoneNumber, "BR")?.format(
      "E.164"
    ) as string;
    formattedPhoneNumber = formattedPhoneNumber.includes("@c.us")
      ? formattedPhoneNumber
      : `${formattedPhoneNumber}@c.us`;

    console.log("phoneNumber", formattedPhoneNumber);

    if (client) {
      await client.sendText(formattedPhoneNumber, message);
    } else {
      console.error("Cliente não está definido");
    }
  }

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

  //POST Recompensa
  app.post("/recompensa", AuthMiddlewares, async (req, res) => {
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
  app.patch("/indications/:id", AuthMiddlewares, async (req, res) => {
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
  app.patch("/recompensa/:id", AuthMiddlewares, async (req, res) => {
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
  app.delete("/users/:id", AuthMiddlewares, async (req, res) => {
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
  app.delete("/indications/:id", AuthMiddlewares, async (req, res) => {
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
  app.delete("/recompensa/:id", AuthMiddlewares, async (req, res) => {
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
