import { api, apiChat } from "@/lib/axios";

const ROUTE = "/api/health";
const ROUTE_CHAT = "/";

export const healthCheckApi = async (): Promise<any> => {
	const { data } = await api.get(ROUTE);
	return data;
};

export const healthCheckApiChat = async (): Promise<any> => {
	const { data } = await apiChat.get(ROUTE_CHAT);
	return data;
};