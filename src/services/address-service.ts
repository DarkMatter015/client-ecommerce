import type { IAddress, IResponse } from "@/commons/types/types";
import type { IPage } from "@/commons/types/types";
import { api } from "@/lib/axios";
import { normalizePage } from "@/utils/Utils";

const route = "/addresses";

type ApiAddress = Record<string, any>;

const mapApiToAddress = (item: ApiAddress): IAddress => {
  return {
    id: item.id ?? item.ID ?? 0,
    street: item.street ?? "",
    number: item.number ?? "",
    complement: item.complement ?? undefined,
    neighborhood: item.neighborhood ?? "",
    city: item.city ?? "",
    state: item.state ?? "",
    cep: item.cep ?? "",
    active: item.active ?? undefined,
  };
};

export const getAllAddressesPageable = async (
  page = 0,
  size = 10
): Promise<IPage<IAddress> | null> => {
  try {
    const response = await api.get(`${route}/page?page=${page}&size=${size}`);
    return normalizePage(response.data, page, size, mapApiToAddress);
  } catch (err) {
    console.error(`Erro ao buscar todos os endereços na rota ${route}`, err);
    return null;
  }
};

export const getAddressById = async (id: string): Promise<IAddress | null> => {
  try {
    const response = await api.get(`${route}/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      `Erro ao buscar o endereço com ${id} na rota ${route}/${id}`,
      err
    );
    return null;
  }
};

export const createAddress = async (
  address: Partial<IAddress>
): Promise<IAddress | null> => {
  try {
    const response = await api.post(route, address);
    return mapApiToAddress(response.data);
  } catch (err) {
    console.error(`Erro ao criar o endereço na rota ${route}`, err);
    return null;
  }
};

export const updateAddress = async (
  address: Partial<IAddress>
): Promise<IAddress | null> => {
  try {
    const response = await api.patch(`${route}/${address.id}`, address);
    return mapApiToAddress(response.data);
  } catch (err) {
    console.error(`Erro ao atualizar o endereço na rota ${route}/${address.id}`, err);
    return null;
  }
};

export const deleteAddress = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`${route}/${id}`);
    return true;
  } catch (err) {
    console.error(`Erro ao deletar o endereço na rota ${route}/${id}`, err);
    return false;
  }
};

export const activeAddress = async (id: number): Promise<IAddress | IResponse> => {
  try {
    const response = await api.post(`${route}/activate/${id}`);
    return mapApiToAddress(response.data);
  } catch (err) {
    console.error(`Erro ao ativar o endereço na rota ${route}/${id}`, err);
    const error = err as IResponse;
    return error;
  }
};
