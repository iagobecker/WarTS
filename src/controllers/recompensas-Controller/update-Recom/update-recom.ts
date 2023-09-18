import { HttpRequest, HttpResponse } from "./../../protocols";
import { IController } from "../../protocols";
import { Recompensas } from "../../../models/recompensas";
import { badRequest, ok, serverError } from "../../helpers";
import { IUpdateRecomRepository, UpdateRecomParams } from "./protocols";

export class UpdateRecomController implements IController {
  constructor(private readonly updateRecomRepository: IUpdateRecomRepository) {}

  async handle(
    HttpRequest: HttpRequest<UpdateRecomParams>
  ): Promise<HttpResponse<Recompensas | string>> {
    try {
      const id = HttpRequest?.params?.id;
      const body = HttpRequest?.body;

      if (!body) {
        return badRequest("Campos ausentes");
      }

      if (!id) {
        return badRequest("id de Recompensa ausente");
      }

      const allowedFieldsToUpdate: /*Campos permitidos para atualizar*/ (keyof UpdateRecomParams)[] =
        ["name", "pontos"];

      const someFieldIsNotAllowedToUpdate /*Algum campo não tem permissão para Atualizar*/ =
        Object.keys(body).some(
          (key) =>
            !allowedFieldsToUpdate.includes(key as keyof UpdateRecomParams)
        );

      if (someFieldIsNotAllowedToUpdate) {
        return badRequest("Alguns campos não são permitidos");
      }

      const recompensa = await this.updateRecomRepository.updateRecompensa(
        id,
        body
      );

      return ok<Recompensas>(recompensa);
    } catch (error) {
      return serverError();
    }
  }
}
