import { Indicated } from "../../../models/indicated";
export interface CreateIndicateParams {
  name: string;
  email: string;
  phone: string;
  referredByName: string;
  referralId: number | null;
  indicationDate: string;
  indicationStatus: 1 | 2;
}

export interface ICreateIndicateRepository {
  createIndicate(params: CreateIndicateParams): Promise<Indicated>;
  validateReferredByName(
    name: string,
    referralId: number | null
  ): Promise<boolean>;
}
