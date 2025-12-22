import type { IProduct } from "@/commons/types/types";
import { useCart } from "@/context/hooks/use-cart";
import { useToast } from "@/context/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useProduct() {

    const { addItem, cartItems } = useCart();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const validateStockCartProduct = (product: IProduct, quantity: number) => {
        const cartProduct = cartItems?.find(item => item.product.id == product.id);

        if (product.quantityAvailableInStock == 0) {
            showToast("error", "Erro", `Produto ${product.name} esgotado.`);
            return false;
        }

        if (cartProduct) {
            if (cartProduct.quantity == product.quantityAvailableInStock) {
                showToast("warn", "Aviso", "Quantidade máxima desse produto atingida no carrinho.");
                return false;
            }
            if ((cartProduct.quantity + quantity) > product.quantityAvailableInStock) {
                showToast("warn", "Aviso", `Não é possível adicionar mais unidades desse produto ao carrinho. Unidades restantes: ${product.quantityAvailableInStock - cartProduct.quantity}`);
                return false;
            }
        }
        if (quantity > product.quantityAvailableInStock) {
            showToast("warn", "Aviso", `Quantidade maior que disponível. Unidades restantes: ${product.quantityAvailableInStock}`);
            return false;
        }
        return true;
    }
    
    const handleBuyProduct = (produto: IProduct, quantity: number) => {
        if (!validateStockCartProduct(produto, quantity)) {
            return;
        }
        addItem({product: produto, quantity: quantity}, false);
        navigate("/carrinho");
    }

    const handleAddToCart = (produto: IProduct, quantity: number) => {
        if (!validateStockCartProduct(produto, quantity)) {
            return;
        }
        addItem({product: produto, quantity: quantity});
    }

    const validateStock = (stock: number) => {
        if (stock == 0) {
            return "Esgotado";
        } else if (stock <= 5) {
            return "Últimas Unidades";
        }
    };

    return {
        handleBuyProduct,
        handleAddToCart,
        validateStock,
        validateStockCartProduct
    };
}