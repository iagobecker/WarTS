import validator from "validator";
import { Indicated } from "../../../models/indicated";
import { HttpRequest, HttpResponse, IController } from "./../../protocols";
import { CreateIndicateParams, ICreateIndicateRepository } from "./protocols";
import { badRequest, created, serverError } from "./../../helpers";

export class CreateIndicationController implements IController {
  constructor(
    private readonly createIndicateRepository: ICreateIndicateRepository
  ) {}

  async handle(
    httpRequest: HttpRequest<CreateIndicateParams>
  ): Promise<HttpResponse<Indicated | string>> {
    try {
      // Verificar se campos obrigatórios estão presentes
      const requiredFields = ["name", "email", "phone"];

      for (const field of requiredFields) {
        const value = httpRequest.body?.[field as keyof CreateIndicateParams];

        if (!value || (typeof value === "string" && !value.length)) {
          return badRequest(`Campo ${field} obrigatório`);
        }
      }

      /* for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateIndicateParams]?.length) {
          return badRequest(`Campo ${field} obrigatório`);
        }
      }*/

      // Verificar se o e-mail é válido
      /*const email = httpRequest.body?.email;
      if (!email || !validator.isEmail(email)) {
        return badRequest("E-mail inválido");
      }*/
      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return badRequest("E-mail inválido");
      }

      // Criar a indicação
      const indication = await this.createIndicateRepository.createIndicate(
        httpRequest.body!
      );

      return created<Indicated>(indication);
    } catch (error) {
      return serverError();
    }
  }
}
