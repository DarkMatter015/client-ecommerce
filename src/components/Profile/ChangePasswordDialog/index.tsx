import "./change-password.style.css";
import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { useForm } from "react-hook-form";
import type { IChangePassword } from "@/commons/types/types";
import { changePassword } from "@/services/auth-service";
import { useToast } from "@/context/hooks/use-toast";
import { FormPasswordInput } from "@/components/Form/FormPasswordInput";
import { PasswordFooter } from "@/components/Form/PasswordFooter";
import { VALIDATION_RULES } from "@/utils/FormUtils";

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
		watch,
		formState: { isSubmitting, isValid },
		reset,
	} = useForm<IChangePassword>({
		defaultValues: FORM_DEFAULT_VALUES,
		mode: "all",
	});

	const handleChangePassword = async (data: IChangePassword) => {
		try {
			await changePassword(data);

			setVisible(false);
			reset();
			showToast("success", "Sucesso", "Senha alterada com sucesso!");
		} catch (error: any) {
			showToast(
				"error",
				"Erro",
				error.response.data.message ||
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
					<FormPasswordInput
						control={control}
						name="currentPassword"
						label="Senha Atual"
						placeholder="Digite sua senha atual"
						feedback={false}
						rules={{
							required: "Senha Atual é obrigatória",
							minLength: {
								value: 6,
								message:
									"A senha deve ter no mínimo 6 caracteres",
							},
						}}
					/>
					<FormPasswordInput
						control={control}
						name="newPassword"
						label="Nova Senha"
						feedback={true}
						placeholder="Digite uma senha forte"
						rules={{
							required: "Nova Senha é obrigatória",
							validate: VALIDATION_RULES.password.validate,
						}}
						autoComplete="new-password"
						footer={
							<PasswordFooter
								control={control}
								name="newPassword"
							/>
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
								value === watch("newPassword") ||
								"As senhas não conferem",
						}}
						autoComplete="new-password"
					/>

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
