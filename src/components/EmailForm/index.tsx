import type { IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import type React from "react";

import "./email-form.style.css";
import { useToast } from "@/context/hooks/use-toast";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";

export const EmailForm: React.FC<{
	hide: (e: React.SyntheticEvent | any) => void;
	product: IProduct;
}> = ({ hide, product }) => {
	/* const [email, setEmail] = useState<string>(""); */ // Removed manual state
	const { showToast } = useToast();

	const VALIDATION_RULES = {
		email: {
			required: "Email é obrigatório",
			pattern: {
				value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
				message: "Email inválido",
			},
		},
	} as const;

	const {
		control,
		handleSubmit,
		reset,
		formState: { isSubmitting },
	} = useForm<{ email: string }>({
		defaultValues: { email: "" },
		mode: "onChange",
	});

	const onSubmit = (data: { email: string }) => {
		// Simulate API call or logic
		console.log("Email submitted:", data.email);
		showToast(
			"success",
			"Sucesso",
			"Iremos te mandar um email quando o produto estiver disponível!"
		);
		reset();
		hide(data as any);
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			noValidate
			className="email-form shadow-none border-none"
		>
			<div className="text-center mb-3">
				<h3 className="text-900 font-bold text-xl mb-1">Avise-me</h3>
				<p className="text-500 m-0">
					Receba um email quando este produto estiver disponível.
				</p>
			</div>

			<div className="flex align-items-center gap-3 p-3 surface-ground border-round-lg shadow-1 w-full">
				<img
					src={product.urlImage}
					alt={product.name}
					className="w-4rem h-4rem border-round object-cover shadow-1 bg-white"
				/>
				<div className="flex flex-column gap-1">
					<span className="font-semibold text-700 text-lg">
						{product.name}
					</span>
					<div className="flex align-items-center gap-2">
						<span className="text-green-600 font-bold">
							R$ {product.price?.toFixed(2).replace(".", ",")}
						</span>
					</div>
				</div>
			</div>

			<div className="form-group w-full mt-3">
				<label
					htmlFor="email"
					className="text-700 font-medium mb-2 block"
				>
					Seu melhor Email
				</label>
				<Controller
					name="email"
					control={control}
					rules={VALIDATION_RULES.email}
					render={({ field, fieldState }) => (
						<>
							<InputText
								id="email"
								type="email"
								autoComplete="email"
								placeholder="seu@email.com"
								aria-describedby="email-error"
								aria-invalid={!!fieldState.error}
								className={classNames(
									{
										"p-invalid": fieldState.error,
									},
									"w-full p-3 border-round-md border-1 border-300 focus:border-primary transition-colors"
								)}
								{...field}
							/>
							{fieldState.error && (
								<small
									id="email-error"
									className="p-error block mt-1"
								>
									{fieldState.error.message}
								</small>
							)}
						</>
					)}
				/>
			</div>

			<div className="flex justify-content-end gap-2 mt-4 w-full">
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
					loading={isSubmitting}
				/>
			</div>
		</form>
	);
};
