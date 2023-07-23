import { MongoIndicate } from "./../../mongo-protocols";
import {
  ICreateIndicateRepository,
  CreateIndicateParams,
} from "./../../../controllers/indications-controller/create-indic/protocols";
import { MongoClient } from "./../../../database/mongo";
import { Indicated } from "../../../models/indicated";
//import { ObjectId } from "mongodb";

export class MongoCreateIndicatedRepository
  implements ICreateIndicateRepository
{
  async createIndicate(params: CreateIndicateParams): Promise<Indicated> {
    // Criar a indicação
    const { insertedId } = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .insertOne({ ...params });

    // Buscar a indicação e verificar se foi criada
    const indication = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: insertedId });

    if (!indication) {
      throw new Error("Indicação não foi criada");
    }

    const { _id, ...rest } = indication;
    // Retornar a indicação criada e substituir o id com "_" (underscore) por "id" (sem "_")
    return { id: _id.toHexString(), ...rest };
  }

  /*async validateReferredByName(
    referredByName: string,
    referralId: number | null | string
  ): Promise<boolean> {
    if (!referralId) {
      return true; // Se referralId for null, a validação é considerada verdadeira
    }

    const referred = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .findOne({ _id: new ObjectId(referralId) });

    if (!referred) {
      return false; // Se não encontrou o cliente pelo ID de indicação, a validação é considerada falsa
    }

    return referred.name === referredByName; // Retorna true se o nome corresponder ao cliente de indicação
  }*/
}

/*async createIndicate(
    referredByName: string,
    referralId: number | null | string,
    params: CreateIndicateParams
  ): Promise<Indicated> {
    // Validar o nome referente ao ID do referralId
    const isValid = await this.validateReferredByName(
      referredByName,
      referralId
    );

    if (!isValid) {
      throw new Error("O nome informado não corresponde ao ID de indicação");
    }

    // Criar a indicação
    const { insertedId } = await MongoClient.db
      .collection<MongoIndicate>("indications")
      .insertOne({ ...params, referredByName, referralId }); */
