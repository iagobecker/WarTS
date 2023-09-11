import { NextFunction, Request, Response } from "express";

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
