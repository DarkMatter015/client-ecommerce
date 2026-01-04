import { AlertsList } from "@/components/Alerts/AlertsList";
import { useToast } from "@/context/hooks/use-toast";
import { Paginator } from "primereact/paginator";
import { useEffect, useState } from "react";
import type { IAlertResponse } from "@/commons/types/types";
import { getAlerts } from "@/services/alerts.service";
import "./alerts.style.css";

const AlertsPage = () => {
	const { showToast } = useToast();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [loading, setLoading] = useState(false);

	const [alerts, setAlerts] = useState<IAlertResponse[]>([]);
	const [totalElements, setTotalElements] = useState(0);

	const fetchAlerts = async (pageIndex: number, pageSize: number) => {
		setLoading(true);
		try {
			const response = await getAlerts(pageIndex, pageSize);
			if (response) {
				setAlerts(response.content);
				setTotalElements(response.totalElements);
			}
		} catch (error) {
			console.error("Erro ao buscar alertas:", error);
			showToast("error", "Erro", "Não foi possível carregar os alertas.");
		} finally {
			setLoading(false);
		}
	};

	const changePage = (e: any) => {
		if (e.rows > rows && totalElements <= rows) return;
		setFirst(e.first);
		setRows(e.rows);
	};

	useEffect(() => {
		fetchAlerts(first / rows, rows);
	}, [first, rows]);

	return (
		<div className="p-4 alerts-page-container">
			<h1>Alertas</h1>

			<AlertsList
				alerts={alerts}
				loading={loading}
				onRefresh={() => fetchAlerts(first / rows, rows)}
			/>

			<Paginator
				first={first}
				rows={rows}
				totalRecords={totalElements}
				rowsPerPageOptions={[10, 20, 30, 40]}
				onPageChange={changePage}
				className="mt-3"
			/>
		</div>
	);
};

export default AlertsPage;
