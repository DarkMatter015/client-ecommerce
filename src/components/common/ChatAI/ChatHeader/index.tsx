import { useAuth } from "@/context/hooks/use-auth";

export const ChatHeader = () => {
	const { user } = useAuth();
	return (
		<div className="riff-header">
			<div className="riff-header-title">
				<img
					src="/assets/images/chat-ai/riff-icon.png"
					alt="riff-icon"
					width="200"
					height="100"
				></img>
				<span className="title-name">
					Olá {user?.displayName || "Visitante"}
				</span>
				<span className="title-description">
					Estou aqui para ajudar você a encontrar o som perfeito. O
					que procura hoje?
				</span>
			</div>
		</div>
	);
};
