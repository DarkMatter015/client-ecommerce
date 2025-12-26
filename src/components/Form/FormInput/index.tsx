import {
	Controller,
	type Control,
	type RegisterOptions,
} from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";

interface FormInputProps {
	control: Control<any>;
	name: string;
	label: string;
	rules?: Omit<
		RegisterOptions<any, string>,
		"disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
	>;
	icon?: string;
	type?: string;
	placeholder?: string;
	mask?: string;
	autoComplete?: string;
}

export const FormInput = ({
	control,
	name,
	label,
	rules,
	icon,
	type = "text",
	placeholder,
	mask,
	autoComplete,
}: FormInputProps) => {
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
						<div className="p-inputgroup">
							{mask ? (
								<InputMask
									id={name}
									type={type}
									mask={mask}
									autoComplete={autoComplete}
									placeholder={placeholder}
									aria-describedby={`${name}-error`}
									aria-invalid={!!fieldState.error}
									className={classNames({
										"p-invalid": fieldState.error,
									})}
									{...field}
								/>
							) : (
								<InputText
									id={name}
									type={type}
									autoComplete={autoComplete}
									placeholder={placeholder}
									aria-describedby={`${name}-error`}
									aria-invalid={!!fieldState.error}
									className={classNames({
										"p-invalid": fieldState.error,
									})}
									{...field}
								/>
							)}
							{icon && (
								<span className="p-inputgroup-addon">
									<i
										className={`pi ${icon}`}
										aria-hidden="true"
									></i>
								</span>
							)}
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
