import {
	MessageType,
	type IChatRequest,
	type IMessage,
} from "@/commons/types/Chat";
import { useAuth } from "@/context/hooks/use-auth";
import { postChatAi } from "@/services/chatAi.service";
import { getFormattedDate, isDateExpired } from "@/utils/Utils";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const CHAT_HISTORY_KEY = "riff_chat_history";
export const GUEST_ID_KEY = "riff_guest_id";
const CHAT_USER_INFO_KEY = "riff_chat_user_info";

export function useAiChat() {
	const { user } = useAuth();
	// 1. Memoize helper to generate initial messages based on current user
	const getInitialMessages = useCallback(
		(currentUser = user): IMessage[] => {
			console.log("Generating initial messages for:", currentUser);
			return [
				{
					id: Date.now(),
					date: getFormattedDate(),
					type: MessageType.BOT,
					message: `Olá ${
						currentUser?.displayName || "Visitante"
					}! Eu sou o Riff 🎸. Estou aqui para ajudar você a encontrar o som perfeito. O que procura hoje?`,
				},
			];
		},
		[user],
	);

	const [isChatResponding, setIsChatResponding] = useState<boolean>(false);
	const [messages, setMessages] = useState<IMessage[]>(() => {
		try {
			const saved = localStorage.getItem(CHAT_HISTORY_KEY);
			if (saved) {
				const parsedMessages = JSON.parse(saved);
				if (parsedMessages.length > 0) {
					const lastMessage =
						parsedMessages[parsedMessages.length - 1];
					if (!isDateExpired(lastMessage.id)) {
						return parsedMessages;
					}
				}
			}
			return getInitialMessages();
		} catch (e) {
			console.error("Erro ao ler LocalStorage", e);
			return getInitialMessages();
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

	useEffect(() => {
		user
			? localStorage.setItem(CHAT_USER_INFO_KEY, String(user.id))
			: localStorage.removeItem(CHAT_USER_INFO_KEY);
	}, [user]);

	// 3. Memoize clearChatHistory to avoid unnecessary re-renders in dependants
	const clearChatHistory = useCallback(
		(targetUser = user) => {
			localStorage.removeItem(CHAT_HISTORY_KEY);
			localStorage.removeItem(GUEST_ID_KEY);
			localStorage.removeItem(CHAT_USER_INFO_KEY);
			setMessages(getInitialMessages(targetUser));
		},
		[getInitialMessages, user],
	);

	// 4. Check for expiration periodically (every minute)
	useEffect(() => {
		const checkExpiration = () => {
			if (messages.length > 0) {
				const lastMessage = messages[messages.length - 1];
				if (isDateExpired(lastMessage.id)) {
					clearChatHistory();
				}
			}
		};

		const intervalId = setInterval(checkExpiration, 60000); // 1 minute

		return () => clearInterval(intervalId);
	}, [messages, clearChatHistory]);

	// 5. Watch for user changes (login/logout) to clear previous session history
	const [storedUserId, setStoredUserId] = useState<number | undefined>(() => {
		const stored = localStorage.getItem(CHAT_USER_INFO_KEY);
		return stored ? Number(stored) : undefined;
	});

	useEffect(() => {
		const hasUserChanged = storedUserId !== user?.id;

		if (hasUserChanged) {
			console.log(`User changed from ${storedUserId} to ${user?.id}`);
			clearChatHistory(user);
			setStoredUserId(user?.id || undefined);
		}
	}, [user, storedUserId, clearChatHistory]);

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
					"Desculpe, minha corda arrebentou (erro de conexão) =(. Tente novamente mais tarde.",
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
