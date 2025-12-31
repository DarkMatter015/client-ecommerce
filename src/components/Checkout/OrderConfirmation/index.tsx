import type {
	IAddress,
	IFreightResponse,
	IItem,
	IPayment,
} from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import { ItemCartCheckout } from "../ItemCartCheckout";
import type React from "react";

interface OrderConfirmationProps {
	cartItems: IItem[];
	selectedAddress: IAddress | null;
	paymentMethod: IPayment | null;
	freight: IFreightResponse | null;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
	cartItems,
	selectedAddress,
	paymentMethod,
	freight,
}) => {
	return (
		<div className="flex flex-column gap-0 lg:gap-3">
			<section
				className="checkout-card"
				aria-labelledby="confirmation-items-heading"
			>
				<h3
					id="confirmation-items-heading"
					className="flex align-items-center gap-2"
				>
					<i className="pi pi-shopping-bag" />
					Itens do Pedido
				</h3>
				<div className="order-item-list">
					{cartItems?.map((item) => (
						<ItemCartCheckout key={item.id} item={item} />
					))}
				</div>
			</section>

			<div className="grid">
				<div className="col-12 md:col-6">
					<section
						className="checkout-card h-full"
						aria-labelledby="confirmation-shipping-heading"
					>
						<h3
							id="confirmation-shipping-heading"
							className="flex align-items-center gap-2 text-xl font-medium mb-3"
						>
							<i className="pi pi-map-marker text-primary" />
							Entrega
						</h3>
						{selectedAddress ? (
							<div className="flex flex-column gap-3">
								<div className="address-details p-3 border-1 surface-border border-round surface-50">
									<div className="flex align-items-start gap-2 mb-2">
										<i className="pi pi-home mt-1 text-500"></i>
										<div>
											<p className="font-bold text-900 m-0">
												{selectedAddress.street},{" "}
												{selectedAddress.number}
											</p>
											{selectedAddress.complement && (
												<p className="text-600 text-sm m-0 mt-1">
													{selectedAddress.complement}
												</p>
											)}
											<p className="text-600 text-sm m-0 mt-1">
												{selectedAddress.neighborhood} -{" "}
												{selectedAddress.city}/
												{selectedAddress.state}
											</p>
											<p className="text-600 text-sm m-0 mt-1">
												CEP: {selectedAddress.cep}
											</p>
										</div>
									</div>
								</div>

								{freight && (
									<div className="freight-details p-3 border-1 surface-border border-round surface-50 flex align-items-center justify-content-between">
										<div className="flex align-items-center gap-3">
											{freight.company.picture ? (
												<img
													src={
														freight.company.picture
													}
													alt={freight.company.name}
													style={{
														height: "30px",
														width: "30px",
														objectFit: "contain",
													}}
													className="border-circle bg-white p-1 shadow-1"
												/>
											) : (
												<i className="pi pi-box text-xl text-500"></i>
											)}
											<div className="flex flex-column">
												<span className="font-medium text-900">
													{freight.name}
												</span>
												<span className="text-sm text-600">
													{freight.delivery_time} dias
													úteis
												</span>
											</div>
										</div>
										<span className="font-bold text-primary text-lg">
											R$ {formatCurrency(freight.price)}
										</span>
									</div>
								)}
							</div>
						) : (
							<p className="text-red-500">
								Endereço não selecionado
							</p>
						)}
					</section>
				</div>

				<div className="col-12 md:col-6">
					<section
						className="checkout-card h-full"
						aria-labelledby="confirmation-payment-heading"
					>
						<h3
							id="confirmation-payment-heading"
							className="flex align-items-center gap-2 text-xl font-medium mb-3"
						>
							<i className="pi pi-credit-card text-primary" />
							Pagamento
						</h3>
						{paymentMethod ? (
							<div className="flex align-items-center gap-3 p-3 border-1 surface-border border-round surface-50">
								<i className="pi pi-check-circle text-green-500 text-2xl" />
								<span className="text-lg font-medium text-900">
									{paymentMethod.name}
								</span>
							</div>
						) : (
							<p className="text-red-500">
								Método de pagamento não selecionado
							</p>
						)}
					</section>
				</div>
			</div>
		</div>
	);
};
