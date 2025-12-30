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
	disabled,
	maxLength,
	children,
	minValue,
	maxValue,
}: FormInputProps & {
	disabled?: boolean;
	maxLength?: number;
	children?: React.ReactNode;
	minValue?: number;
	maxValue?: number;
}) => {
	return (
		<div className="form-group">
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
									min={minValue}
									max={maxValue}
									mask={mask}
									autoComplete={autoComplete}
									placeholder={placeholder}
									disabled={disabled}
									maxLength={maxLength}
									aria-describedby={`${name}-error`}
									aria-invalid={!!fieldState.error}
									className={classNames("w-full", {
										"i-invalid":
											fieldState.error ||
											fieldState.invalid,
										"i-valid":
											!fieldState.error &&
											!fieldState.invalid &&
											field.value?.length > 0,
									})}
									{...field}
								/>
							) : (
								<InputText
									id={name}
									type={type}
									min={minValue}
									max={maxValue}
									autoComplete={autoComplete}
									placeholder={placeholder}
									disabled={disabled}
									maxLength={maxLength}
									aria-describedby={`${name}-error`}
									aria-invalid={!!fieldState.error}
									className={classNames("w-full", {
										"i-invalid":
											fieldState.error ||
											fieldState.invalid,
										"i-valid":
											!fieldState.error &&
											!fieldState.invalid &&
											field.value?.length > 0,
									})}
									onInput={(
										e: React.FormEvent<HTMLInputElement>
									) => {
										if (type === "number"){
										if (
											maxLength &&
											e.currentTarget.value.length >
												maxLength
										) {
											e.currentTarget.value =
												e.currentTarget.value.slice(
													0,
													maxLength
												);
										}
										if (
											minValue &&
											e.currentTarget.valueAsNumber < minValue
										) {
											e.currentTarget.value = minValue.toString();
										}
									}
									}}
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
							{children}
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
