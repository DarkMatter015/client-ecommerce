import type { IForgotPassword } from "@/commons/types/types";
import { AuthFooter } from "@/components/Auth/AuthFooter";
import { FormInput } from "@/components/Form/FormInput";
import { useToast } from "@/context/hooks/use-toast";
import { forgotPassword } from "@/services/auth-service";
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
			await forgotPassword(data);
			toast.showToast(
				"success",
				"Email enviado",
				"Se esse email estiver correto, você receberá um email com um link para redefinir sua senha."
			);
			reset();
		} catch (error: any) {
			console.error(error);
			toast.showToast(
				"error",
				"Erro",
				error.response.data.message ||
					"Erro ao enviar o email. Tente novamente mais tarde."
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
