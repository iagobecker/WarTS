import { Indicated } from "../../../models/indicated";
import { ok, serverError } from "../../helpers";
import { HttpResponse, IController } from "../../protocols";
import { IGetIndicatesRepository } from "./protocols";

export class GetIndicatesController implements IController {
  constructor(
    private readonly getIndicatesRepository: IGetIndicatesRepository
  ) {}

  async handle(): Promise<HttpResponse<Indicated[] | string>> {
    try {
      const indicates = await this.getIndicatesRepository.getIndicates();

      return ok<Indicated[]>(indicates);
    } catch (error) {
      return serverError();
    }
  }
}
