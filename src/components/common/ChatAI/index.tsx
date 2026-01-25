import type { IMessage } from "@/commons/types/Chat";
import { postChatAi } from "@/services/chatAi.service";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useRef, useState } from "react";
import { ChatBody } from "./ChatBody";
import { ChatForm } from "./ChatForm";
import { ChatHeader } from "./ChatHeader";
import "./chat-ai.style.css";
import { useServerHealth } from "@/context/hooks/use-serverHealth";

export const ChatAI = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState<IMessage[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { statusChat } = useServerHealth();

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messagesEndRef]);

	const handleSendMessage = async (e: any) => {
		console.log(e);
		try {
			const newMsg = {
				id: Date.now(),
				type: "user",
				message: e.message,
			};
			setMessages((prev) => [...prev, newMsg]);

			const response = await postChatAi({ message: e.message });

			const botMsg = {
				id: Date.now() + 1,
				type: "bot",
				message: response.response,
			};
			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
		}
	};

	return (
		<div className="riff-chat-container">
			<Sidebar
				visible={isOpen}
				position="right"
				onHide={() => setIsOpen(false)}
				className="chat-sidebar"
			>
				<div className="riff-window">
					<ChatHeader />

					<ChatBody
						messages={messages}
						messagesEndRef={messagesEndRef}
					/>

					<ChatForm handleSendMessage={handleSendMessage} />
				</div>
			</Sidebar>

			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					aria-label={statusChat === "online" ? "Abrir Chat" : "Chat Offline"}
					title={statusChat === "online" ? "Abrir Chat" : "Chat Offline"}
					disabled={statusChat !== "online"}
					className={statusChat === "online" ? "riff-launcher" : "riff-launcher offline"}
				>
					<i className={statusChat === "online" ? "pi pi-comment" : "pi pi-ban"}></i>
				</button>
			)}
		</div>
	);
};
