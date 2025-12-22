import type { IProduct } from "@/commons/types/types";
import { formatCurrency } from "@/utils/Utils";
import { InputNumber } from "primereact/inputnumber";
import type React from "react";

import "./product-info.style.css";
import { Tag } from "primereact/tag";
import { useProduct } from "@/hooks/useProduct";

export const ProductInfo: React.FC<{
    product: IProduct,
    pricePerUnit: number,
    quantity: number,
    setQuantity: (quantity: number) => void
}> = ({
    product,
    pricePerUnit,
    quantity,
    setQuantity
}) => {
    const { validateStock } = useProduct();
    const stock = validateStock(product.quantityAvailableInStock);
    const productStock = product.quantityAvailableInStock;

    const getSeverity = () => {
        if (stock == "Esgotado") {
            return "danger";
        } else if (stock == "Últimas Unidades") {
            return "warning";
        }
    };

    const getValueTag = () => {
        if (stock) {
            return stock + ": " + productStock;
        } else {
            return "Disponível: " + productStock;
        }
    };

        return (
            <>
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <Tag value={getValueTag()} severity={getSeverity()}></Tag>
                    <p className="mb-0"><i>{product.name} - {product.category.name}</i></p>
                    <div className="mb-2 product-rating">
                        <span className="rating" aria-hidden>★★★★★</span>
                        <span className="avaliations"> +500 avaliações</span>
                    </div>
                    <p>Código Nº: {product.id}</p>
                </div>

                <div className="product-price-section">
                    <div className="product-price">
                        <span className="price-value">R$ {formatCurrency(pricePerUnit)}</span>
                    </div>
                </div>

                {stock == "Esgotado" ? null : (
                <div className="mb-3 container-input">
                    <label htmlFor="quantity" className="form-label"><strong>Quantidade</strong></label>
                    <InputNumber
                        inputId='quantity'
                        value={quantity}
                        onValueChange={(e) => setQuantity(e.value ?? 1)}
                        showButtons
                        inputClassName="w-6rem"
                        min={1}
                        max={productStock}
                        aria-label="Quantidade"
                    />
                </div>
                )}
            </>
        );
    };