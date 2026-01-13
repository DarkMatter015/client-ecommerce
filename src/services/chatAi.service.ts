import type { IChatRequest, IChatResponse } from "@/commons/types/Chat";
import { apiChat } from "@/lib/axios";

const ROUTE = "/api/v1/chat/message";

export const postChatAi = async (userMessage: IChatRequest): Promise<IChatResponse> => {
    const { data } = await apiChat.post(ROUTE, userMessage);
    return data;
}