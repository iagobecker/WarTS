import { IGetRecomRepository } from "../../../controllers/recompensas-Controller/get-Recom/protocols";
import { MongoClient } from "../../../database/mongo";
import { Recompensas } from "../../../models/recompensas";
import { MongoRecompensa } from "../../mongo-protocols";

export class MongoGetRecomRepository implements IGetRecomRepository {
  async getRecompensa(): Promise<Recompensas[]> {
    const recompensa = await MongoClient.db
      .collection<MongoRecompensa>("recompensas")
      .find({})
      .toArray();

    return recompensa.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
}
