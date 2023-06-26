import { ObjectId } from "mongodb";
import { IDeleteUserRepository } from "../../controllers/delete-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";
import { MongoUser } from "../mongo-protocols";

export class MongoDeleteUserRepository implements IDeleteUserRepository {
  async deleteUser(id: string): Promise<User> {
    const user = await MongoClient.db
      .collection<MongoUser>("users")
      .findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }
    //deletenado usuário -- deletedCount vai contar quantos usuários foram deletados
    const { deletedCount } = await MongoClient.db
      .collection("users")
      .deleteOne({ _id: new ObjectId(id) });

    if (!deletedCount) {
      throw new Error("Usuário não deletado.");
    }

    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
