import { IGetUsersController, IGetUsersRepository } from "./protocols";

export class GetUsersController implements IGetUsersController {
  constructor(private readonly getUsersRepository: IGetUsersRepository) {}

  async handle() {
    try {
      // validar requisição
      // direcionar chamada para o repositório
      const users = await this.getUsersRepository.getUsers();

      return {
        statusCode: 200,
        body: users,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: "Algo deu errado.",
      };
    }
  }
}
