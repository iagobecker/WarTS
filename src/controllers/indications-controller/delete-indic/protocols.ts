import { Indicated } from "../../../models/indicated";

export interface IDeleteIndicatesRepository {
  deleteIndicate(id: string): Promise<Indicated>;
}
