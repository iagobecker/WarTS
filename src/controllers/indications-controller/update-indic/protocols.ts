import { Indicated } from "../../../models/indicated";

export interface UpdateIndicatesParams {
  name?: string;
  email?: string;
  phone?: string;
  referralId?: string;
  indicationDate?: string;
  indicationStatus?: string;
}

export interface IUpdateIndicatesRepository {
  updateIndicate(id: string, params: UpdateIndicatesParams): Promise<Indicated>;
}
