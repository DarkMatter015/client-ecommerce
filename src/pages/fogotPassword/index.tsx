import { AuthHeader } from "@/components/Auth/AuthHeader";
import { EmailRecoveryPasswordForm } from "@/components/ForgotPassword/EmailRecoveryPasswordForm";
import { ResetPasswordForm } from "@/components/ForgotPassword/ResetPasswordForm";
import { useToast } from "@/context/hooks/use-toast";
import { AuthLayout } from "@/layouts/AuthLayout";
import { validateResetToken } from "@/services/auth-service";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const ForgotPasswordPage = () => {
	const searchParams = useSearchParams();
	const token = searchParams[0].get("token");
	const toast = useToast();
	const [isValidToken, setIsValidToken] = useState(false);

	const validateToken = async (token: string) => {
		try {
			await validateResetToken(token);
			return true;
		} catch (error: any) {
			console.error(error);
			toast.showToast(
				"error",
				"Erro na validação do token",
				error.response.data.message || "Token inválido ou Expirado."
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
