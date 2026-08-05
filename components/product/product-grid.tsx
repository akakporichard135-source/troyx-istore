import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

export function ProductGrid({
  products,
  compact = false
}: {
  products: Product[];
  compact?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 min-[520px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} />
      ))}
    </div>
  );
}
