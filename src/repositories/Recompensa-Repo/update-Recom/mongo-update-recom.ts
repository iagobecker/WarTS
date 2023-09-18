import { ObjectId } from "mongodb";
import {
  IUpdateRecomRepository,
  UpdateRecomParams,
} from "../../../controllers/recompensas-Controller/update-Recom/protocols";
import { MongoClient } from "../../../database/mongo";
import { MongoRecompensa } from "../../mongo-protocols";
import { Recompensas } from "../../../models/recompensas";

export class MongoUpdateRecomRepository implements IUpdateRecomRepository {
  async updateRecompensa(
    id: string,
    params: UpdateRecomParams
  ): Promise<Recompensas> {
    await MongoClient.db.collection("recompensas").updateOne(
      { _id: new ObjectId(id) },
      {
        //propriedades que serão Atualizadas
        $set: {
          ...params,
        },
      }
    );
    //procurando Recompensa pelo ID
    const recompensa = await MongoClient.db
      .collection<MongoRecompensa>("recompensas")
      .findOne({ _id: new ObjectId(id) });
    //se não achar a Recompensa vai executar esse erro
    if (!recompensa) {
      throw new Error("Recompensa NÃO atualizada");
    }

    const { _id, ...rest } = recompensa;

    return { id: _id.toHexString(), ...rest };
  }
}
