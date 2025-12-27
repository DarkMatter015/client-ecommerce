import { PASSWORD_CRITERIA } from "@/utils/FormUtils";
import { classNames } from "primereact/utils";
import { type Control, useWatch } from "react-hook-form";
import "./password-footer.style.css";

interface PasswordFooterProps {
	control: Control<any>;
	name: string;
}

export const PasswordFooter = ({ control, name }: PasswordFooterProps) => {
	const passwordValue = useWatch({
		control,
		name,
		defaultValue: "",
	});

	return (
		<div className="password-criteria-container mt-2">
			{PASSWORD_CRITERIA.map((criteria, index) => {
				const isValid = criteria.regex.test(passwordValue || "");
				return (
					<div
						key={index}
						className={`criteria-item ${
							isValid ? "valid" : "invalid"
						}`}
					>
						<i
							className={classNames("pi", {
								"pi-check-circle": isValid,
								"pi-times-circle": !isValid,
							})}
							aria-hidden="true"
						></i>
						<span>{criteria.label}</span>
					</div>
				);
			})}
		</div>
	);
};
