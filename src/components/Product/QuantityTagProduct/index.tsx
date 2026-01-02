import type { IProduct } from "@/commons/types/types";
import { useProduct } from "@/hooks/useProduct";
import { Tag } from "primereact/tag";

interface QuantityTagProductProps {
	product: IProduct;
}

export const QuantityTagProduct = ({ product }: QuantityTagProductProps) => {
	const { validateStock } = useProduct();
	const stock = validateStock(product.quantityAvailableInStock);
	const productStock = product.quantityAvailableInStock;

	const getSeverity = () => {
		if (stock == "Esgotado") {
			return "danger";
		} else if (stock == "Últimas Unidades") {
			return "warning";
		} else {
			return "success";
		}
	};

	const getValueTag = () => {
		if (stock == "Esgotado") {
			return stock;
		} else if (stock) {
			return stock + ": " + productStock;
		} else {
			return "Disponível" + ": " + productStock;
		}
	};
	return <Tag value={getValueTag()} severity={getSeverity()} />;
};
