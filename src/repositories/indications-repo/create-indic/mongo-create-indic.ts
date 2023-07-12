import { MongoIndicate } from "./../../mongo-protocols";
import {
  ICreateIndicateRepository,
  CreateIndicateParams,
} from "./../../../controllers/indications-controller/create-indic/protocols";
import { MongoClient } from "./../../../database/mongo";
import { Indicated } from "../../../models/indicated";
import { ObjectId } from "mongodb";

export class MongoCreateIndicatedRepository
  implements ICreateIndicateRepository
{
  async createIndicate(params: CreateIndicateParams): Promise<Indicated> {
    // Criar a indicação
    const { insertedId } = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .insertOne(params);

    // Buscar a indicação e verificar se foi criada
    const indicated = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: insertedId });

    if (!indicated) {
      throw new Error("Indicação não foi criada");
    }

    const { _id, ...rest } = indicated;
    // Retornar a indicação criada e substituir o id com "_" (underscore) por "id" (sem "_")
    return { id: _id.toHexString(), ...rest };
  }

  async validateReferredByName(
    name: string,
    referralId: number | null
  ): Promise<boolean> {
    if (!referralId) {
      return true; // Se referralId for null, a validação é considerada verdadeira
    }

    const referral = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: new ObjectId(referralId) });

    if (!referral) {
      return false; // Se não encontrou o referral pelo ID, a validação é considerada falsa
    }

    return referral.name === name; // Retorna true se o nome corresponder ao referral
  }
}
