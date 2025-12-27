import type { IResetPassword } from "@/commons/types/types";
import { AuthFooter } from "@/components/Auth/AuthFooter";
import { FormPasswordInput } from "@/components/Form/FormPasswordInput";
import { PasswordFooter } from "@/components/Form/PasswordFooter";
import { useToast } from "@/context/hooks/use-toast";
import AuthService from "@/services/auth-service";
import { VALIDATION_RULES } from "@/utils/FormUtils";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const DEFAULT_VALUES = {
	newPassword: "",
	confirmPassword: "",
};

export const ResetPasswordForm = ({ token }: { token: string }) => {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
		watch,
        reset,
	} = useForm<IResetPassword>({
		defaultValues: DEFAULT_VALUES,
		mode: "all",
	});
	const toast = useToast();
	const navigate = useNavigate();
    const newPassword = watch("newPassword");

	const onSubmit = async (data: IResetPassword) => {
        
		try {
            data.token = token;
			const response = await AuthService.resetPassword(data);
			if (response.success) {
				toast.showToast(
					"success",
					"Senha alterada",
					response.message || "Senha alterada com sucesso!"
				);
                reset();
				setTimeout(() => navigate("/login"), 3000);
			} else {
				toast.showToast(
					"error",
					"Erro",
					response.message ||
						"Erro ao alterar senha. Tente novamente mais tarde."
				);
			}
		} catch (error: any) {
			console.error(error);
			toast.showToast(
				"error",
				"Erro",
				error.message || "Erro ao alterar senha."
			);
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="p-fluid flex flex-column gap-5"
			autoComplete="on"
			noValidate
		>
			<FormPasswordInput
				control={control}
				name="newPassword"
				label="Nova Senha"
				placeholder="Insira sua nova senha"
				rules={{
					required: "Senha é obrigatória",
					validate: VALIDATION_RULES.password.validate,
				}}
                feedback={true}
				autoComplete="new-password"
				footer={<PasswordFooter control={control} name="newPassword" />}
			/>
			<FormPasswordInput
				control={control}
				name="confirmPassword"
				label="Confirmar Senha"
				placeholder="Confirme sua nova senha"
				rules={{
					required: "Confirmação de senha é obrigatória",
					validate: (value) => {
						if (value !== newPassword) {
							return "As senhas não coincidem";
						}
						return true;
					},
				}}
				autoComplete="new-password"
			/>

			<Button
				type="submit"
				className="w-full my-5 text-1xl form-submit-button"
				icon={isSubmitting ? "pi pi-spinner pi-spin" : "pi pi-lock"}
				disabled={isSubmitting || !isValid}
				aria-label="Criar nova senha"
				label="Criar nova senha"
			/>

			<AuthFooter
				text="Voltar para a página de login:"
				linkText="Faça login"
				to="/login"
			/>
		</form>
	);
};
