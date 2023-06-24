import { User } from "../../models/user";
import { HttpRequest, HttpResponse } from "./../protocols";

//o ? significa que é OPCIONAL
export interface UpdateUserParams {
  name?: string;
  password?: string;
}

export interface IUpdateUserController {
  handle(HttpRequest: HttpRequest<any>): Promise<HttpResponse<User>>;
}

//campos que permitomos atualizar para o usuário
export interface IUpdateUserRepository {
  updateUser(id: string, params: UpdateUserParams): Promise<User>;
}
