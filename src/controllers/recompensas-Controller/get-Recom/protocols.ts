import { Recompensas } from "../../../models/recompensas";

export interface IGetRecomRepository {
  getRecompensa(): Promise<Recompensas[]>;
}
