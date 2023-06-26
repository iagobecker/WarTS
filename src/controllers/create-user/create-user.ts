import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "./../protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";
import { badRequest, created, serverError } from "../helpers";

export class CreateUserController implements IController {
  constructor(private readonly createUserRepository: ICreateUserRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateUserParams>
  ): Promise<HttpResponse<User | string>> {
    try {
      //verificar se campos obrigatórios estão presentes
      const requiredFields = ["name", "email", "password"];

      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateUserParams]?.length) {
          //validar se o body existe
          return badRequest(`Campo ${field} obrigatório`);
        }
      }

      //verificar se  o E-mail é válido
      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      //se o email não for válido vai executar esse IF
      if (!emailIsValid) {
        return badRequest("E-Mail inválido!");
      }

      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );

      return created<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}
