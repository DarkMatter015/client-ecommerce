import type { IResponse } from "@/commons/types/types";

import { api } from "@/lib/axios";

export const validateCep = async (cep: string): Promise<IResponse> => {
	cep = cep.replace(/[^0-9]/g, "");
	const data = await api.get(`/cep/validate/${cep}`);
	return data;
};
