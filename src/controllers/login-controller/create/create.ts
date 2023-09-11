import { badRequest, created, serverError } from "./../../helpers";
import { HttpRequest, HttpResponse, IController } from "./../../protocols";
import { Logi } from "./../../../models/login";
import { CreateLogiParams, ICreateLogiRepository } from "./protocols";
import validator from "validator";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { User } from "../../../models/user";

dotenv.config();

export class CreateLogiController implements IController {
  constructor(private readonly createLogiRepository: ICreateLogiRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateLogiParams>
  ): Promise<HttpResponse<Logi | string>> {
    try {
      //verificar se campos obrigatórios estão presentes
      const requiredFiles = ["email", "password"];
      for (const field of requiredFiles) {
        if (!httpRequest?.body?.[field as keyof CreateLogiParams]?.length) {
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

      //Criando Login
      const login = await this.createLogiRepository.createLogi(
        httpRequest.body!
      );

      return created<Logi>(login);
    } catch (error) {
      return serverError();
    }
  }
}
