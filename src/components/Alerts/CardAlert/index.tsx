import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { SwitchButton } from "@/components/Buttons/SwitchButton";
import { AlertStatus, type IAlertResponse } from "@/commons/types/types";
import "./card-alert.style.css";

interface CardAlertProps {
	alert: IAlertResponse;
	onDelete: (id: number) => void;
	onActive: (id: number) => void;
	onInactivate: (id: number) => void;
}

export const CardAlert = ({
	alert,
	onDelete,
	onActive,
	onInactivate,
}: CardAlertProps) => {
	const isActive =
		alert.status === "PENDING" || alert.status === "PROCESSING";
	const isActivable =
		alert.status === AlertStatus.CANCELLED ||
		alert.status === AlertStatus.PENDING;

	const onSwitchChecked = (id: number) => {
		if (isActive) {
			onInactivate(id);
		} else {
			onActive(id);
		}
	};

	const getSeverity = (status: string) => {
		switch (status) {
			case "PENDING":
				return "secondary";
			case "PROCESSING":
				return "info";
			case "CANCELLED":
				return "danger";
			case "SENT":
				return "success";
			case "FAILED":
				return "warning";
			default:
				return "danger";
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case "PENDING":
				return "Pendente";
			case "PROCESSING":
				return "Processando";
			case "SENT":
				return "Enviado";
			case "CANCELLED":
				return "Cancelado";
			case "FAILED":
				return "Falhou";
			default:
				return status;
		}
	};

	const getIcon = (status: string) => {
		switch (status) {
			case "PENDING":
				return "pi pi-clock";
			case "PROCESSING":
				return "pi pi-spinner pi-spin";
			case "CANCELLED":
				return "pi pi-times";
			case "SENT":
				return "pi pi-check";
			case "FAILED":
				return "pi pi-exclamation-triangle";
			default:
				return "pi pi-info";
		}
	};

	return (
		<div className="card-alert-container">
			<div
				className={`card-alert-content border-round-sm shadow-2 ${
					!isActive ? "inactive" : "active"
				}`}
			>
				<div className="flex flex-column gap-2 mb-3">
					<div className="flex align-items-center justify-content-between mb-2">
						<span
							className="text-xl font-bold text-900 overflow-hidden text-overflow-ellipsis white-space-nowrap"
							title={alert.productName}
						>
							{alert.productName}
						</span>
						<div className="flex gap-2 justify-content-end">
							<Tag
								severity={getSeverity(alert.status)}
								value={getStatusLabel(alert.status)}
								icon={getIcon(alert.status)}
							/>
							<i className="pi pi-bell text-primary text-xl"></i>
						</div>
					</div>

					<div className="flex flex-column gap-1 text-700">
						<span className="text-sm">
							Solicitado em:{" "}
							{new Date(alert.requestDate).toLocaleDateString()}
						</span>
						<span className="text-sm">
							Atualizado em:{" "}
							{new Date(alert.processedAt).toLocaleDateString()}
						</span>
						<span className="text-sm">Email: <strong>{alert.email}</strong></span>
					</div>
				</div>

				<div className="flex align-items-center justify-content-between gap-2 pt-2 border-top-1 surface-border">
					{isActivable && (
						<SwitchButton
							checked={isActive}
							setChecked={() => onSwitchChecked(alert.id)}
						/>
					)}

					<div className="flex gap-2">
						<Button
							icon="pi pi-trash"
							rounded
							outlined
							severity="danger"
							aria-label="Excluir"
							onClick={() => onDelete(alert.id)}
							title="Excluir Alerta"
						/>
					</div>
					
				</div>
				
			</div>
		</div>
	);
};
