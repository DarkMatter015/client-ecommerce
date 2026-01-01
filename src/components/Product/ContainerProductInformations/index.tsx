import { CalcFreight } from "@/components/Freight/CalcFreight";
import { ProductInfo } from "../ProductInfo";
import { ProductActions } from "../ProductActions";
import type { IProduct } from "@/commons/types/types";

interface ContainerProductInformationsProps {
	produto: IProduct;
	pricePerUnit: number;
	quantity: number;
	setQuantity: React.Dispatch<React.SetStateAction<number>>;
	cep: string;
	setCep: React.Dispatch<React.SetStateAction<string>>;
}

export const ContainerProductInformations = ({
	produto,
	pricePerUnit,
	quantity,
	setQuantity,
	cep,
	setCep,
}: ContainerProductInformationsProps) => {
	return (
		<div className="col-12 lg:col-7 mt-0">
			<ProductInfo
				pricePerUnit={pricePerUnit}
				quantity={quantity}
				setQuantity={setQuantity}
				product={produto}
			/>

			<CalcFreight
				cep={cep}
				setCep={setCep}
				produtos={[{ product: produto, quantity: quantity }]}
				selectedFreightDisabled
			/>

			<ProductActions product={produto} quantity={quantity} />
		</div>
	);
};
