import type { IPayment } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/ServiceUtils";

const ROUTE = "/payments";

const mapApiToPayment = (item: any): IPayment => {
	return {
		id: item.id,
		name: item.name,
	};
};

export const getPayments = async (
	page = 0,
	size = 10
): Promise<IPage<IPayment>> => {
	const { data } = await api.get(`${ROUTE}/page?page=${page}&size=${size}`);
	return normalizePage(data, mapApiToPayment);
};

export const getPaymentById = async (id: string): Promise<IPayment> => {
	const { data } = await api.get(`${ROUTE}/${id}`);
	return mapApiToPayment(data);
};
