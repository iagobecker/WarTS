import { IGetUsersRepository } from "../../controllers/get-users/protocols";
import { User } from "../../models/user";

export class MongoGetUsersRepository implements IGetUsersRepository {
  async getUsers(): Promise<User[]> {
    return [
      {
        name: "Iago",
        email: "iago@gmail.com",
        password: "Iago123",
      },
    ];

    throw new Error("Método não implementado.");
  }
}
