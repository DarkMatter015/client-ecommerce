import { AlertStatus, type IAlertResponse } from "@/commons/types/types";
import { DataView } from "primereact/dataview";
import React, { useMemo } from "react";
import "./alerts-list.style.css";
import { CardAlert } from "../CardAlert";
import { useToast } from "@/context/hooks/use-toast";
import {
	activateAlert,
	deleteAlert,
	cancelAlert,
} from "@/services/alerts.service";

interface AlertsListProps {
	alerts: IAlertResponse[];
	loading?: boolean;
	onRefresh: () => void;
}

export const AlertsList: React.FC<AlertsListProps> = ({
	alerts,
	loading = false,
	onRefresh,
}) => {
	const { showToast, showConfirmToast } = useToast();

	const handleShowConfirm = (id: number, action: string) => {
		showConfirmToast(
			"warn",
			"Atenção",
			`Tem certeza que deseja ${action} este alerta?`,
			() => handleAction(id, action)
		);
	};

	const handleAction = async (id: number, action: string) => {
		try {
			if (action === "deletar") {
				await deleteAlert(id);
			} else if (action === "ativar") {
				await activateAlert(id);
			} else if (action === "inativar") {
				await cancelAlert(id);
			}

			onRefresh();
			setTimeout(() => {
				showToast(
					"success",
					"Sucesso",
					`Alerta ${
						action === "deletar"
							? "excluído"
							: action === "ativar"
							? "ativado"
							: "inativado"
					} com sucesso.`
				);
			}, 500);
		} catch (error: any) {
			console.error(`Erro ao ${action} alerta:`, error);
			setTimeout(() => {
				showToast(
					"error",
					"Erro",
					`Falha ao ${action} o alerta. ${
						error.response?.data?.message || "Erro inesperado"
					}`
				);
			}, 500);
		}
	};

	const sortedAlerts = useMemo(() => {
		const priority: Record<string, number> = {
			[AlertStatus.FAILED]: 1,
			[AlertStatus.PENDING]: 2,
			[AlertStatus.PROCESSING]: 3,
			[AlertStatus.SENT]: 4,
			[AlertStatus.CANCELLED]: 5,
		};

		return [...alerts].sort((a, b) => {
			const pA = priority[a.status] || 99;
			const pB = priority[b.status] || 99;
			return pA - pB;
		});
	}, [alerts]);

	if (loading) {
		return <div className="p-4 text-center">Carregando alertas...</div>;
	}

	return (
		<div className="alerts-list-view">
			<DataView
				emptyMessage="Nenhum alerta encontrado."
				value={sortedAlerts}
				itemTemplate={(item) => (
					<CardAlert
						alert={item}
						onDelete={(id) => handleShowConfirm(id, "deletar")}
						onActive={(id) => handleShowConfirm(id, "ativar")}
						onInactivate={(id) => handleShowConfirm(id, "inativar")}
					/>
				)}
				layout="grid"
				className="w-full"
			/>
		</div>
	);
};
