import { User } from "../../models/user";
//o ? significa que é OPCIONAL
export interface UpdateUserParams {
  name?: string;
  password?: string;
}

//campos que permitomos atualizar para o usuário
export interface IUpdateUserRepository {
  updateUser(id: string, params: UpdateUserParams): Promise<User>;
}
