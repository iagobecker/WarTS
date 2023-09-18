import {
  CreateRecomParams,
  ICreateRecomRepository,
} from "../../../controllers/recompensas-Controller/create-Recom/protocols";
import { MongoClient } from "../../../database/mongo";
import { Recompensas } from "../../../models/recompensas";
import { MongoRecompensa } from "../../mongo-protocols";

export class MongoCreateRecomRepository implements ICreateRecomRepository {
  async createRecompensa(params: CreateRecomParams): Promise<Recompensas> {
    //Criando Recompensa no BD
    const { insertedId } = await MongoClient.db
      .collection("recompensas")
      .insertOne(params);
    //buscando Recompensa e verificando se foi criada
    const recompensa = await MongoClient.db
      .collection<MongoRecompensa>("recompensas")
      .findOne({ _id: insertedId });
    //erro caso não tenha sido criado ou encontrado
    if (!recompensa) {
      throw new Error("Recompensa não foi criada!");
    }

    const { _id, ...rest } = recompensa;
    //retorna a Recompensa e substitui o id com _ por um id sem _
    return { id: _id.toHexString(), ...rest };
  }
}
