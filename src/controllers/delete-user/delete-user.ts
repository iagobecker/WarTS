import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import { IDeleteUserController, IDeleteUserRepository } from "./protocols";

export class DeleteUserController implements IDeleteUserController {
  constructor(private readonly deleteUserRepository: IDeleteUserRepository) {}
  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      //verificando se o ID foi recebido
      const id = httpRequest?.params?.id;

      if (!id) {
        return {
          statusCode: 400,
          body: "Id de usuário ausente.",
        };
      }

      const user = await this.deleteUserRepository.deleteUser(id);

      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Algo deu errado.",
      };
    }
  }
}
