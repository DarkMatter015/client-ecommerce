import { useState, useEffect } from "react";
import { getProductsFiltered } from "@/services/product-service";
import type { IProduct } from "@/commons/types/types";

interface ProductGroup {
    label: string;
    items: IProduct[];
}

export const useProductSearch = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductGroup[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    let searchTimeout: number | undefined;

    const search = (event: any) => {
        window.clearTimeout(searchTimeout);
        const query = event.query || "";
        searchTimeout = window.setTimeout(async () => {
            const q = query.trim();
            try {
                let filtered: IProduct[] = [];
                if (!q.length) {
                    filtered = [...products];
                } else {
                    const response = await getProductsFiltered(0, 20, q, undefined);
                    filtered = response.content || [];
                }

                // group by category
                const groups: ProductGroup[] = [];
                const map = new Map<string, IProduct[]>();
                filtered.forEach((p) => {
                    const cat = p.category?.name ?? "Outros";
                    if (!map.has(cat)) map.set(cat, []);
                    map.get(cat)!.push(p);
                });
                for (const [label, items] of map.entries()) {
                    groups.push({ label, items });
                }

                setFilteredProducts(groups);
            } catch (err) {
                console.error("Erro ao buscar produtos filtrados", err);
                setFilteredProducts([]);
            }
        }, 250);
    };

    useEffect(() => {
        setProducts([]);
    }, []);

    return {
        products,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        search,
    };
};
