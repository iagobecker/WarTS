import validator from "validator";
import { User } from "../../models/user";
import { HttpRequest, HttpResponse, IController } from "./../protocols";
import { CreateUserParams, ICreateUserRepository } from "./protocols";
import { badRequest, created, serverError } from "../helpers";
import { cpf } from "cpf-cnpj-validator";

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

      // Verificar se a senha possui ao menos uma letra maiúscula
      const passwordHasUppercase = /[A-Z]/.test(httpRequest.body!.password);

      if (!passwordHasUppercase) {
        return badRequest("A senha deve conter ao menos uma letra maiúscula");
      }

      // Verificar se o campo birthday está no formato de data DD/MM/AAAA
      const birthday = httpRequest.body!.birthday;
      const birthdayIsValid = isValidDateFormat(birthday);

      if (!birthdayIsValid) {
        return badRequest(
          "Formato de data inválido para o campo birthday. Utilize o formato DD/MM/AAAA"
        );
      }

      // Verificar se o campo cpf é um CPF válido
      const cpfIsValid = cpf.isValid(httpRequest.body!.cpf);

      if (!cpfIsValid) {
        return badRequest("CPF inválido");
      }

      //Criação do user
      const user = await this.createUserRepository.createUser(
        httpRequest.body!
      );

      return created<User>(user);
    } catch (error) {
      return serverError();
    }
  }
}

function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  return dateRegex.test(date);
}
