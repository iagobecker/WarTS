import { User } from "../../models/user";
export interface CreateUserParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  birthday: string;
  cpf: string;
  isAdmin: boolean;
  isClient: string;
  pontos: string;
  indicationDate: string;
  indicationStatus: string;
}

export interface ICreateUserRepository {
  createUser(params: CreateUserParams): Promise<User>;
}
