'use client';
import { Box, Input, Grid } from '@chakra-ui/react';
import ProductCard from './product-card';
import { IIProduct } from '@/types';
import { useState, useMemo } from 'react';

interface ClientProductsProps {
  products: IIProduct[];
  selectedCategory?: string;
}

const ClientProducts: React.FC<ClientProductsProps> = ({
  products,
  selectedCategory,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const queryLower = query.toLowerCase();
      const matchesQuery =
        product.name.toLowerCase().includes(queryLower) ||
        product.description?.toLowerCase().includes(queryLower) ||
        product.price.toString().includes(queryLower) ||
        product.stock.toString().includes(queryLower);
      const matchesCategory = selectedCategory
        ? product.categoryId?.toString() === selectedCategory
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategory]);

  return (
    <Box flex="1">
      <Box maxW={{ base: '100%', md: '350px' }} mb={4}>
        <Input
          className="outline-none"
          placeholder="Поиск товаров"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(5, 1fr)',
        }}
        gap={{ base: 1, md: 3 }}
        alignItems="stretch"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: IIProduct) => (
            <ProductCard product={product} key={product.id} query={query} />
          ))
        ) : (
          <p>Продукты отсутствуют!</p>
        )}
      </Grid>
    </Box>
  );
};

export default ClientProducts;
