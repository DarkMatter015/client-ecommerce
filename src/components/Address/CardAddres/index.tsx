import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import type { IAddress } from "@/commons/types/types";
import "./card-address.style.css";

interface CardAddressProps {
	address: IAddress;
	onEdit: (address: IAddress) => void;
	onDelete: (id: number) => void;
	onActive: (id: number) => void;
}

export const CardAddress = ({
	address,
	onEdit,
	onDelete,
	onActive,
}: CardAddressProps) => {
	return (
		<div className="card-address-container">
			<div className={`card-address-content border-round-sm shadow-2 ${address.active ? "active" : "inactive"}`}>
				<div className="flex flex-column gap-2 mb-3">
					<div className="flex align-items-center justify-content-between mb-2">
						<span
							className="text-xl font-bold text-900 overflow-hidden text-overflow-ellipsis white-space-nowrap"
							title={`${address.street}, ${address.number}`}
						>
							{address.street}, {address.number}
						</span>
						<div className="flex gap-2">
							{address.active !== undefined && (
								<Tag
									severity={
										address.active ? "success" : "danger"
									}
									value={address.active ? "Ativo" : "Inativo"}
									icon={
										address.active
											? "pi pi-check"
											: "pi pi-times"
									}
								/>
							)}
							<i className="pi pi-map-marker text-primary text-xl"></i>
						</div>
					</div>

					{address.complement && (
						<div className="text-500 text-sm">
							{address.complement}
						</div>
					)}

					<div className="flex flex-column gap-1 text-700">
						<span>{address.neighborhood}</span>
						<span>
							{address.city} - {address.state}
						</span>
						<span className="font-semibold text-600">
							CEP: {address.cep}
						</span>
					</div>
				</div>

				<div className="flex justify-content-end gap-2 pt-2 border-top-1 surface-border">
					{address.active ? (
						<>
					<Button
						icon="pi pi-pencil"
						rounded
						outlined
						severity="info"
						aria-label="Editar"
						onClick={() => onEdit(address)}
						title="Editar Endereço"
					/>
					
					<Button
						icon="pi pi-trash"
						rounded
						outlined
						severity="danger"
						aria-label="Excluir"
						onClick={() => address.id && onDelete(address.id)}
						title="Excluir Endereço"
					/>
					</>
					) :
					<Button
						icon="pi pi-check"
						rounded
						outlined
						severity="success"
						aria-label="Ativar"
						onClick={() => address.id && onActive(address.id)}
						title="Ativar Endereço"
					/>
				}
				</div>
			</div>
		</div>
	);
};
