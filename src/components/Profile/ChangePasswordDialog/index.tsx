import "./change-password.style.css";
import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import type { IChangePassword } from "@/commons/types/types";
import { createValidationRules } from "@/utils/FormUtils";
import AuthService from "@/services/auth-service";
import { useToast } from "@/context/hooks/use-toast";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";

const FORM_DEFAULT_VALUES: IChangePassword = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export const ChangePasswordDialog = () => {
	const [visible, setVisible] = useState<boolean>(false);
	const { showToast } = useToast();
	const {
		control,
		handleSubmit,
		getValues,
		formState: { isSubmitting, isValid },
		reset,
	} = useForm<IChangePassword>({
		defaultValues: FORM_DEFAULT_VALUES,
		mode: "all",
	});

	const handleChangePassword = async (data: IChangePassword) => {
		try {
			const response = await AuthService.changePassword(data);

			if (response.status == 200) {
				setVisible(false);
				reset();
				showToast("success", "Sucesso", "Senha alterada com sucesso!");

				reset();
				setVisible(false);
			} else {
				showToast(
					"error",
					"Erro",
					response.message || "Erro ao alterar a senha"
				);
			}
		} catch (error) {
			console.log(error);
			showToast(
				"error",
				"Erro",
				"Erro ao alterar a senha. Tente novamente."
			);
		}
	};

	const handleCancel = () => {
		setVisible(false);
		reset();
	};

	const headerElement = <h3>Alterar Senha</h3>;

	return (
		<>
			<Button
				label="Alterar Senha"
				onClick={() => setVisible(true)}
				icon="pi pi-lock"
				severity="secondary"
			/>
			<Dialog
				draggable={false}
				visible={visible}
				modal
				header={headerElement}
				style={{ width: "50rem" }}
				onHide={() => {
					if (!visible) return;
					handleCancel();
				}}
				className="change-password-dialog"
			>
				<form
					onSubmit={handleSubmit(handleChangePassword)}
					className="flex flex-column gap-3"
					noValidate
				>
					<div className="input-group">
						<label htmlFor="currentPassword">Senha Atual</label>
						<Controller
							name="currentPassword"
							control={control}
							rules={createValidationRules({
								label: "Senha Atual",
								required: true,
								minLength: 6,
							})}
							render={({ field, fieldState }) => (
								<>
									<Password
										inputId="currentPassword"
										aria-describedby="currentPassword"
										aria-invalid={!!fieldState.error}
										required
										className="w-full"
										inputClassName={classNames("w-full", {
											"p-invalid": fieldState.error,
										})}
										toggleMask
										feedback={false}
										{...field}
									/>
									{fieldState.error && (
										<small
											id="currentPassword-error"
											className="p-error block mt-1"
										>
											{fieldState.error.message}
										</small>
									)}
								</>
							)}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="newPassword">Nova Senha</label>
						<Controller
							name="newPassword"
							control={control}
							rules={createValidationRules({
								label: "Nova Senha",
								required: true,
								type: "password",
							})}
							render={({ field, fieldState }) => (
								<>
									<Password
										id="newPassword"
										type="password"
										aria-describedby="newPassword"
										aria-invalid={!!fieldState.error}
										required
										className="w-full"
										inputClassName={classNames("w-full", {
											"p-invalid": fieldState.error,
										})}
										toggleMask
										feedback={false}
										{...field}
									/>
									{fieldState.error && (
										<small
											id="newPassword-error"
											className="p-error block mt-1"
										>
											{fieldState.error.message}
										</small>
									)}
								</>
							)}
						/>
					</div>
					<div className="input-group">
						<label htmlFor="confirmPassword">Confirmar Senha</label>
						<Controller
							name="confirmPassword"
							control={control}
							rules={createValidationRules({
								label: "Confirmar Senha",
								required: true,
								custom: (value) => {
									if (value !== getValues("newPassword")) {
										return "As senhas não conferem";
									}
									return true;
								},
							})}
							render={({ field, fieldState }) => (
								<>
									<Password
										id="confirmPassword"
										type="password"
										aria-describedby="confirmPassword"
										aria-invalid={!!fieldState.error}
										required
										className="w-full"
										inputClassName={classNames("w-full ", {
											"p-invalid": fieldState.error,
										})}
										toggleMask
										feedback={false}
										{...field}
									/>
									{fieldState.error && (
										<small
											id="confirmPassword-error"
											className="p-error block mt-1"
										>
											{fieldState.error.message}
										</small>
									)}
								</>
							)}
						/>
					</div>
					<div className="w-100 mt-3 flex gap-2 justify-content-end">
						<Button
							outlined
							severity="danger"
							type="button"
							label="Cancelar"
							onClick={handleCancel}
						/>
						<Button
							severity="success"
							type="submit"
							label="Alterar Senha"
							disabled={isSubmitting || !isValid}
							loading={isSubmitting}
							loadingIcon="pi pi-spin pi-spinner"
						/>
					</div>
				</form>
			</Dialog>
		</>
	);
};
