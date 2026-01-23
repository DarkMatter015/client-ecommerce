import { useServerHealth } from "@/context/hooks/use-serverHealth";
import "./server-status-pill.style.css";

export const ServerStatusIndicator = () => {
	const { status, runHealthCheck } = useServerHealth();

	if (status === "waking_up") {
		return (
			<div
				className="status-pill-container waking-up"
				title="Iniciando servidores..."
			>
				<div className="status-content">
					<i
						className="pi pi-spinner pi-spin spin-animation"
						style={{ fontSize: "1rem" }}
					></i>
					<span className="status-text">
						Conectando aos servidores...
					</span>
				</div>
			</div>
		);
	}

	if (status === "offline") {
		return (
			<div
				className="status-pill-container offline"
				onClick={runHealthCheck}
				title="Sem conexão. Clique para tentar novamente."
			>
				<div className="status-content">
					<i
						className="pi pi-exclamation-circle"
						style={{ fontSize: "1rem" }}
					></i>

					<span className="status-text">Sem conexão com a loja.</span>

					<button
						className="retry-btn"
						onClick={(e) => {
							e.stopPropagation();
							runHealthCheck();
						}}
					>
						Tentar
					</button>
				</div>
			</div>
		);
	}

	return null;
};
