import { Indicated } from "../../../models/indicated";
import { ok, serverError } from "../../helpers";
import { HttpResponse, IController } from "../../protocols";
import { IGetIndicatesRepository } from "./protocols";

export class GetIndicatesController implements IController {
  constructor(
    private readonly getIndicatesRepository: IGetIndicatesRepository
  ) {}

  async handle(): Promise<HttpResponse<Indicated | string>> {
    try {
      const indications = await this.getIndicatesRepository.getIndicates();

      //const indicateObject = { indications };

      //return ok<Indicated[]>(indicateObject);
      return ok<Indicated>(indications);
    } catch (error) {
      return serverError();
    }
  }
}
