import { PrimaryButton } from "@/components/Buttons/PrimaryButton";
import { useNavigate } from "react-router-dom";
import './orders-not-found.style.css';

export const OrdersNotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="orders-not-found">
            <h2>Nenhum pedido encontrado.</h2>
            <img src="./assets/images/common/no_data.svg" alt="Nennuma informação encontrada" />
            <PrimaryButton label="Ver produtos" onClick={() => navigate('/home#products')} />
        </div>
    );
};
