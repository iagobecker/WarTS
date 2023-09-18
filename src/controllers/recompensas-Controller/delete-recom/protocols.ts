import { Recompensas } from "../../../models/recompensas";

export interface IDeleteRecomRepository {
  deleteRecompensa(id: string): Promise<Recompensas>;
}
