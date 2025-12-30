import type { IAddress } from "@/commons/types/types";
import { useToast } from "@/context/hooks/use-toast";
import { validateCep } from "@/services/cep-service";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormInput } from "../../Form/FormInput";

const DEFAULT_VALUES: IAddress = {
	cep: "",
	number: "",
	complement: undefined,
	street: "",
	neighborhood: "",
	city: "",
	state: "",
};

export const AddressDialog: React.FC<{
	showAddressDialog: boolean;
	handleAddressDialogHide: () => void;
	address: Partial<IAddress>;
	handleSaveAddress: (data: IAddress) => void;
	savingAddress: boolean;
	title?: string;
	submitLabel?: string;
}> = ({
	showAddressDialog,
	handleAddressDialogHide,
	address: initialAddress,
	handleSaveAddress,
	savingAddress,
	title,
	submitLabel,
}) => {
	const { showToast } = useToast();
	const [isValidatingCep, setIsValidatingCep] = useState(false);
	const [invalidCep, setInvalidCep] = useState<string>("");
	const isEditing = !!initialAddress.id;

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		reset,
		setError,
		formState,
	} = useForm<IAddress>({
		defaultValues: {
			...DEFAULT_VALUES,
			...initialAddress,
		},
		mode: "all",
	});

	useEffect(() => {
		if (showAddressDialog) {
			reset({
				...DEFAULT_VALUES,
				...initialAddress,
			});
		}
	}, [showAddressDialog, initialAddress, reset]);

	const dialogTitle =
		title ||
		(isEditing ? "Editar Endereço" : "Adicionar Novo Endereço");
	const buttonLabel =
		submitLabel ||
		(isEditing ? "Salvar Alterações" : "Salvar Endereço");

	const handleSearchCep = async () => {
		const cep = getValues("cep");
		if (!cep) {
			showToast("warn", "CEP Inválido", "Digite um CEP para buscar");
			return;
		}

		const cleanCep = cep.replace(/[^0-9]/g, "");
		if (cleanCep.length !== 8) {
			showToast("warn", "CEP Inválido", "CEP deve conter 8 dígitos");
			return;
		}

		try {
			setIsValidatingCep(true);
			const response = await validateCep(cleanCep);

			if (response.success) {
				const data = response.data as IAddress;
				setValue("street", data.street || "");
				setValue("neighborhood", data.neighborhood || "");
				setValue("city", data.city || "");
				setValue("state", data.state || "");
				setValue("cep", cleanCep);

				showToast(
					"success",
					"CEP Validado",
					"Endereço preenchido automaticamente"
				);
			} else {
				showToast(
					"error",
					"Erro ao buscar CEP",
					"CEP não encontrado ou é inválido"
				);
				setError("cep", {
					message: "CEP não encontrado ou é inválido",
				});
				setInvalidCep(cep);
			}
		} catch {
			showToast("error", "Erro ao buscar CEP", "Erro na requisição");
		} finally {
			setIsValidatingCep(false);
		}
	};

	const onSubmit = (data: IAddress) => {
		handleSaveAddress(data);
	};

	const handleHide = () => {
		reset();
		handleAddressDialogHide();
	};

	return (
		<Dialog
			visible={showAddressDialog}
			onHide={handleHide}
			header={dialogTitle}
			modal
			draggable={false}
			style={{ width: "90%" }}
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-column gap-3"
			>
				<div
					style={{
						padding: "1rem",
						backgroundColor: "#f0f8ff",
						borderRadius: "8px",
					}}
				>
					<FormInput
						control={control}
						name="cep"
						label="CEP *"
						mask="99999-999"
						placeholder="00000-000"
						disabled={isEditing}
						rules={{
							required: "CEP é obrigatório",
							pattern: {
								value: /^\d{5}-?\d{3}$/,
								message: "CEP inválido",
							},
							validate: {
								validateCep: (value) => {
									if (value === invalidCep) {
										return "CEP não encontrado ou é inválido";
									}
									return true;
								},
							},
						}}
					>
						<Button
							severity="info"
							type="button"
							icon={
								isValidatingCep
									? "pi pi-spin pi-spinner"
									: "pi pi-search"
							}
							onClick={handleSearchCep}
							disabled={
								isValidatingCep ||
								!!formState.errors.cep ||
								getValues("cep")?.length !== 9
							}
							tooltip="Buscar CEP"
						/>
					</FormInput>
				</div>
				<div className="grid">
					<div className="lg:col-6 col-12">
					<FormInput
						control={control}
						name="number"
						label="Número *"
						placeholder="123"
						type="number"
						minValue={1}
						maxLength={3}
						rules={{ required: "Número é obrigatório" }}
					/>
				</div>
				<div className="lg:col-6 col-12">
				<FormInput
					control={control}
					name="complement"
					label="Complemento"
					placeholder="Apto, bloco..."
				/>
				</div>
				</div>

				<div className="grid">
				<div className="lg:col-7 col-12">
				<FormInput
					control={control}
					name="street"
					label="Rua *"
					placeholder="Av. Brasil"
					disabled
					rules={{ required: "Rua é obrigatória" }}
				/>
				</div>
				<div className="lg:col-5 col-12">
				<FormInput
					control={control}
					name="neighborhood"
					label="Bairro *"
					placeholder="Centro"
					disabled
					rules={{ required: "Bairro é obrigatório" }}
				/>
				</div>
				</div>

				<FormInput
					control={control}
					name="city"
					label="Cidade *"
					placeholder="São Paulo"
					disabled
					rules={{ required: "Cidade é obrigatória" }}
				/>
				<FormInput
					control={control}
					name="state"
					label="Estado *"
					placeholder="SP"
					maxLength={2}
					disabled
					rules={{ required: "Estado é obrigatório" }}
				/>

				<div className="flex flex-column gap-3 lg:flex-row lg:justify-content-end">
					<Button
						severity="danger"
						outlined
						label="Cancelar"
						type="button"
						onClick={handleHide}
					/>
					<Button
						severity="success"
						label={buttonLabel}
						type="submit"
						loading={savingAddress}
						disabled={savingAddress || !formState.isValid || isEditing && !formState.isDirty}
					/>
				</div>
			</form>
		</Dialog>
	);
};
