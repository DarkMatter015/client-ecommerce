import { api, apiChat } from "@/lib/axios";

const ROUTE = "/api/health";

export const healthCheckApi = async (): Promise<any> => {
	const { data } = await api.get(ROUTE);
	return data;
};

export const healthCheckApiChat = async (): Promise<any> => {
	const { data } = await apiChat.get(ROUTE);
	return data;
};