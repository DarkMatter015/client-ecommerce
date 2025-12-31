import { useEffect } from "react";
import type React from "react";

import "./calc-freight.style.css";
import type { IItem } from "@/commons/types/types";
import { FreightList } from "../FreightList";
import { useFreight } from "@/hooks/useFreight";
import { Button } from "primereact/button";
import { FormInput } from "@/components/Form/FormInput";
import { useForm } from "react-hook-form";
import { useCart } from "@/context/hooks/use-cart";

export const CalcFreight: React.FC<{
	cep?: string;
	setCep?: (cep: string) => void;
	produtos: IItem[];
	inputDisabled?: boolean;
	selectedFreightDisabled?: boolean;
}> = ({ cep, setCep, produtos, inputDisabled = false, selectedFreightDisabled = false }) => {
	const { control, watch, formState, setValue } = useForm<{ cep: string }>({
		defaultValues: {
			cep: cep || "",
		},
		mode: "all",
	});
	const { onSetFreight } = useCart();

	const currentCep = watch("cep");

	useEffect(() => {
		if (cep) {
			setValue("cep", cep, { shouldValidate: true });
			onSetFreight(null);
			setFreightsData(undefined);
		}
	}, [cep, setValue]);

	const { handleCalculateFreight, freightsData, loading, setFreightsData } = useFreight(
		currentCep,
		produtos
	);

	return (
		<>
			<div className="mb-3 mt-3 container-input">
				<div className="input-group mb-1">
					<FormInput
						control={control}
						name="cep"
						label="Calcular Frete e Prazo"
						placeholder="Insira seu CEP"
						mask="99999-999"
						rules={{
							required: "CEP é obrigatório",
							pattern: {
								value: /^\d{5}-?\d{3}$/,
								message: "CEP inválido",
							},
						}}
						value={cep}
						onChange={(e) => {
							if (setCep) {
								setCep(e.target.value);
							}
						}}
						disabled={loading || inputDisabled}
					/>
					<Button
						onClick={handleCalculateFreight}
						disabled={loading || !formState.isValid}
						aria-label="Calcular frete e prazo"
						severity="help"
						className="btn-freight"
						label={loading ? "Carregando..." : "Calcular"}
						icon={loading ? "pi pi-spin pi-spinner" : null}
					/>
				</div>
				<a href="#" className="small">
					Não sei meu CEP
				</a>
			</div>

			{freightsData && freightsData.length > 0 && (
				<FreightList freights={freightsData} selectedFreightDisabled={selectedFreightDisabled} />
			)}
		</>
	);
};
