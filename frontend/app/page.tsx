import { fetchAllProducts, fetchCategories } from '@/actions/serverActions';
import ProductCard from '@/components/product-card';
import CategoryMenu from '@/components/category-menu';
import { IIProduct, ICategory } from '@/types';
import { Grid, Box } from '@chakra-ui/react';
import { IHomeProps } from '@/types';
import AppContainer from '@/components/app-container';

const Home = async ({ searchParams }: IHomeProps) => {
  const products: IIProduct[] = await fetchAllProducts();
  const categories: ICategory[] = await fetchCategories();

  const categoryId = searchParams.category;

  const filteredProducts = categoryId
    ? products.filter((product) => {
        return product.categoryId?.toString() === categoryId;
      })
    : products;

  return (
    <AppContainer
      title={`Все продукты ${products.length}`}
      myClass="justify-start"
    >
      <Box as="aside" mr="80px">
        <CategoryMenu categories={categories} />
      </Box>
      <Box as="main" mb="20">
        <Grid templateColumns="repeat(5, 1fr)" gap={6}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product: IIProduct) => (
              <ProductCard product={product} key={product.id} />
            ))
          ) : (
            <p>Продукты отсутствуют!</p>
          )}
        </Grid>
      </Box>
    </AppContainer>
  );
};

export default Home;
