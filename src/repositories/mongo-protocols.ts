//User
import { User } from "../models/user";
export type MongoUser = Omit<User, "id">;

//Indicate
import { Indicated } from "../models/indicated";
export type MongoIndicate = Omit<Indicated, "id">;

//Login
import { Logi } from "../models/login";
export type MongoLogi = Omit<Logi, "id">;

//Recompensa
import { Recompensas } from "../models/recompensas";
export type MongoRecompensa = Omit<Recompensas, "id">;
