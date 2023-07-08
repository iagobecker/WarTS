import { ObjectId } from "mongodb";
import {
  IUpdateIndicatesRepository,
  UpdateIndicatesParams,
} from "./../../../controllers/indications-controller/update-indic/protocols";
import { MongoClient } from "../../../database/mongo";
import { Indicated } from "../../../models/indicated";
import { MongoIndicate } from "../../mongo-protocols";

export class MongoUpdateIndicatesRepository
  implements IUpdateIndicatesRepository
{
  async updateIndicate(
    id: string,
    /*tudo que foi recebido aqui no params vai ser atualizado no $set --> */ params: UpdateIndicatesParams
  ): Promise<Indicated> {
    await MongoClient.db.collection("indications").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );
    //procurando a indicação pelo ID
    const indications = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: new ObjectId(id) });

    if (!indications) {
      throw new Error("Indicação não atualizada.");
    }

    const { _id, ...rest } = indications;

    return { id: _id.toHexString(), ...rest };
  }
}
