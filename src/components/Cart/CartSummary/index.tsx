import { CalcFreight } from "@/components/Freight/CalcFreight";
import { useCart } from "@/context/hooks/use-cart";
import { formatCurrency, getItemCountText } from "@/utils/Utils";
import { Button } from "primereact/button";
import type React from "react";
import "./cart-summary.style.css";

export const CartSummary: React.FC<{
    onFinalize: () => void;
}> = ({ onFinalize }) => {
    const { cartItems, cartMetrics } = useCart();

    return (
        <aside className="cart-summary" aria-label="Resumo da compra">            
            <div className="cart-summary-sticky">
                <section className="summary-card">
                    <h3>Resumo da Compra</h3>
                    <div className="summary-line">
                        <span>
                            Total (
                            {getItemCountText(cartMetrics?.totalItems || 0)})
                        </span>
                    </div>

                    {cartMetrics && cartMetrics?.totalItems > 0 && (
                        <div className="summary-line">
                            <CalcFreight
                                produtos={cartItems || []}
                                selectedFreightDisabled={true}
                            />
                        </div>
                    )}
                    <div className="summary-divider" role="separator"></div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span className="total-value">
                            R$ {formatCurrency((cartMetrics?.total || 0) + (cartMetrics?.freightValue || 0))}
                        </span>
                    </div>
                </section>

                <Button
                    severity="success"
                    raised
                    icon="pi pi-check"
                    label="Finalizar Compra"
                    className="btn-default btn-finalize w-full"
                    onClick={onFinalize}
                    disabled={cartMetrics?.totalItems === 0}
                    aria-label="Finalizar compra"
                />
            </div>
        </aside>
    );
};
