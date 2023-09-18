import { Logi } from "../../../models/login";

export interface CreateLogiParams {
  email: string;
  password: string;
}

export interface ICreateLogiRepository {
  createLogi(params: CreateLogiParams): Promise<Logi>;
}
