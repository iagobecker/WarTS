import { ok } from "./../../helpers";
import { Recompensas } from "../../../models/recompensas";
import { badRequest, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IDeleteRecomRepository } from "./protocols";

export class DeleteRecomController implements IController {
  constructor(private readonly deleteRecomRepository: IDeleteRecomRepository) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<Recompensas | string>> {
    try {
      //verifica se o ID foi recebido
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("ID da Recompensa ausente.");
      }

      const recompensa = await this.deleteRecomRepository.deleteRecompensa(id);

      return ok<Recompensas>(recompensa);
    } catch (error) {
      return serverError();
    }
  }
}
