//import { compare } from "bcrypt";
import { MongoClient } from "./../../../database/mongo";
import { badRequest, created, serverError } from "./../../helpers";
import { HttpRequest, HttpResponse, IController } from "./../../protocols";
import { Logi } from "./../../../models/login";
import { CreateLogiParams, ICreateLogiRepository } from "./protocols";
import dotenv from "dotenv";
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

      // Verificar se o usuário já existe no banco de dados
      const userExists = await MongoClient.db
        .collection("users")
        .findOne({ email: httpRequest.body!.email });

      if (!userExists) {
        return badRequest("Usuário não encontrado");
      }

      // Verificar se a senha fornecida é válida
      const isPasswordValid = await MongoClient.db
        .collection("users")
        .findOne({ password: httpRequest.body!.password });
      userExists.password;

      if (!isPasswordValid) {
        return badRequest("Senha inválida");
      }

      // Se tudo estiver correto, crie um token JWT
      const token = sign(
        { id: userExists._id, email: userExists.email },
        process.env.JWT_SECRET_KEY || "",
        {
          expiresIn: "1d",
        }
      );

      return created<Logi>({ login: userExists, token });
    } catch (error) {
      return serverError();
    }
  }
}
