import { Button } from "primereact/button";
import { ChangePasswordDialog } from "../ChangePasswordDialog";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { useState, useEffect } from "react";
import { useToast } from "@/context/hooks/use-toast";
import { useAuth } from "@/context/hooks/use-auth";
import type { IUserUpdate } from "@/commons/types/types";
import { updateProfile } from "@/services/auth.service";
import { useForm, Controller } from "react-hook-form";
import { createValidationRules } from "@/utils/FormUtils";
import { classNames } from "primereact/utils";
import "./profile-card-informations.style.css";

const FORM_DEFAULT_VALUES = {
	displayName: "",
	email: "",
};

export const ProfileCardInformations = () => {
	const { authenticatedUser, setAuthenticatedUser } = useAuth();
	const { showToast } = useToast();
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { isSubmitting, isValid },
		reset,
		watch,
	} = useForm<IUserUpdate>({
		defaultValues: FORM_DEFAULT_VALUES,
		mode: "all",
	});

	useEffect(() => {
		if (authenticatedUser) {
			reset({
				displayName: authenticatedUser.displayName,
				email: authenticatedUser.email,
			});
		}
	}, [authenticatedUser, reset]);

	const watchedDisplayName = watch("displayName");
	const watchedEmail = watch("email");

	const isEquals =
		authenticatedUser?.displayName === watchedDisplayName &&
		authenticatedUser?.email === watchedEmail;

	const handleEditClick = () => {
		if (authenticatedUser) {
			reset({
				displayName: authenticatedUser.displayName,
				email: authenticatedUser.email,
			});
		}
		setIsEditing(true);
	};

	const handleCancel = () => {
		setIsEditing(false);
		if (authenticatedUser) {
			reset({
				displayName: authenticatedUser.displayName,
				email: authenticatedUser.email,
			});
		}
	};

	const handleSave = async (data: IUserUpdate) => {
		if (
			data.displayName == authenticatedUser?.displayName &&
			data.email == authenticatedUser?.email
		) {
			setIsEditing(false);
			return;
		}

		try {
			setIsSaving(true);
			data.id = authenticatedUser?.id;
			await updateProfile(data);

			setAuthenticatedUser({
				...authenticatedUser!,
				displayName: data.displayName || "",
				email: data.email || "",
			});
			setIsEditing(false);
			showToast("success", "Sucesso", "Perfil atualizado com sucesso!");
		} catch (error: any) {
			console.error("Erro ao atualizar perfil:", error);
			showToast(
				"error",
				"Erro",
				error.message || "Erro ao atualizar o perfil. Tente novamente."
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Card className="profile-card">
			<div className="profile-header">
				<div className="profile-avatar">
					<i className="pi pi-user"></i>
				</div>
				<div className="profile-info">
					<h2>Informações da Conta</h2>
				</div>
			</div>

			<div>
				<form
					onSubmit={handleSubmit(handleSave)}
					className="w-full flex flex-column gap-3"
					noValidate
				>
					<div className="input-group">
						<label htmlFor="displayName" className="field-label">
							Nome de Usuário
						</label>
						{isEditing ? (
							<Controller
								name="displayName"
								control={control}
								rules={createValidationRules({
									label: "Nome de Usuário",
									required: true,
									minLength: 3,
								})}
								render={({ field, fieldState }) => (
									<>
										<InputText
											id="displayName"
											{...field}
											placeholder="Digite seu nome"
											className={classNames("w-full", {
												"p-invalid": fieldState.error,
											})}
											autoFocus
										/>
										{fieldState.error && (
											<small className="p-error block mt-1">
												{fieldState.error.message}
											</small>
										)}
									</>
								)}
							/>
						) : (
							<div className="field-display">
								<span className="field-value">
									{authenticatedUser?.displayName}
								</span>
							</div>
						)}
					</div>

					<div className="input-group">
						<label htmlFor="email" className="field-label">
							Email
						</label>
						{isEditing ? (
							<Controller
								name="email"
								control={control}
								rules={createValidationRules({
									required: true,
									type: "email",
								})}
								render={({ field, fieldState }) => (
									<>
										<InputText
											id="email"
											{...field}
											placeholder="Digite seu email"
											className={classNames("w-full", {
												"p-invalid": fieldState.error,
											})}
										/>
										{fieldState.error && (
											<small className="p-error block mt-1">
												{fieldState.error.message}
											</small>
										)}
									</>
								)}
							/>
						) : (
							<div className="field-display">
								<span className="field-value">
									{authenticatedUser?.email}
								</span>
							</div>
						)}
					</div>

					{/* TODO: Make the authenticated user return the full UserResponseDTO and get the cpf */}
					{/* <div className="input-group">
						<label htmlFor="cpf" className="field-label">
							Cpf
						</label>
							<div className="field-display">
								<span className="field-value">
									{authenticatedUser?.cpf}
								</span>
							</div>
					</div> */}

					{/* Action Buttons */}
					<div className="profile-actions">
						{isEditing ? (
							<div className="edit-actions">
								<Button
									severity="danger"
									label="Cancelar"
									onClick={handleCancel}
									outlined
									type="button"
								/>
								<Button
									severity="success"
									label="Salvar Alterações"
									type="submit"
									loading={isSaving || isSubmitting}
									disabled={
										isSaving ||
										isSubmitting ||
										!isValid ||
										isEquals
									}
									icon="pi pi-check"
								/>
							</div>
						) : (
							<div className="profile-actions">
								<Button
									label="Editar Perfil"
									onClick={handleEditClick}
									icon="pi pi-pencil"
									type="button"
								/>
								<ChangePasswordDialog />
							</div>
						)}
					</div>
				</form>
			</div>
		</Card>
	);
};
