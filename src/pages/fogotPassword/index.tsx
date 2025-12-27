import { AuthHeader } from "@/components/Auth/AuthHeader";
import { EmailRecoveryPasswordForm } from "@/components/ForgotPassword/EmailRecoveryPasswordForm";
import { ResetPasswordForm } from "@/components/ForgotPassword/ResetPasswordForm";
import { useToast } from "@/context/hooks/use-toast";
import { AuthLayout } from "@/layouts/AuthLayout";
import AuthService from "@/services/auth-service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const ForgotPasswordPage = () => {
	const searchParams = useSearchParams();
	const token = searchParams[0].get("token");
	const toast = useToast();
	const [isValidToken, setIsValidToken] = useState(false);

	const validateToken = async (token: string) => {
		try {
			const response = await AuthService.validateResetToken(token);
			if (response.success) {
				return true;
			} else {
				toast.showToast(
					"error",
					"Erro na validação do token",
					response.message || "Token inválido."
				);
			}
			return false;
		} catch (error: any) {
			console.error(error);
			toast.showToast(
				"error",
				"Erro na validação do token",
				error.message || "Token inválido."
			);
			return false;
		}
	};

	useEffect(() => {
		console.log(token);
		const validate = async () => {
			if (token) {
				const isValid = await validateToken(token);
				setIsValidToken(isValid);
			}
		};
		validate();
		console.log(isValidToken);
	}, [token]);

	return (
		<AuthLayout
			backgroundImage="/assets/images/forgot-password/forgot-password.svg"
			backgroundAlt="mulher sentada dando boas vindas"
		>
			{!token || !isValidToken ? (
				<>
					<AuthHeader
						title="Recupere Sua Senha"
						subtitle="Insira o seu email e enviaremos um link para redefinir sua senha."
					/>
					<EmailRecoveryPasswordForm />
				</>
			) : (
				<>
					<AuthHeader title="Defina sua nova senha" />
					<ResetPasswordForm token={token} />
				</>
			)}
		</AuthLayout>
	);
};
