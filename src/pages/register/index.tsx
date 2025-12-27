import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

import type { IUserRegister } from "@/commons/types/types";
import AuthService from "@/services/auth-service";

import "@/styles/form.css";
import { useToast } from "@/context/hooks/use-toast";
import { VALIDATION_RULES } from "@/utils/FormUtils";
import { AuthLayout } from "@/layouts/AuthLayout";
import { AuthHeader } from "@/components/Auth/AuthHeader";
import { FormInput } from "@/components/Form/FormInput";
import { FormPasswordInput } from "@/components/Form/FormPasswordInput";
import { AuthFooter } from "@/components/Auth/AuthFooter";
import { PasswordFooter } from "@/components/Form/PasswordFooter";

const FORM_DEFAULT_VALUES: IUserRegister = {
	displayName: "",
	email: "",
	cpf: "",
	password: "",
	confirmPassword: "",
};

const NAVIGATION_DELAY = 1000;

export const RegisterPage = () => {
	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		getValues,
	} = useForm<IUserRegister>({
		defaultValues: FORM_DEFAULT_VALUES,
		mode: "all",
	});

	const navigate = useNavigate();

	const { showToast } = useToast();

	const onSubmit = useCallback(
		async (data: IUserRegister) => {
			try {
				data.cpf = data.cpf.replace(/\D/g, "");
				const response = await AuthService.signup(data);

				if (response.success && response.data) {
					showToast(
						"success",
						"Sucesso",
						"Usuário cadastrado com sucesso."
					);

					setTimeout(() => {
						navigate("/login", { replace: true });
					}, NAVIGATION_DELAY);
				} else {
					showToast(
						"error",
						"Erro",
						"Falha ao cadastrar usuário. Verifique os dados e tente novamente."
					);
				}
			} catch (error) {
				console.error("Register error:", error);
				showToast(
					"error",
					"Erro",
					"Falha ao cadastrar usuário. Verifique os dados e tente novamente."
				);
			}
		},
		[navigate, showToast]
	);

	return (
		<AuthLayout
			backgroundImage="/assets/images/signup/fundo_signup.svg"
			backgroundAlt="mulher clicando em botão play"
		>
			<AuthHeader title="Cadastre sua conta" />

			<form
				className="p-fluid flex flex-column gap-5 lg:gap-3"
				onSubmit={handleSubmit(onSubmit)}
				autoComplete="on"
				noValidate
			>
				<FormInput
					control={control}
					name="displayName"
					label="Nome"
					placeholder="Digite seu nome completo"
					icon="pi-user"
					autoComplete="name"
					rules={VALIDATION_RULES.displayName}
				/>

				<FormInput
					control={control}
					name="email"
					label="Email"
					placeholder="seu@email.com"
					icon="pi-envelope"
					type="email"
					autoComplete="email"
					rules={VALIDATION_RULES.email}
				/>

				<FormInput
					control={control}
					name="cpf"
					label="Cpf"
					placeholder="000.000.000-00"
					icon="pi-id-card"
					mask="999.999.999-99"
					autoComplete="cpf"
					rules={VALIDATION_RULES.cpf}
				/>

				<FormPasswordInput
					control={control}
					name="password"
					label="Senha"
					feedback={true}
					placeholder="Digite uma senha forte"
					rules={{
						required: "Senha é obrigatória",
						validate: VALIDATION_RULES.password.validate,
					}}
					autoComplete="new-password"
					footer={
						<PasswordFooter control={control} name="password" />
					}
				/>

				<FormPasswordInput
					control={control}
					name="confirmPassword"
					label="Confirmar Senha"
					placeholder="Digite a senha novamente"
					rules={{
						required: "Confirme sua senha",
						validate: (value) =>
							value === getValues("password") ||
							"As senhas não conferem",
					}}
					autoComplete="new-password"
				/>

				<Button
					label="Cadastrar"
					type="submit"
					className="w-full text-1xl form-submit-button"
					loading={isSubmitting}
					disabled={isSubmitting}
					aria-label="Cadastrar nova conta"
				/>

				<AuthFooter
					text="Já tem uma conta?"
					linkText="Faça login"
					to="/login"
				/>
			</form>
		</AuthLayout>
	);
};
