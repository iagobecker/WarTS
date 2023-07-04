import { serverError, created, badRequest } from "./../../helpers";
import { IController, HttpResponse, HttpRequest } from "./../../protocols";
import validator from "validator";
import { Indicated } from "../../../models/indicated";
import { CreateIndicateParams, ICreateIndicateRepository } from "./protocols";

export class CreateIndicationController implements IController {
  constructor(
    private readonly createIndicateRepository: ICreateIndicateRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateIndicateParams>
  ): Promise<HttpResponse<any>> {
    try {
      // Verificar se campos obrigatórios estão presentes
      const requiredFields: (keyof CreateIndicateParams)[] = [
        "indicatingClientId",
        "name",
        "email",
      ];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field]) {
          return badRequest(`Campo ${field} obrigatório`);
        }
      }

      // Verificar se o e-mail é válido
      const email = httpRequest.body?.email;
      if (!email || !validator.isEmail(email)) {
        return badRequest("E-mail inválido");
      }

      // Criar a indicação
      const indication = await this.createIndicateRepository.createIndicate(
        httpRequest.body!
      );

      if (!indication) {
        return badRequest("Falha ao criar a indicação");
      }

      return created<Indicated>(indication);
    } catch (error) {
      return serverError();
    }
  }
}
