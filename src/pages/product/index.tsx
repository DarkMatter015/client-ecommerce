import { useMemo, useEffect, useState } from "react";
import "./product.style.css";
import { useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types/types";
import { ProductDescription } from "@/components/Product/ProductDescription";
import { ContainerProductInformations } from "@/components/Product/ContainerProductInformations";
import { ContainerProductImage } from "@/components/Product/ContainerProductImage";
import { getProductById } from "@/services/product.service";

const ProductPage = () => {
	const params = useParams();
	const idParam = params.id;
	const [produto, setProduto] = useState<IProduct>({} as IProduct);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [quantity, setQuantity] = useState<number>(1);
	const [cep, setCep] = useState<string>("");

	const pricePerUnit = useMemo(() => produto.price, [produto.price]);

	useEffect(() => {
		const fetchProduct = async () => {
			if (!idParam) {
				setError("ID do produto não encontrado na URL");
				setLoading(false);
				return;
			}

			try {
				const response = await getProductById(idParam);
				if (response) {
					setProduto(response);
				} else {
					setError("Produto não encontrado.");
				}
			} catch (err) {
				setError(
					"Erro ao carregar produto. Por favor, tente novamente mais tarde."
				);
				console.error("Erro ao buscar produto:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [idParam]);

	if (loading) return <div className="loading">Carregando produto ...</div>;
	if (error) return <div className="error">{error}</div>;

	return (
		<>
			<div className="container">
				<div className="grid">
					<ContainerProductImage produto={produto} />

					<ContainerProductInformations
						produto={produto}
						pricePerUnit={pricePerUnit}
						quantity={quantity}
						setQuantity={setQuantity}
						cep={cep}
						setCep={setCep}
					/>

					<ProductDescription product={produto} />
				</div>
			</div>
		</>
	);
};

export default ProductPage;
