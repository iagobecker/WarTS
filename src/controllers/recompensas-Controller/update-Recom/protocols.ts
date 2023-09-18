import { Recompensas } from "../../../models/recompensas";

export interface UpdateRecomParams {
  name: string;
  pontos: number;
}

export interface IUpdateRecomRepository {
  updateRecompensa(id: string, params: UpdateRecomParams): Promise<Recompensas>;
}
