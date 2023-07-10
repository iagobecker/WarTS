import { ObjectId } from "mongodb";
import { IDeleteIndicatesRepository } from "../../../controllers/indications-controller/delete-indic/protocols";
import { MongoClient } from "../../../database/mongo";
import { Indicated } from "../../../models/indicated";
import { MongoIndicate } from "../../mongo-protocols";

export class MongoDeleteIndicatesRepository
  implements IDeleteIndicatesRepository
{
  async deleteIndicate(id: string): Promise<Indicated> {
    const indications = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: new ObjectId(id) });

    if (!indications) {
      throw new Error("Indicação não encontrada.");
    }

    const { deletedCount } = await MongoClient.db
      .collection("indications")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Indicação não deletada.");
    }

    const { _id, ...rest } = indications;

    return { id: _id.toHexString(), ...rest };
  }
}
