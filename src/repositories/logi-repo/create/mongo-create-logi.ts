import { MongoLogi } from "./../../mongo-protocols";
import {
  CreateLogiParams,
  ICreateLogiRepository,
} from "../../../controllers/login-controller/create/protocols";
import { MongoClient } from "../../../database/mongo";
import { Logi } from "../../../models/login";

export class MongoCreateLogiRepository implements ICreateLogiRepository {
  async createLogi(params: CreateLogiParams): Promise<Logi> {
    //criando Login
    const { insertedId } = await MongoClient.db
      .collection("users")
      .insertOne(params);

    //buscando login & verificando se foi criado
    const login = await MongoClient.db
      .collection<MongoLogi>("users")
      .findOne({ _id: insertedId });
    //erro caso não tenha sido criado/encontrado
    if (!login) {
      throw new Error("Usuário não foi criado");
    }

    const { _id, ...rest } = login;
    //return { email: rest.email, password: rest.password };

    return { id: _id.toHexString(), ...rest };
  }
}
