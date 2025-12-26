import {
	Controller,
	type Control,
	type RegisterOptions,
} from "react-hook-form";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";

interface FormPasswordInputProps {
	control: Control<any>;
	name: string;
	label: string;
	rules?: Omit<
		RegisterOptions<any, string>,
		"disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
	>;
	placeholder?: string;
	feedback?: boolean;
	autoComplete?: string;
	toggleMask?: boolean;
	header?: React.ReactNode;
	footer?: React.ReactNode;
}

export const FormPasswordInput = ({
	control,
	name,
	label,
	rules,
	placeholder,
	feedback = false,
	autoComplete = "current-password",
	toggleMask = true,
	header,
	footer,
}: FormPasswordInputProps) => {
	return (
		<div>
			<label htmlFor={name} className="block mb-2">
				{label}
			</label>
			<Controller
				name={name}
				control={control}
				rules={rules}
				render={({ field, fieldState }) => (
					<>
						<div className="p-inputgroup w-full">
							<Password
								inputId={name}
								autoComplete={autoComplete}
								placeholder={placeholder}
								aria-describedby={`${name}-error`}
								aria-invalid={!!fieldState.error}
								className={classNames(
									{
										"p-invalid": fieldState.error,
									},
									"w-full"
								)}
								inputClassName="w-full"
								toggleMask={toggleMask}
								feedback={feedback}
								promptLabel="Digite uma senha"
								weakLabel="Fraca"
								mediumLabel="Média"
								strongLabel="Forte"
								strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$"
								mediumRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{2,}$"
								header={header}
								footer={footer}
								{...field}
							/>
							<span className="p-inputgroup-addon">
								<i
									className="pi pi-lock"
									aria-hidden="true"
								></i>
							</span>
						</div>
						{fieldState.error && (
							<small
								id={`${name}-error`}
								className="p-error block mt-1"
							>
								{fieldState.error.message}
							</small>
						)}
					</>
				)}
			/>
		</div>
	);
};
