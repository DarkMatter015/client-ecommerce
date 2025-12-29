import { createContext, useRef, type ReactNode } from "react";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";

interface ToastContextType {
	showToast: (
		severity: string | undefined,
		summary: string,
		detail: string,
		life?: number
	) => void;
	showConfirmToast: (
		severity: string | undefined,
		summary: string,
		detail: string,
		onConfirm: () => void
	) => void;
}

interface ToastProviderProps {
	children: ReactNode;
}

const ToastContext = createContext({} as ToastContextType);

export function ToastProvider({ children }: ToastProviderProps) {
	const toast = useRef<Toast | null>(null);
	const clear = () => {
		toast.current?.clear();
	};

	const confirm = (onConfirm: () => void) => {
		toast.current?.clear();
		onConfirm();
	};

	const showToast = (
		severity: string | undefined,
		summary: string,
		detail: string,
		life?: number
	) => {
		toast.current?.show({
			severity: severity as
				| "success"
				| "info"
				| "warn"
				| "error"
				| "secondary"
				| "contrast"
				| undefined,
			summary: summary,
			detail: detail,
			life: life || 3000,
		});
	};

	const showConfirmToast = (
		severity: string | undefined,
		summary: string,
		detail: string,
		onConfirm: () => void,
		life?: number
	) => {
		const getIcon = () => {
			switch (severity) {
				case "success":
					return "pi-check";
				case "info":
					return "pi-info-circle";
				case "warn":
					return "pi-exclamation-triangle";
				case "error":
					return "pi-times";
				default:
					return "pi-info-circle";
			}
		};

		toast.current?.show({
			severity: severity as
				| "success"
				| "info"
				| "warn"
				| "error"
				| "secondary"
				| "contrast"
				| undefined,
			summary: summary,
			detail: detail,
			life: life || 5000,
			content: (
				<div className="flex align-items-start" style={{ flex: "1" }}>
					<span
						className={`p-toast-message-icon pi ${getIcon()}`}
					></span>
					<div className="p-toast-message-text">
						<span className="p-toast-summary">{summary}</span>
						<div className="p-toast-detail">{detail}</div>
						<div className="flex gap-2 mt-2">
							<Button
								className="p-button-sm flex"
								label="Confirmar"
								severity="success"
								onClick={() => confirm(onConfirm)}
							/>
							<Button
								className="p-button-sm p-button-outlined"
								label="Cancelar"
								severity="danger"
								onClick={clear}
							/>
						</div>
					</div>
				</div>
			),
		});
	};

	return (
		<ToastContext
			value={{
				showToast,
				showConfirmToast,
			}}
		>
			{children}
			<Toast ref={toast} />
		</ToastContext>
	);
}

export { ToastContext };
