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
import { Auth } from "./middlewares/auth";
//import { Router } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MongoCreateRecomRepository } from "./repositories/Recompensa-Repo/create-Recom/mongo-create-recom";
import { CreateRecomController } from "./controllers/recompensas-Controller/create-Recom/create-reco";

dotenv.config();

const main = async () => {
  config();

  const app = express();

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
  app.get("/indications", async (req, res) => {
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
  app.post("/indicates", async (req, res) => {
    const mongoCreateIndicatedRepository = new MongoCreateIndicatedRepository();

    const createIndicationController = new CreateIndicationController(
      mongoCreateIndicatedRepository
    );

    const { body, statusCode } = await createIndicationController.handle({
      body: req.body,
    });

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
  app.post("/login", Auth.private, async (req, res) => {
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

  const port = process.env.PORT || 8000;

  app.listen(port, () => console.log(`Ouvindo na porta ${port}!`));
};

main();
