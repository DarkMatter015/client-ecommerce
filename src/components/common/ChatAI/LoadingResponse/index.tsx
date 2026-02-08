import "./loading-response.style.css";

export const LoadingResponse = () => {
	return (
		<div className="riff-message riff-message-bot">
			<div className="riff-loading">
				<div className="riff-loading-dot"></div>
				<div className="riff-loading-dot"></div>
				<div className="riff-loading-dot"></div>
			</div>
		</div>
	);
};