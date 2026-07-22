import React from 'react';
import ProductCard from './ProductCard';
import Spinner from '../Feedback/Spinner';
import EmptyState from '../Feedback/EmptyState';
import { PackageSearch } from 'lucide-react';

export default function ProductGrid({ products, loading, emptyMessage }) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Spinner size="large" />
        <p className="text-brand-brown text-sm mt-3 font-medium">Curating lovely handcrafted pieces...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={PackageSearch}
          title="No Products Found"
          description={emptyMessage || "We couldn't find any products matching your current filters or search terms. Try clearing filters or searching for something else!"}
          actionText="Clear Search & Filters"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
