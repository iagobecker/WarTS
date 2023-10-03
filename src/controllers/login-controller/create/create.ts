import { MongoClient } from "./../../../database/mongo";
import { hash } from "bcryptjs";
import { badRequest, created, serverError } from "./../../helpers";
import { HttpRequest, HttpResponse, IController } from "./../../protocols";
import { Logi } from "./../../../models/login";
import { CreateLogiParams, ICreateLogiRepository } from "./protocols";
import validator from "validator";
import dotenv from "dotenv";
import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { sign } from "jsonwebtoken";

dotenv.config();

export class CreateLogiController implements IController {
  constructor(private readonly createLogiRepository: ICreateLogiRepository) {}

  async handle(
    httpRequest: HttpRequest<CreateLogiParams>
  ): Promise<HttpResponse<Logi | string>> {
    try {
      // Verificar se campos obrigatórios estão presentes
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest?.body?.[field as keyof CreateLogiParams]?.length) {
          // Validar se o campo existe e não está vazio
          return badRequest(`Campo ${field} obrigatório`);
        }
      }

      // Verificar se o E-mail é válido
      const emailIsValid = validator.isEmail(httpRequest.body!.email);

      if (!emailIsValid) {
        return badRequest("E-Mail inválido!");
      }

      // Verificar se a senha possui ao menos uma letra maiúscula
      const passwordHasUppercase = /[A-Z]/.test(httpRequest.body!.password);

      if (!passwordHasUppercase) {
        return badRequest("A senha deve conter ao menos uma letra maiúscula");
      }

      // Verificar se o usuário já existe antes de criar
      const userExists = await MongoClient.db
        .collection("users")
        .findOne({ email: httpRequest.body!.email });

      if (userExists) {
        return badRequest("Usuário já existe");
      }

      // Criptografando a senha usando o bcrypt
      const hashedPassword = await hash(httpRequest.body!.password, 8);

      // Criando Login
      const login = await this.createLogiRepository.createLogi({
        email: httpRequest.body!.email,
        password: hashedPassword,
      });

      // Gerar um token JWT
      const token = sign(
        { id: login.id, email: login.email },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "1d",
        }
      );

      return created<Logi>({ login, token });
    } catch (error) {
      return serverError();
    }
  }
}
