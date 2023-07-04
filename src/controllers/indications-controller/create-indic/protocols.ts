import { Indicated } from "../../../models/indicated";
export interface CreateIndicateParams {
  indicatingClientId: string;
  name: string;
  email: string;
}

export interface ICreateIndicateRepository {
  createIndicate(params: CreateIndicateParams): Promise<Indicated>;
}
