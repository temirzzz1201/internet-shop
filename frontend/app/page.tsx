import { fetchProducts, fetchCategories } from '@/actions/serverActions';
import ProductCard from '@/components/product-card';
import CategoryMenu from '@/components/category-menu';
import { IIProduct, ICategory } from '@/types';
import { Grid, Text, Box } from '@chakra-ui/react';

interface HomeProps {
  searchParams: {
    category?: string;
  };
}

const Home = async ({ searchParams }: HomeProps) => {
  const products: IIProduct[] = await fetchProducts();
  const categories: ICategory[] = await fetchCategories();

  const categoryId = searchParams.category;

  const filteredProducts = categoryId
    ? products.filter(product => {

      return product.categoryId?.toString() === categoryId;
    })
    : products;


  return (
    <div className="container min-h-screen">

      <section className='px-3'>
        <Text className="mb-8" color="blue.600" fontSize="4xl">
          Все продукты: {filteredProducts.length}
        </Text>
      </section>
      <section className='flex p-3'>
        <Box mr='5'>
          <CategoryMenu categories={categories} />
        </Box>
        <div >

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
      </section>
    </div>
  );
};

export default Home;
