import { HttoStatusCode, HttpResponse } from "./protocols";

export const ok = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttoStatusCode.OK,
  body,
});

export const created = <T>(body: any): HttpResponse<T> => ({
  statusCode: HttoStatusCode.CREATED,
  body,
});

export const badRequest = (message: string): HttpResponse<string> => {
  return {
    statusCode: HttoStatusCode.BAD_REQUEST,
    body: message,
  };
};

export const serverError = (): HttpResponse<string> => {
  return {
    statusCode: HttoStatusCode.SERVER_ERROR,
    body: "Algo deu errado.",
  };
};
