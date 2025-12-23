import { Button } from "primereact/button";
import type { Stepper } from "primereact/stepper";
import type React from "react";
import type { RefObject } from "react";

export const NavigatorLinearButtons: React.FC<{
	stepperRef: RefObject<Stepper | null>;
	prev?: boolean;
    disablePrev?: boolean;
	next?: boolean;
    disableNext?: boolean;
}> = ({ stepperRef, prev = true, next = true, disablePrev = false, disableNext = false }) => {
	return (
		<div className="flex pt-4">
			{prev && (
				<Button
					label="Voltar"
					severity="secondary"
					icon="pi pi-arrow-left"
					onClick={() => stepperRef?.current?.prevCallback()}
					className="mr-auto"
                    disabled={disablePrev}
				/>
			)}
			{next && (
				<Button
					label="Continuar"
					icon="pi pi-arrow-right"
					iconPos="right"
					onClick={() => stepperRef?.current?.nextCallback()}
					className="ml-auto"
                    disabled={disableNext}
				/>
			)}
		</div>
	);
};
