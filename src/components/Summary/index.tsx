import { formatCurrency, getItemCountText } from "@/utils/Utils";
import { Button } from "primereact/button";
import type React from "react";
import "./summary.style.css";
import { CalcFreight } from "../Freight/CalcFreight";
import { useCart } from "@/context/hooks/use-cart";

export const Summary: React.FC<{
	title?: string;
	primaryButtonLabel?: string;
	secondaryButtonLabel?: string;
	handleNext?: () => void | undefined;
	handleGoBack?: () => void;
	selectedAddress?: any;
	actionButtonsDisabled?: boolean;
	freightDisable?: boolean;
	disabledNext?: boolean;
}> = ({
	title = "Resumo do Pedido",
	primaryButtonLabel = "Avançar",
	secondaryButtonLabel = "Voltar",
	handleNext,
	handleGoBack,
	selectedAddress,
	actionButtonsDisabled = false,
	freightDisable = false,
	disabledNext = false,
}) => {
	const { cartMetrics, cartItems, freight } = useCart();
	return (
		<aside className="summary">
			<div className="summary-sticky">
				<section
					className="checkout-card"
					aria-labelledby="summary-heading"
				>
					<h3 id="summary-heading">{title}</h3>
					<div className="summary-line">
						<span>
							Subtotal (
							{getItemCountText(cartMetrics?.totalItems || 0)})
						</span>
					</div>
					<div className="summary-line">
						{!freightDisable &&
							cartMetrics &&
							cartMetrics?.totalItems > 0 && (
								<div className="summary-line">
									<CalcFreight
										cep={selectedAddress?.cep}
										setCep={() => {}}
										produtos={cartItems || []}
									/>
								</div>
							)}
						{freight && (
							<div className="summary-line">
								<span>Frete</span>
								<span className="total-value">
									R$ {formatCurrency(freight?.price || 0)}
								</span>
							</div>
						)}
					</div>
					<div className="summary-divider" role="separator"></div>
					<div className="summary-total">
						<span>Total</span>
						<span className="total-value">
							R${" "}
							{formatCurrency(
								(cartMetrics?.total || 0) +
									(cartMetrics?.freightValue || 0)
							)}
						</span>
					</div>

					{!actionButtonsDisabled && (
						<>
							<Button
								severity="success"
								icon="pi pi-arrow-right"
								iconPos="right"
								label={primaryButtonLabel}
								className="btn-default btn-place-order w-full"
								onClick={handleNext}
								aria-label={primaryButtonLabel}
								disabled={disabledNext}
							/>

							<Button
								outlined
								icon="pi pi-arrow-left"
								label={secondaryButtonLabel}
								className="btn-gray w-full mt-2"
								onClick={handleGoBack}
								aria-label={secondaryButtonLabel}
							/>
						</>
					)}
				</section>
			</div>
		</aside>
	);
};
