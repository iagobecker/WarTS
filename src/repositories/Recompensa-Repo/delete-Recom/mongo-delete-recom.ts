import { ObjectId } from "mongodb";
import { IDeleteRecomRepository } from "../../../controllers/recompensas-Controller/delete-recom/protocols";
import { MongoClient } from "../../../database/mongo";
import { MongoRecompensa } from "../../mongo-protocols";
import { Recompensas } from "../../../models/recompensas";

export class MongoDeleteRecomRepository implements IDeleteRecomRepository {
  async deleteRecompensa(id: string): Promise<Recompensas> {
    const recompensa = await MongoClient.db
      .collection<MongoRecompensa>("recompensas")
      .findOne({ _id: new ObjectId(id) });

    if (!recompensa) {
      throw new Error("Recompensa não encontrada.");
    }
    //deletando Recompensa --- deletedCount vai contar quantas Recompensas foram deletedas
    const { deletedCount } = await MongoClient.db
      .collection("recompensas")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Recompensa não foi deletada.");
    }

    const { _id, ...rest } = recompensa;

    return { id: _id.toHexString(), ...rest };
  }
}
