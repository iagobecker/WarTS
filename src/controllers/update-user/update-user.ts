import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "../protocols";
import {
  IUpdateUserController,
  IUpdateUserRepository,
  UpdateUserParams,
} from "./protocols";

export class UpdateUserController implements IUpdateUserController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}
  async handle(HttpRequest: HttpRequest<any>): Promise<HttpResponse<User>> {
    try {
      const id = HttpRequest?.params?.id;
      const body = HttpRequest?.body;

      if (!id) {
        return {
          statusCode: 400,
          body: "id de usuário ausente",
        };
      }

      const allowedFieldsToUpdate: /*Campos permitidos para atualizar */ (keyof UpdateUserParams)[] =
        ["name", "password"];

      const someFieldIsNotAllowedToUpdate /*algum campo não tem permissão para atualizar */ =
        Object.keys(body).some(
          (key) =>
            !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
        );

      if (someFieldIsNotAllowedToUpdate) {
        return {
          statusCode: 400,
          body: "Alguns campos recebidos não são permitidos",
        };
      }

      const user = await this.updateUserRepository.updateUser(id, body);

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
