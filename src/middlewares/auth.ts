import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type TokenPayload = {
  id: string;
  iat: number;
  exp: number;
};

export function AuthMiddlewares(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Token não autorizado" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = verify(token, process.env.JWT_SECRET_KEY || "");
    const { id } = decoded as TokenPayload;

    req.userId = id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token não autorizado" });
  }
}

/*import { NextFunction, Request, Response } from "express";

export const Auth = {
  private: (req: Request, res: Response, next: NextFunction) => {
    //Fazer verificação de Auth
    const success = true;

    if (success) {
      next();
    } else {
      res.status(403); //Not authorized
      res.json({ error: "Não autorizado" });
    }
  },
};
*/
