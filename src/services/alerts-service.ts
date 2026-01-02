import type {
    IAlertRequest,
  IAlertResponse,
  IPage,
} from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/Utils";

const route = "/alerts";

type ApIAlertRequest = Record<string, any>;

const mapApiToAlert = (alert: ApIAlertRequest): IAlertResponse => {
  return {
    id: alert.id ?? 0,
    email: alert.email,
    productId: alert.productId,
    productName: alert.productName,
    requestDate: alert.requestDate,
    processedAt: alert.processedAt,
    status: alert.status,
  };
};

export const getAllAlertsPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IAlertResponse> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToAlert);
  } catch (err) {
    console.error(`Erro ao buscar todos os alertas na rota ${route}`, err);
    return null;
  }
};

export const getAlertById = async (
  id: string
): Promise<IAlertResponse | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return mapApiToAlert(response.data);
  } catch (err) {
    console.error(
      `Erro ao buscar o alerta com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};

export const postAlert = async (alert: IAlertRequest) => {
  try {
    const response = await api.post("/alerts", alert);
    return response;
  } catch (err) {
    console.error(`Erro ao realizar alerta na rota ${route}`, err);
    throw err;
  }
};
