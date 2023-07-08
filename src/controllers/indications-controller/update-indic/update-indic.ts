import { Indicated } from "../../../models/indicated";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IUpdateIndicatesRepository, UpdateIndicatesParams } from "./protocols";

export class UpdateIndicatesController implements IController {
  constructor(
    private readonly updateIndicatesRepository: IUpdateIndicatesRepository
  ) {}

  async handle(
    HttpRequest: HttpRequest<UpdateIndicatesParams>
  ): Promise<HttpResponse<Indicated | string>> {
    try {
      const id = HttpRequest?.params?.id;
      const body = HttpRequest?.body;

      if (!body) {
        return badRequest("Campos ausentes");
      }

      if (!id) {
        return badRequest("id de usuário ausente");
      }

      const allowedFieldsToUpdate: /*Campos permitisdos para atualizar */ (keyof UpdateIndicatesParams)[] =
        ["name", "email", "phone"];

      const someFieldIsNotAllowedToUpdate /*Algum campo não tem permissão para atualizar*/ =
        Object.keys(body).some(
          (key) =>
            !allowedFieldsToUpdate.includes(key as keyof UpdateIndicatesParams)
        );

      if (someFieldIsNotAllowedToUpdate) {
        return badRequest("Alguns campos recebidos não são permitidos");
      }

      const indication = await this.updateIndicatesRepository.updateIndicate(
        id,
        body
      );

      return ok<Indicated>(indication);
    } catch (error) {
      return serverError();
    }
  }
}
