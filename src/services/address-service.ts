import type { IAddress } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/ServiceUtils";

const ROUTE = "/addresses";

const mapToAddress = (item: any): IAddress => {
	return {
		id: item.id,
		street: item.street,
		number: item.number,
		complement: item.complement || undefined,
		neighborhood: item.neighborhood,
		city: item.city,
		state: item.state,
		cep: item.cep,
		active: item.active,
	};
};

export const getAddresses = async (
	page = 0,
	size = 10
): Promise<IPage<IAddress>> => {
	const { data } = await api.get<IPage<any>>(`${ROUTE}/page`, {
		params: { page, size },
	});
	return normalizePage(data, mapToAddress);
};

export const getAddressById = async (
	id: string | number
): Promise<IAddress> => {
	const { data } = await api.get(`${ROUTE}/${id}`);
	return mapToAddress(data);
};

export const createAddress = async (
	address: Partial<IAddress>
): Promise<IAddress> => {
	const { data } = await api.post(ROUTE, address);
	return mapToAddress(data);
};

export const updateAddress = async (
	address: Partial<IAddress>
): Promise<IAddress> => {
	if (!address.id) throw new Error("ID é obrigatório para atualização");
	const { data } = await api.patch(`${ROUTE}/${address.id}`, address);
	return mapToAddress(data);
};

export const deleteAddress = async (id: number): Promise<void> => {
	await api.delete(`${ROUTE}/${id}`);
};

export const activateAddress = async (id: number): Promise<IAddress> => {
	const { data } = await api.post(`${ROUTE}/activate/${id}`);
	return mapToAddress(data);
};

export const inactivateAddress = async (id: number): Promise<void> => {
	await api.delete(`${ROUTE}/inactivate/${id}`);
};
