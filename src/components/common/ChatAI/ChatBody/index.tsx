export const ChatBody = ({ messages, messagesEndRef }: any) => {
	return (
		<div className="riff-body">
			{messages.map((msg: any) => (
				<div key={msg.id} className={`riff-message ${msg.type}`}>
					{msg.message}
				</div>
			))}
			<div ref={messagesEndRef} id="messages-end" />
		</div>
	);
};
