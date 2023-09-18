import { Recompensas } from "../../../models/recompensas";

export interface CreateRecomParams {
  name: string;
  pontos: number;
}

export interface ICreateRecomRepository {
  createRecompensa(params: CreateRecomParams): Promise<Recompensas>;
}
