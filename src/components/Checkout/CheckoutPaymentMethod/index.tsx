import type { IPayment } from "@/commons/types/types";
import type React from "react";
import "./checkout-payment-method.style.css";

export const CheckoutPaymentMethod: React.FC<{
	payments: IPayment[] | [];
	paymentMethod: IPayment | null;
	setPaymentMethod: any;
}> = ({ payments, paymentMethod, setPaymentMethod }) => {
	return (
		<section className="payment-card">
			<h4>
				<i className="pi pi-credit-card" aria-hidden="true"></i>{" "}
				Pagamento
			</h4>
			<select
				className="payment-select"
				value={paymentMethod?.id}
				onChange={(e) =>
					setPaymentMethod(
						payments?.find(
							(method) => String(method.id) === e.target.value
						)
					)
				}
				aria-label="Selecione o método de pagamento"
			>
				<option value="" disabled selected>
					Selecione o método de pagamento
				</option>
				{payments.map((method) => (
					<option key={method.id} value={method.id}>
						{method.name}
					</option>
				))}
			</select>
		</section>
	);
};
