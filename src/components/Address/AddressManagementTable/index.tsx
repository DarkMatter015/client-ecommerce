import type { IAddress } from "@/commons/types/types";
import { DataView } from "primereact/dataview";
import React, { useState } from "react";

import "./styles.css";
import { CardAddress } from "../CardAddres";
import { useToast } from "@/context/hooks/use-toast";
import {
	activeAddress,
	createAddress,
	deleteAddress,
	updateAddress,
} from "@/services/address-service";
import { AddressDialog } from "../RegisterAddressDialog";
import { Button } from "primereact/button";

interface AddressManagementTableProps {
	addresses: IAddress[];
	loading?: boolean;
	onRefresh: () => void;
}

export const AddressManagementTable: React.FC<AddressManagementTableProps> = ({
	addresses,
	loading = false,
	onRefresh,
}) => {
	const { showToast, showConfirmToast } = useToast();
	const [showDialog, setShowDialog] = useState(false);
	const [currentAddress, setCurrentAddress] = useState<Partial<IAddress>>({});
	const [saving, setSaving] = useState(false);

	const handleCreateNew = () => {
		setCurrentAddress({});
		setShowDialog(true);
	};

	const headerTemplate = () => {
		return (
			<div className="flex justify-end mb-4">
				<Button
					severity="success"
					icon="pi pi-plus"
					label="Cadastrar Endereço"
					onClick={handleCreateNew}
				/>
			</div>
		);
	};

	const handleEdit = (address: IAddress) => {
		setCurrentAddress({ ...address });
		setShowDialog(true);
	};

	const handleShowConfirm = (id: number, action: string) => {
		showConfirmToast(
			"warn",
			"Atenção",
			`Tem certeza que deseja ${action} este endereço?`,
			() => handleAction(id, action)
		);
	};

	const handleAction = async (id: number, action: string) => {
		try {
			const success =
				action === "deletar"
					? await deleteAddress(id)
					: await activeAddress(id);
			if (success) {
				onRefresh();
				setTimeout(() => {
					showToast(
						"success",
						"Sucesso",
						`Endereço ${
							action === "deletar" ? "excluído" : "ativado"
						} com sucesso.`
					);
				}, 500);
			} else {
				showToast(
					"error",
					"Erro",
					`Falha ao ${
						action === "deletar" ? "excluir" : "ativar"
					} o endereço.`
				);
			}
		} catch (error) {
			console.error(
				`Erro ao ${
					action === "deletar" ? "excluir" : "ativar"
				} endereço:`,
				error
			);
			showToast(
				"error",
				"Erro",
				`Falha ao ${
					action === "deletar" ? "excluir" : "ativar"
				} o endereço.`
			);
		}
	};

	const handleSaveAddress = async (formData: IAddress) => {
		setSaving(true);
		try {
			let result;
			const addressToSave = { ...currentAddress, ...formData };

			if (addressToSave.id) {
				result = await updateAddress(addressToSave);
			} else {
				result = await createAddress(addressToSave);
			}

			if (result) {
				showToast(
					"success",
					"Sucesso",
					`Endereço ${
						addressToSave.id ? "atualizado" : "criado"
					} com sucesso.`
				);
				setShowDialog(false);
				onRefresh();
			} else {
				showToast(
					"error",
					"Erro",
					`Falha ao ${
						addressToSave.id ? "atualizar" : "criar"
					} o endereço.`
				);
			}
		} catch (error) {
			console.error("Erro ao salvar endereço:", error);
			showToast("error", "Erro", "Erro ao salvar o endereço.");
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <div className="p-4 text-center">Carregando endereços...</div>;
	}

	return (
		<>
			{headerTemplate()}
			<div className="address-management-view">
				<DataView
					emptyMessage="Nenhum endereço encontrado."
					value={addresses}
					itemTemplate={(item) => (
						<CardAddress
							address={item}
							onEdit={handleEdit}
							onDelete={() =>
								handleShowConfirm(item.id, "deletar")
							}
							onActive={() =>
								handleShowConfirm(item.id, "ativar")
							}
						/>
					)}
					layout="grid"
					className="w-full"
				/>
			</div>
			<AddressDialog
				showAddressDialog={showDialog}
				handleAddressDialogHide={() => setShowDialog(false)}
				address={currentAddress}
				handleSaveAddress={handleSaveAddress}
				savingAddress={saving}
			/>
		</>
	);
};
