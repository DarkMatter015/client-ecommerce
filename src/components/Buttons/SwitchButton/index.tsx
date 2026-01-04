import { ToggleButton } from "primereact/togglebutton";
import "./switch-button.style.css";

export const SwitchButton = ({
	checked,
	setChecked,
}: {
	checked: boolean;
	setChecked: (checked: boolean) => void;
}) => {
	return (
		<ToggleButton
			onLabel="Ativo"
			offLabel="Inativo"
			onIcon="pi pi-check"
			offIcon="pi pi-times"
			checked={checked}
			onChange={(e) => setChecked(e.value)}
			className={
				checked ? "switch-button active" : "switch-button inactive"
			}
			aria-label="Ativar/Desativar"
		/>
	);
};
