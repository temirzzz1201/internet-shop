import { fetchAllProducts, fetchCategories } from '@/actions/serverActions';
import ProductCard from '@/components/product-card';
import CategoryMenu from '@/components/category-menu';
import { IIProduct, ICategory } from '@/types';
import { Grid, Text, Box } from '@chakra-ui/react';
import { IHomeProps } from '@/types';

const Home = async ({ searchParams }: IHomeProps) => {
  const products: IIProduct[] = await fetchAllProducts();
  const categories: ICategory[] = await fetchCategories();

  const categoryId = searchParams.category;

  const filteredProducts = categoryId
    ? products.filter(product => {
        return product.categoryId?.toString() === categoryId;
      })
    : products;

  return (
    <div className="container min-h-screen">
      <Box as='section'>
        <Text className="mb-8" color="blue.600" fontSize="4xl">
          Все продукты: {filteredProducts.length}
        </Text>
      </Box>
      <Box as='section' className='flex'>
        <Box mr='5'>
          <CategoryMenu categories={categories} />
        </Box>
        <div>
          <Grid templateColumns="repeat(5, 1fr)" gap={6}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: IIProduct) => (
                <ProductCard product={product} key={product.id} />
              ))
            ) : (
              <p>Продукты отсутствуют!</p>
            )}
          </Grid>
        </div>
      </Box>
    </div>
  );
};

export default Home;
