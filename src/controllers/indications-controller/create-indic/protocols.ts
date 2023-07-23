import { Indicated } from "../../../models/indicated";
import { HttpRequest, HttpResponse } from "../../protocols";
export interface CreateIndicateParams {
  name: string;
  email: string;
  phone: string;
  referredByName: string;
  referralId: number | null | string;
  indicationDate: string;
  indicationStatus: 1 | 2;
}

export interface ICreateIndicateRepository {
  createIndicate(params: CreateIndicateParams): Promise<Indicated>;
}

export interface IController {
  handle(
    httpRequest: HttpRequest<CreateIndicateParams>
  ): Promise<HttpResponse<Indicated | string>>;
}

/*export interface ICreateIndicateRepository {
  createIndicate(
    referredByName: string,
    referralId: number | null | string,
    params: CreateIndicateParams
  ): Promise<Indicated>;
}
 */
