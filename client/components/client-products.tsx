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

  // Фильтруем товары по поисковому запросу и категории
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.categoryId?.toString() === selectedCategory
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategory]);

  return (
    <Box flex="1">
      <Box maxW="350px" mb={4}>
        <Input
          placeholder="Поиск товаров"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>
      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
          xl: 'repeat(5, 1fr)',
        }}
        gap={{ base: 6, md: 3 }}
        alignItems="stretch"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: IIProduct) => (
            <ProductCard product={product} key={product.id} />
          ))
        ) : (
          <p>Продукты отсутствуют!</p>
        )}
      </Grid>
    </Box>
  );
};

export default ClientProducts;
