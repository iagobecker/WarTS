import { Recompensas } from "../../../models/recompensas";
import { serverError, ok } from "../../helpers";
import { HttpResponse, IController } from "../../protocols";
import { IGetRecomRepository } from "./protocols";

export class GetRecomController implements IController {
  constructor(private readonly getRecomRepository: IGetRecomRepository) {}

  async handle(): Promise<HttpResponse<Recompensas | string>> {
    try {
      //validar requisição
      //direcionar chamada para o repositório
      const recompensa = await this.getRecomRepository.getRecompensa();

      return ok<Recompensas>(recompensa);
    } catch (error) {
      return serverError();
    }
  }
}
