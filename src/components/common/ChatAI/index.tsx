import { useServerHealth } from "@/context/hooks/use-serverHealth";
import { useAiChat } from "@/hooks/useAiChat";
import { Sidebar } from "primereact/sidebar";
import { useEffect, useRef, useState } from "react";
import { ChatBody } from "./ChatBody";
import { ChatForm } from "./ChatForm";
import "./chat-ai.style.css";

export const ChatAI = () => {
	const [isOpen, setIsOpen] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { statusChat } = useServerHealth();

	const { messages, handleSendMessage, isChatResponding } = useAiChat();

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				messagesEndRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "end",
				});
			}, 500);
		}
	}, [isOpen, messages, isChatResponding]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	return (
		<div className="riff-chat-container">
			<Sidebar
				visible={isOpen}
				position="right"
				onHide={() => setIsOpen(false)}
				className="chat-sidebar"
			>
				<div className="riff-window">
					<ChatBody
						messages={messages}
						messagesEndRef={messagesEndRef}
						isChatResponding={isChatResponding}
					/>

					<ChatForm handleSendMessage={handleSendMessage} />
				</div>
			</Sidebar>

			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					aria-label={
						statusChat === "online" ? "Abrir Chat" : "Chat Offline"
					}
					title={
						statusChat === "online" ? "Abrir Chat" : "Chat Offline"
					}
					disabled={statusChat !== "online"}
					className={
						statusChat === "online"
							? "riff-launcher"
							: "riff-launcher offline"
					}
				>
					<i
						className={
							statusChat === "online"
								? "pi pi-comment"
								: "pi pi-ban"
						}
					></i>
				</button>
			)}
		</div>
	);
};
