import { MessageType, type IMessage } from "@/commons/types/Chat";
import { ChatHeader } from "../ChatHeader";
import { LoadingResponse } from "../LoadingResponse";

export const ChatBody = ({
	messages,
	messagesEndRef,
	isChatResponding,
}: {
	messages: IMessage[];
	messagesEndRef: any;
	isChatResponding: boolean;
}) => {
	return (
		<div className="riff-body">
			<ChatHeader />
			{messages.map((msg: IMessage) => (
				<div key={msg.id} className="riff-message-container">
					{msg.type === MessageType.BOT && (
						<div className="riff-message-avatar">
							<img
								src="/assets/images/chat-ai/riff-icon.png"
								alt="Riff Icon"
							/>
						</div>
					)}
					<div className={`riff-message ${msg.type}`}>
						{msg.message}
					</div>
				</div>
			))}
			{isChatResponding && <LoadingResponse />}
			<div ref={messagesEndRef} id="messages-end" />
		</div>
	);
};
