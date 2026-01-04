import { AddressManagementTable } from "@/components/Address/AddressManagementTable";
import { useToast } from "@/context/hooks/use-toast";
import { Paginator } from "primereact/paginator";
import { useEffect, useState } from "react";
import type { IAddress } from "@/commons/types/types";
import { getAddresses } from "@/services/address-service";

export const AddressesPage = () => {
	const { showToast } = useToast();
	const [first, setFirst] = useState(0);
	const [rows, setRows] = useState(10);
	const [loading, setLoading] = useState(false);

	const [addresses, setAddresses] = useState<IAddress[]>([]);
	const [totalElements, setTotalElements] = useState(0);

	const fetchAddresses = async (pageIndex: number, pageSize: number) => {
		setLoading(true);
		try {
			const response = await getAddresses(
				pageIndex,
				pageSize
			);
			if (response) {
				setAddresses(response.content);
				setTotalElements(response.totalElements);
			}
		} catch (error) {
			console.error("Erro ao buscar endereços:", error);
			showToast(
				"error",
				"Erro",
				"Não foi possível carregar os endereços."
			);
		} finally {
			setLoading(false);
		}
	};

	const changePage = (e: any) => {
		if (totalElements < e.rows) return;
		setFirst(e.first);
		setRows(e.rows);
	};

	useEffect(() => {
		fetchAddresses(first / rows, rows);
	}, [first, rows]);

	return (
		<div className="p-4">
			<h1>Endereços</h1>

			<AddressManagementTable
				addresses={addresses}
				loading={loading}
				onRefresh={() => fetchAddresses(first / rows, rows)}
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
