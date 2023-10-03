/*import { compare } from "bcryptjs";
import { Request, Response } from "express";
import { MongoClient } from "../database/mongo";
import { sign } from "jsonwebtoken";*/

/*export class AuthController {
  async authenticate(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await MongoClient.db
        .collection("users")
        .findOne({ /*email: req.body!.*/ // email });

/*  if (!user) {
        return res.json({ error: "Usuário não encontrado! " });
      }

      const isValuePassword = await compare(password, user.password);

      if (!isValuePassword) {
        return res.json({ error: "Senha inválida!" });
      }

      const token = sign({ id: user.id }, process.env.JWT_SECRET_KEY || "", {
        expiresIn: "1d",
      });

      const { id } = user;

      return res.json({ user: { id, email }, token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}
*/
