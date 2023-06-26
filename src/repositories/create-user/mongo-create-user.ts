import {
  CreateUserParams,
  ICreateUserRepository,
} from "../../controllers/create-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoCreateUserRepository implements ICreateUserRepository {
  async createUser(params: CreateUserParams): Promise<User> {
    //criando usuário
    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(params);
    //buscando usuário e verificando se foi criado
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: insertedId });
    //erro caso não tenha sido criado/encontrado
    if (!user) {
      throw new Error("Usuário não foi criado");
    }

    const { _id, ...rest } = user;
    //retorna o usuário criado e substitui o id com _(anderline) por id sem _(anderline)
    return { id: _id.toHexString(), ...rest };
  }
}
