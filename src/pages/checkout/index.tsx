import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkout.style.css";
import { getAllPaymentsPageable } from "@/services/payment-service";
import type { IAddress, IPayment } from "@/commons/types/types";
import {
	createAddress,
	getAllAddressesPageable,
} from "@/services/address-service";
import { postOrder } from "@/services/order-service";
import { useCart } from "@/context/hooks/use-cart";
import { useToast } from "@/context/hooks/use-toast";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { CheckoutOrderItems } from "@/components/Checkout/CheckoutorderItems";
import { Summary } from "@/components/Summary";
import { CheckoutPaymentMethod } from "@/components/Checkout/CheckoutPaymentMethod";
import { RegisterAddressDialog } from "@/components/Address/RegisterAddressDialog";
import { AddressList } from "@/components/Address/AddressList";
import { NavigatorLinearButtons } from "@/components/Checkout/NavigatorLinearButtons";
import { OrderConfirmation } from "@/components/Checkout/OrderConfirmation";

const CheckoutPage: React.FC = () => {
	const { cartItems, freight } = useCart();

	const [payments, setPayments] = useState<IPayment[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<null>(null);

	const [addresses, setAddresses] = useState<IAddress[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(
		null
	);

	const [showAddressDialog, setShowAddressDialog] = useState(false);
	const [newAddress, setNewAddress] = useState<Partial<IAddress>>({
		street: "",
		number: undefined,
		complement: "",
		neighborhood: "",
		city: "",
		state: "",
		cep: "",
	});
	const [savingAddress, setSavingAddress] = useState(false);

	const navigate = useNavigate();
	const { showToast } = useToast();

	useEffect(() => {
		if (!cartItems || cartItems.length === 0) {
			navigate("/carrinho");
			return;
		}

		const fetchPayments = async () => {
			try {
				const response = await getAllPaymentsPageable(0, 10);
				if (response) {
					setPayments(response.content);
				}
			} catch (err) {
				console.error("Erro ao buscar pagamentos:", err);
			}
		};

		const fetchAddress = async () => {
			try {
				const response = await getAllAddressesPageable(0, 10);
				if (response) {
					setAddresses(response.content);
				}
			} catch (err) {
				console.error("Erro ao buscar endereços:", err);
			}
		};

		fetchPayments();
		fetchAddress();
	}, [cartItems, navigate, setAddresses]);

	const handlePlaceOrder = async () => {
		try {
			const response = await postOrder(
				cartItems,
				selectedAddress,
				paymentMethod,
				freight?.id || null
			);

			if (response?.status != 201) {
				throw new Error(response?.status.toString());
			}

			console.log("Pedido realizado:", {
				cartItems,
				selectedAddress,
				paymentMethod,
			});

			showToast(
				"success",
				`Pedido ${response?.data.id} Realizado com sucesso!`,
				"Você será redirecionado para a página de pedidos ...",
				3000
			);

			setTimeout(() => {
				navigate("/pedidos");
			}, 2000);
		} catch (error: any) {
			const message =
				error?.response?.data?.message ??
				error?.message ??
				"Erro desconhecido";
			showToast("error", "Erro ao realizar o pedido", message);
			console.error("Erro ao realizar o pedido:", error);
		}
	};

	const handleGoBack = () => {
		navigate("/carrinho");
	};

	const handleFinalize = () => {
		if (!selectedAddress) {
			showToast(
				"warn",
				"Endereço Necessário",
				"Por favor, adicione um endereço de entrega."
			);
			return;
		}
		if (!paymentMethod) {
			showToast(
				"warn",
				"Método de Pagamento Necessário",
				"Por favor, selecione um método de pagamento."
			);
			return;
		}
		if (!freight) {
			showToast(
				"warn",
				"Frete Necessário",
				"Por favor, selecione um frete."
			);
			return;
		}

		handlePlaceOrder();
	};

	const handleAddAddress = async () => {
		if (
			!newAddress.street ||
			!newAddress.number ||
			!newAddress.city ||
			!newAddress.state ||
			!newAddress.cep
		) {
			showToast(
				"warn",
				"Campos Obrigatórios",
				"Preencha todos os campos obrigatórios."
			);
			return;
		}

		try {
			setSavingAddress(true);
			const response = await createAddress(newAddress as IAddress);
			if (response) {
				setAddresses([...addresses, response]);
				setSelectedAddress(response);
				setShowAddressDialog(false);
				setNewAddress({
					street: "",
					number: undefined,
					complement: "",
					neighborhood: "",
					city: "",
					state: "",
					cep: "",
				});
				showToast(
					"success",
					"Endereço Adicionado",
					"Endereço adicionado com sucesso!"
				);
			}
		} catch (error) {
			console.error("Erro ao adicionar endereço:", error);
			showToast(
				"error",
				"Erro",
				"Erro ao adicionar o endereço. Tente novamente.",
				3000
			);
		} finally {
			setSavingAddress(false);
		}
	};

	const handleAddressDialogHide = () => {
		setShowAddressDialog(false);
		setNewAddress({
			street: "",
			number: undefined,
			complement: "",
			neighborhood: "",
			city: "",
			state: "",
			cep: "",
		});
	};

	const stepperRef = useRef<Stepper>(null);

	const scrollToStep = (step: number) => {
		const steps = document.getElementsByClassName("p-stepper-header");
		const activeStep = steps[step];
		activeStep.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<div className="checkout-page">
			<Stepper
				onChangeStep={(step) => scrollToStep(step.index)}
				ref={stepperRef}
				style={{ flexBasis: "50rem" }}
				linear
				className="mx-3"
			>
				<StepperPanel header="Seus Itens">
					<div className="lg:flex block justify-content-between gap-3 rounded">
						<CheckoutOrderItems cartItems={cartItems} />
						<Summary
							handleNext={() =>
								stepperRef?.current?.nextCallback()
							}
							handleGoBack={handleGoBack}
							selectedAddress={selectedAddress}
							freightDisable={true}
						/>
					</div>
				</StepperPanel>
				<StepperPanel header="Entrega">
					<div className="">
						<div className="">
							<div className="p-col-12 p-md-6">
								<div style={{ marginBottom: "1rem" }}>
									<Button
										label="Adicionar Novo Endereço"
										icon="pi pi-plus"
										onClick={() =>
											setShowAddressDialog(true)
										}
										className="p-button-outlined"
										style={{ width: "100%" }}
									/>
								</div>

								<RegisterAddressDialog
									showAddressDialog={showAddressDialog}
									handleAddressDialogHide={
										handleAddressDialogHide
									}
									newAddress={newAddress}
									setNewAddress={setNewAddress}
									handleAddAddress={handleAddAddress}
									savingAddress={savingAddress}
								/>

								<AddressList
									addresses={addresses}
									onSelectAddress={setSelectedAddress}
									selectedAddress={selectedAddress}
								/>
							</div>
							<Summary
								title="Escolha o Frete"
								selectedAddress={selectedAddress}
								actionButtonsDisabled={true}
							/>
						</div>
					</div>
					<NavigatorLinearButtons
						stepperRef={stepperRef}
						disableNext={selectedAddress && freight ? false : true}
					/>
				</StepperPanel>
				<StepperPanel header="Pagamento">
					<div className="">
						<div className="">
							<CheckoutPaymentMethod
								payments={payments}
								paymentMethod={paymentMethod}
								setPaymentMethod={setPaymentMethod}
							/>
							<Summary
								actionButtonsDisabled={true}
								freightDisable={true}
							/>
						</div>
					</div>
					<NavigatorLinearButtons
						stepperRef={stepperRef}
						disableNext={paymentMethod ? false : true}
					/>
				</StepperPanel>
				<StepperPanel header="Confirmação">
					<div className="">
						<div className="">
							<OrderConfirmation
								cartItems={cartItems || []}
								selectedAddress={selectedAddress}
								paymentMethod={paymentMethod}
								freight={freight}
							/>
							<div className="mt-4 w-full">
								<Summary
									primaryButtonLabel="Finalizar Pedido"
									title="Total do Pedido"
									secondaryButtonLabel="Voltar"
									handleNext={handleFinalize}
									handleGoBack={() =>
										stepperRef?.current?.prevCallback()
									}
									selectedAddress={selectedAddress}
									freightDisable={true}
									actionButtonsDisabled={false}
								/>
							</div>
						</div>
					</div>
				</StepperPanel>
			</Stepper>
		</div>
	);
};

export default CheckoutPage;
