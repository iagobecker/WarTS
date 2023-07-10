import { Indicated } from "../../../models/indicated";
import { badRequest, ok, serverError } from "../../helpers";
import { HttpRequest, HttpResponse, IController } from "../../protocols";
import { IDeleteIndicatesRepository } from "./protocols";

export class DeleteIndicatesController implements IController {
  constructor(
    private readonly deleteIndicatesRepository: IDeleteIndicatesRepository
  ) {}
  async handle(
    httpRequest: HttpRequest<any>
  ): Promise<HttpResponse<Indicated | string>> {
    try {
      const id = httpRequest?.params?.id;

      if (!id) {
        return badRequest("Id da Indicação ausente.");
      }

      const indications = await this.deleteIndicatesRepository.deleteIndicate(
        id
      );

      return ok<Indicated>(indications);
    } catch (error) {
      return serverError();
    }
  }
}
