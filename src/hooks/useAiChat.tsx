import {
	MessageType,
	type IChatRequest,
	type IMessage,
} from "@/commons/types/Chat";
import { postChatAi } from "@/services/chatAi.service";
import { getFormattedDate } from "@/utils/Utils";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CHAT_HISTORY_KEY = "riff_chat_history";
const GUEST_ID_KEY = "riff_guest_id";

export function useAiChat() {
	const username = localStorage.getItem("username") || "Visitante";
	const INITIAL_MESSAGES = [
		{
			id: Date.now(),
			date: getFormattedDate(),
			type: MessageType.BOT,
			message: `Olá ${username}! Eu sou o Riff 🎸. Estou aqui para ajudar você a encontrar o som perfeito.`,
		},
	];
	const [isChatResponding, setIsChatResponding] = useState<boolean>(false);
	const [messages, setMessages] = useState<IMessage[]>(() => {
		try {
			const saved = localStorage.getItem(CHAT_HISTORY_KEY);
			return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
		} catch (e) {
			console.error("Erro ao ler LocalStorage", e);
			return [];
		}
	});

	const getSessionId = () => {
		let sessionId: string = localStorage.getItem(GUEST_ID_KEY) || "";

		if (sessionId.trim() === "") {
			sessionId = uuidv4(); // Gera um ID único
			localStorage.setItem(GUEST_ID_KEY, sessionId);
		}

		return sessionId;
	};

	// 2. Sincronização: Toda vez que 'messages' mudar, salva no LocalStorage
	useEffect(() => {
		localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
	}, [messages]);

	// Função para limpar o histórico (caso o usuário queira reiniciar ou faça logout)
	const clearChatHistory = () => {
		localStorage.removeItem(CHAT_HISTORY_KEY);
		localStorage.removeItem(GUEST_ID_KEY);
		setMessages(INITIAL_MESSAGES);
	};

	const handleSendMessage = async (e: IChatRequest) => {
		console.log(e);
		setIsChatResponding(true);
		try {
			const sessionId = getSessionId();
			const newMsg: IMessage = {
				id: Date.now(),
				date: getFormattedDate(),
				type: MessageType.USER,
				message: e.message,
			};
			setMessages((prev) => [...prev, newMsg]);

			const response = await postChatAi({
				message: e.message,
				sessionId,
			});

			const botMsg = {
				id: Date.now() + 1,
				date: getFormattedDate(),
				type: MessageType.BOT,
				message: response.response,
			};
			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
			const botMsg = {
				id: Date.now() + 1,
				date: getFormattedDate(),
				type: MessageType.BOT,
				message:
					"Erro ao enviar mensagem =(. Tente novamente mais tarde.",
			};
			setMessages((prev) => [...prev, botMsg]);
		} finally {
			setIsChatResponding(false);
		}
	};

	return {
		isChatResponding,
		handleSendMessage,
		messages,
		setMessages,
		clearChatHistory,
		getSessionId,
	};
}
