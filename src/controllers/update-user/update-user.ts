import { User } from "../../models/user";
import { badRequest, ok, serverError } from "../helpers";
import { HttpRequest, HttpResponse, IController } from "../protocols";
import { IUpdateUserRepository, UpdateUserParams } from "./protocols";

export class UpdateUserController implements IController {
  constructor(private readonly updateUserRepository: IUpdateUserRepository) {}

  async handle(
    HttpRequest: HttpRequest<UpdateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      const id = HttpRequest?.params?.id;
      const body = HttpRequest?.body;

      if (!body) {
        return badRequest("Campos ausentes");
      }

      if (!id) {
        return badRequest("id de usuário ausente");
      }

      const allowedFieldsToUpdate: /*Campos permitidos para atualizar */ (keyof UpdateUserParams)[] =
        ["name", "password"];

      const someFieldIsNotAllowedToUpdate /*algum campo não tem permissão para atualizar */ =
        Object.keys(body).some(
          (key) =>
            !allowedFieldsToUpdate.includes(key as keyof UpdateUserParams)
        );

      if (someFieldIsNotAllowedToUpdate) {
        return badRequest("Alguns campos recebidos não são permitidos");
      }

      const user = await this.updateUserRepository.updateUser(id, body);

      return ok<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
