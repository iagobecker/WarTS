import { IGetIndicatesRepository } from "../../../controllers/indications-controller/get-indic/protocols";
import { MongoClient } from "../../../database/mongo";
import { Indicated } from "../../../models/indicated";
import { MongoIndicate } from "./../../mongo-protocols";

export class MongoGetIndicatesRepository implements IGetIndicatesRepository {
  async getIndicates(): Promise<Indicated[]> {
    const indicates = await MongoClient.db
      .collection<MongoIndicate>("indicates")
      .find({})
      .toArray();

    return indicates.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toHexString(),
    }));
  }
}
