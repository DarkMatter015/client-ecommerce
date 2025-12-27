import type { IForgotPassword } from "@/commons/types/types";
import { AuthFooter } from "@/components/Auth/AuthFooter";
import { FormInput } from "@/components/Form/FormInput";
import { useToast } from "@/context/hooks/use-toast";
import AuthService from "@/services/auth-service";
import { VALIDATION_RULES } from "@/utils/FormUtils";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";

export const EmailRecoveryPasswordForm = () => {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
		reset,
	} = useForm<IForgotPassword>({
		defaultValues: { email: "" },
		mode: "all",
	});
	const toast = useToast();

	const onSubmit = async (data: IForgotPassword) => {
		try {
			const response = await AuthService.forgotPassword(data);
			if (response.success) {
				toast.showToast(
					"success",
					"Email enviado",
					response.message || "Email enviado com sucesso!"
				);
				reset();
			} else {
				toast.showToast(
					"error",
					"Erro",
					response.message ||
						"Erro ao enviar email. Tente novamente mais tarde."
				);
			}
		} catch (error: any) {
			console.error(error);
			toast.showToast(
				"error",
				"Erro",
				error.message || "Erro ao enviar."
			);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FormInput
				control={control}
				name="email"
				label="Email"
				placeholder="seu@email.com"
				rules={VALIDATION_RULES.email}
				autoComplete="email"
				type="email"
			/>

			<Button
				type="submit"
				className="w-full my-5 text-1xl form-submit-button"
				icon={isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-lock"}
				disabled={isSubmitting || !isValid}
				aria-label="Recuperar Senha"
				label="Recuperar Senha"
			/>

			<AuthFooter
				text="Voltar para a página de login:"
				linkText="Faça login"
				to="/login"
			/>
		</form>
	);
};
