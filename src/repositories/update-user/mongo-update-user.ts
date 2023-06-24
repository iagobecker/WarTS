import { ObjectId } from "mongodb";
import {
  IUpdateUserRepository,
  UpdateUserParams,
} from "../../controllers/update-user/protocols";
import { MongoClient } from "../../database/mongo";
import { User } from "../../models/user";

export class MongoUpdateUserRepository implements IUpdateUserRepository {
  async updateUser(
    id: string,
    /*tudo que foi recebido aqui no params vai ser atualizado no $set --> */ params: UpdateUserParams
  ): Promise<User> {
    await MongoClient.db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      {
        //aqui estão as propriedades que serão atualizadas, podendo acrescentar mais
        $set: {
          ...params,
        },
      }
    );
    //procurando o usuário pelo ID
    const user = await MongoClient.db
      .collection<Omit<User, "id">>("users")
      .findOne({ _id: new ObjectId(id) });
    //se não achar o usuário vai executar esse erro
    if (!user) {
      throw new Error("Usuário não atualizado");
    }

    // se achar vai executar isso tirando o id com _ e converter para um id de modo usuário
    const { _id, ...rest } = user;

    return { id: _id.toHexString(), ...rest };
  }
}
