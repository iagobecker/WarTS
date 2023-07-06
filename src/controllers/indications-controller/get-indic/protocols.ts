import { Indicated } from "../../../models/indicated";

export interface IGetIndicatesRepository {
  getIndicates(): Promise<Indicated[]>;
}
