import { Recompensas } from "../../../models/recompensas";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { CreateRecomParams, ICreateRecomRepository } from "./protocols";
import { badRequest, created, serverError } from "../../helpers";

export class CreateRecomController implements IController {
  constructor(private readonly createRecomRepository: ICreateRecomRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateRecomParams>
  ): Promise<HttpResponse<Recompensas | string | number>> {
    try {
      //verificação para campos obrigatórios
      const requiredFields = ["name", "pontos"];

      for (const field of requiredFields) {
        if (
          !httpRequest?.body?.[field as keyof CreateRecomParams]
            /* aqui está a solução para o erro : 
  A propriedade 'length' não existe no tipo 'number''
any -->*/ ?.toString()
            .trim()
        ) {
          //validação se o body existe
          return badRequest(`Campo ${field} obrigatório.`);
        }
      }

      //Criação da Recompensa
      const recompensa = await this.createRecomRepository.createRecompensa(
        httpRequest.body!
      );

      return created<Recompensas>(recompensa);
    } catch (error) {
      return serverError();
    }
  }
}
