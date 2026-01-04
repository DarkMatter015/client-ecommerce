import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import "./login.style.css";

import { useAuth } from "@/context/hooks/use-auth";
import { login } from "@/services/auth-service";
import { VALIDATION_RULES, createValidationRules } from "@/utils/FormUtils.ts";

import "@/styles/form.css";
import type {
	IAuthenticationResponse,
	IUserLogin,
} from "@/commons/types/types";
import { useToast } from "@/context/hooks/use-toast";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import { FormInput } from "@/components/Form/FormInput";
import { FormPasswordInput } from "@/components/Form/FormPasswordInput";
import { AuthFooter } from "@/components/Auth/AuthFooter";

const FORM_DEFAULT_VALUES: IUserLogin = {
	email: "",
	password: "",
};

const NAVIGATION_DELAY = 1000;

export const LoginPage = () => {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm<IUserLogin>({
		defaultValues: FORM_DEFAULT_VALUES,
		mode: "all",
	});

	const navigate = useNavigate();
	const { showToast } = useToast();
	const { handleLogin } = useAuth();

	const onSubmit = useCallback(
		async (userLogin: IUserLogin) => {
			try {
				const response = await login(userLogin);

				const authenticationResponse =
					response.data as IAuthenticationResponse;
				handleLogin(authenticationResponse);

				showToast("success", "Sucesso", "Login efetuado com sucesso.");

				setTimeout(() => {
					navigate("/", { replace: true });
				}, NAVIGATION_DELAY);
			} catch (error) {
				console.error("Login error:", error);
				showToast(
					"error",
					"Erro",
					"Falha ao efetuar login. Verifique suas credenciais e tente novamente."
				);
			}
		},
		[handleLogin, navigate, showToast]
	);

	return (
		<AuthLayout
			backgroundImage="/assets/images/login/fundo_login.svg"
			backgroundAlt="mulher sentada dando boas vindas"
		>
			<AuthHeader title="Entre na Sua Conta" />

			<form
				className="p-fluid flex flex-column gap-4"
				onSubmit={handleSubmit(onSubmit)}
				autoComplete="on"
				noValidate
			>
				<FormInput
					control={control}
					name="email"
					label="Email"
					placeholder="seu@email.com"
					rules={VALIDATION_RULES.email}
					autoComplete="email"
					type="email"
				/>

				<FormPasswordInput
					control={control}
					name="password"
					label="Senha"
					placeholder="Digite sua senha"
					rules={createValidationRules({
						label: "Senha",
						required: true,
						minLength: 6,
					})}
					autoComplete="current-password"
				/>
				<div className="flex justify-content-end">
					<Link to="/recuperar-senha" className="forgot-password">
						Esqueci minha senha
					</Link>
				</div>

				<Button
					severity="info"
					type="submit"
					className="w-full text-1xl form-submit-button"
					loading={isSubmitting}
					disabled={isSubmitting}
					aria-label="Entrar na conta"
					label="Entrar na conta"
				/>

				<AuthFooter
					text="Não tem uma conta?"
					linkText="Cadastre-se"
					to="/cadastro"
				/>
			</form>
		</AuthLayout>
	);
};
