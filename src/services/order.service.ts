import type {
	IAddress,
	IItem,
	IOrderResponse,
	IPage,
	IPayment,
} from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/ServiceUtils";

const ROUTE = "/orders";

const mapApiToOrder = (order: any): IOrderResponse => {
	return {
		id: order.id,
		payment: order.payment,
		address: order.address,
		orderItems: order.orderItems,
		shipment: order.shipment,
		status: order.status,
	};
};

export const getOrders = async (
	page = 0,
	size = 10
): Promise<IPage<IOrderResponse>> => {
	const { data } = await api.get(`${ROUTE}/page?page=${page}&size=${size}`);
	return normalizePage(data, mapApiToOrder);
};

export const getOrderById = async (id: string): Promise<IOrderResponse> => {
	const { data } = await api.get(`${ROUTE}/${id}`);
	return data;
};

export const createOrder = async (
	cartItems: IItem[],
	selectedAddress: IAddress,
	paymentMethod: IPayment,
	shipmentId: number
) => {
	const { data } = await api.post(ROUTE, {
		orderItems: cartItems.map((item) => ({
			productId: item.product.id,
			quantity: item.quantity,
		})),
		address: selectedAddress,
		paymentId: paymentMethod.id,
		shipmentId: shipmentId,
	});
	return data;
};
