import type {
	IAlertRequest,
	IAlertResponse,
	IPage,
} from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/ServiceUtils";

const ROUTE = "/alerts";

const mapApiToAlert = (alert: any): IAlertResponse => {
	return {
		id: alert.id,
		email: alert.email,
		productId: alert.productId,
		productName: alert.productName,
		requestDate: alert.requestDate,
		processedAt: alert.processedAt,
		status: alert.status,
	};
};

export const getAlerts = async (
	page = 0,
	size = 10
): Promise<IPage<IAlertResponse>> => {
	const { data } = await api.get(`${ROUTE}/page?page=${page}&size=${size}`);
	return normalizePage(data, mapApiToAlert);
};

export const getAlertById = async (id: number): Promise<IAlertResponse> => {
	const { data } = await api.get(`${ROUTE}/${id}`);
	return mapApiToAlert(data);
};

export const createAlert = async (alert: IAlertRequest) => {
	const { data } = await api.post("/alerts", alert);
	return data;
};

export const deleteAlert = async (id: number) => {
	await api.delete(`${ROUTE}/${id}`);
};

export const cancelAlert = async (id: number) => {
	const { data } = await api.delete(`${ROUTE}/${id}/cancel`);
	return data;
};

export const activateAlert = async (id: number) => {
	const { data } = await api.post(`${ROUTE}/${id}/activate`);
	return data;
};
