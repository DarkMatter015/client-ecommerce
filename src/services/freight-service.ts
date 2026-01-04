import type { IFreightRequest, IResponse } from "@/commons/types/types";

import { api } from "@/lib/axios";

export const calculateFreightByProducts = async (
	freight: IFreightRequest
): Promise<IResponse> => {
	const { data } = await api.post(`/shipment/products`, {
		...freight,
	});
	return data;
};
