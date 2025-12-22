import type { IProduct } from "@/commons/types/types";
import { Button } from "primereact/button";
import type React from "react";

import "./product-actions.style.css";
import { useProduct } from "@/hooks/useProduct";
import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { EmailForm } from "@/components/EmailForm";

export const ProductActions: React.FC<{
	product: IProduct;
	quantity: number;
}> = ({ product, quantity }) => {
	const { handleBuyProduct, handleAddToCart } = useProduct();
	const [stock, setStock] = useState<number>(
		product?.quantityAvailableInStock
	);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		setStock(product?.quantityAvailableInStock);
	}, [product]);

	const getButtons = () => {
		if (stock == 0) {
			return (
				<>
					<Button
						className="w-full button-action"
						severity="help"
						onClick={() => setVisible(true)}
						aria-label="Me avise quando estiver disponível"
						icon="pi pi-bell"
					>
						Me avise quando estiver disponível
					</Button>
					<Dialog
						visible={visible}
						modal
						onHide={() => {
							if (!visible) return;
							setVisible(false);
						}}
						content={({ hide }) => (
							<EmailForm hide={hide} product={product} />
						)}
					/>
				</>
			);
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
				</>
			);
		}
	};

	return <div className="product-actions">{getButtons()}</div>;
};
