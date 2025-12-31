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
import { AddressDialog } from "@/components/Address/RegisterAddressDialog";
import { AddressList } from "@/components/Address/AddressList";
import { OrderConfirmation } from "@/components/Checkout/OrderConfirmation";
import { CalcFreight } from "@/components/Freight/CalcFreight";

const CheckoutPage: React.FC = () => {
	const { cartItems, freight, cleanCart } = useCart();

	const [payments, setPayments] = useState<IPayment[]>([]);
	const [paymentMethod, setPaymentMethod] = useState<IPayment | null>(null);

	const [addresses, setAddresses] = useState<IAddress[]>([]);
	const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(
		null
	);

	const [showAddressDialog, setShowAddressDialog] = useState(false);
	const [newAddress, setNewAddress] = useState<Partial<IAddress>>({
		street: "",
		number: "",
		complement: undefined,
		neighborhood: "",
		city: "",
		state: "",
		cep: "",
	});
	const [savingAddress, setSavingAddress] = useState(false);

	const navigate = useNavigate();
	const { showToast } = useToast();
	const [paymentSuccess, setPaymentSuccess] = useState(false);

	useEffect(() => {
		if (paymentSuccess) return;

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

			setPaymentSuccess(true);
			cleanCart();

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

	const handleFinalize = async () => {
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

		await handlePlaceOrder();
	};

	const handleAddAddress = async (formData: IAddress) => {
		try {
			setSavingAddress(true);
			const response = await createAddress(formData);
			if (response) {
				setAddresses([...addresses, response]);
				setSelectedAddress(response);
				setShowAddressDialog(false);
				setNewAddress({
					street: "",
					number: "",
					complement: undefined,
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
					<div className="step1-container">
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
					<div className="step1-container">
						<div className="step2-container">
							<div style={{ marginBottom: "1rem" }}>
								<Button
									label="Adicionar Novo Endereço"
									icon="pi pi-plus"
									onClick={() => setShowAddressDialog(true)}
									className="p-button-outlined"
									style={{ width: "100%" }}
								/>
							</div>

							<AddressDialog
								showAddressDialog={showAddressDialog}
								handleAddressDialogHide={
									handleAddressDialogHide
								}
								address={newAddress}
								handleSaveAddress={handleAddAddress}
								savingAddress={savingAddress}
							/>

							<AddressList
								addresses={addresses}
								onSelectAddress={setSelectedAddress}
								selectedAddress={selectedAddress}
							/>

							<CalcFreight
								produtos={cartItems || []}
								cep={selectedAddress?.cep}
								inputDisabled={true}
							/>
						</div>
						<Summary
							title="Escolha o Endereço e Frete"
							freightDisable={true}
							handleNext={() =>
								stepperRef?.current?.nextCallback()
							}
							handleGoBack={() =>
								stepperRef?.current?.prevCallback()
							}
							disabledNext={
								selectedAddress && freight ? false : true
							}
						/>
					</div>
				</StepperPanel>
				<StepperPanel header="Pagamento">
					<div className="step1-container">
						<CheckoutPaymentMethod
							payments={payments}
							paymentMethod={paymentMethod}
							setPaymentMethod={setPaymentMethod}
						/>
						<Summary
							title="Escolha o Método de Pagamento"
							freightDisable={true}
							handleNext={() =>
								stepperRef?.current?.nextCallback()
							}
							handleGoBack={() =>
								stepperRef?.current?.prevCallback()
							}
							disabledNext={paymentMethod ? false : true}
						/>
					</div>
				</StepperPanel>
				<StepperPanel header="Confirmação">
					<div>
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
				</StepperPanel>
			</Stepper>
		</div>
	);
};

export default CheckoutPage;
