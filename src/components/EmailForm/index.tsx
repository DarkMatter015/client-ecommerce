import type { IAlertRequest, IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import type React from "react";

import { useToast } from "@/context/hooks/use-toast";
import { VALIDATION_RULES } from "@/utils/FormUtils";
import { useForm } from "react-hook-form";
import { FormInput } from "../Form/FormInput";
import "./email-form.style.css";
import { createAlert } from "@/services/alerts.service";
import { useAuth } from "@/context/hooks/use-auth";
import { useEffect } from "react";
import { QuantityTagProduct } from "../Product/QuantityTagProduct";

interface EmailFormProps {
	hide: (e: React.SyntheticEvent | any) => void;
	product: IProduct;
}

export const EmailForm = ({ hide, product }: EmailFormProps) => {
	const { showToast } = useToast();
	const { authenticatedUser } = useAuth();

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting, isValid },
	} = useForm<{ email: string }>({
		defaultValues: { email: "" },
		mode: "all",
	});

	useEffect(() => {
		if (authenticatedUser) {
			reset({ email: authenticatedUser.email });
		}
	}, [authenticatedUser]);

	const onSubmit = async (data: { email: string }) => {
		try {
			const alertRequest: IAlertRequest = {
				email: data.email,
				productId: product.id,
			};
			await createAlert(alertRequest);
			showToast(
				"success",
				"Sucesso",
				"Iremos te mandar um email quando o produto tiver mais estoque!"
			);
			reset();
			hide(null);
		} catch (err: any) {
			console.error("Erro ao enviar alerta", err);
			showToast("error", "Erro", err.response?.data?.message);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className="email-form"
		>
			<div className="email-form-header">
				<h3>Avise-me</h3>
				<p>Receba um email quando este produto receber mais estoque.</p>
			</div>

			<div className="email-form-product-card">
				<img
					src={
						product.urlImage ||
						"/assets/images/common/unavailable_image_product.png"
					}
					alt={product.name}
				/>
				<div className="email-form-product-card-info">
					<span className="email-form-product-card-info-name">
						{product.name}
					</span>
					<div className="email-form-product-card-info">
						<span className="email-form-product-card-info-price">
							R$ {product.price?.toFixed(2).replace(".", ",")}
						</span>
						<span>
							<QuantityTagProduct product={product} />
						</span>
					</div>
				</div>
			</div>

			<FormInput
				control={control}
				name="email"
				label="Seu melhor email"
				placeholder="seu@email.com"
				rules={VALIDATION_RULES.email}
				autoComplete="email"
				type="email"
				value={authenticatedUser?.email}
			/>

			<div className="email-form-actions">
				<Button
					label="Cancelar"
					type="button"
					onClick={(e) => {
						reset();
						hide(e);
					}}
					severity="danger"
					outlined
				/>
				<Button
					label="Avise-me"
					type="submit"
					severity="help"
					disabled={isSubmitting || !isValid}
				/>
			</div>
		</form>
	);
};
