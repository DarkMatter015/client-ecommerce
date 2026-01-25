import { api } from "@/lib/axios";

const ROUTE = "/api/health";

export const healthCheck = async (): Promise<any> => {
    const { data } = await api.get(ROUTE);
    return data;
};