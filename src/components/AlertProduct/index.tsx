import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { EmailForm } from "../EmailForm";
import { useState } from "react";
import type { IProduct } from "@/commons/types/types";

interface AlertProductProps {
	product: IProduct;
	buttonLabel?: string;
}

export const AlertProduct = ({ product, buttonLabel ="Avise-me" }: AlertProductProps) => {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<Button
				className="w-full button-action"
				severity="help"
				onClick={() => setVisible(true)}
				aria-label={buttonLabel}
				icon="pi pi-bell"
				label={buttonLabel}
			/>
			<Dialog
				className="dialog-email-form"
				visible={visible}
				modal
				closable
				closeOnEscape
				draggable={false}
				resizable={false}
				content={<EmailForm hide={() => setVisible(false)} product={product} />}
				onHide={() => {
					if (!visible) return;
					setVisible(false);
				}}
			/>
		</>
	);
};
