import type { IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import type React from "react";

import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import "./product-actions.style.css";
import { AlertProduct } from "@/components/AlertProduct";

export const ProductActions: React.FC<{
	product: IProduct;
	quantity: number;
}> = ({ product, quantity }) => {
	const { handleBuyProduct, handleAddToCart } = useProduct();
	const [stock, setStock] = useState<number>(
		product?.quantityAvailableInStock
	);

	useEffect(() => {
		setStock(product?.quantityAvailableInStock);
	}, [product]);

	const getButtons = () => {
		if (stock == 0) {
			return <AlertProduct product={product} />;
		} else {
			return (
				<>
					<Button
						className="w-full button-action"
						severity="success"
						onClick={() => handleBuyProduct(product, quantity)}
						aria-label="Comprar agora"
						icon="pi pi-shopping-bag"
					>
						Comprar
					</Button>
					<Button
						className="w-full button-action"
						severity="info"
						outlined
						onClick={() => handleAddToCart(product, quantity)}
						aria-label="Adicionar ao carrinho"
						icon="pi pi-cart-plus"
					>
						Adicionar ao Carrinho
					</Button>
					<AlertProduct
						product={product}
					/>
				</>
			);
		}
	};

	return <div className="product-actions">{getButtons()}</div>;
};
