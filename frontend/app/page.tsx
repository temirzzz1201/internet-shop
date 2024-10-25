import { fetchAllProducts, fetchCategories } from '@/actions/serverActions';
import ProductCard from '@/components/product-card';
import CategoryMenu from '@/components/category-menu';
import Pagination from '@/components/pagination';
import { IIProduct, ICategory } from '@/types';
import { Grid, Box } from '@chakra-ui/react';
import AppContainer from '@/components/app-container';

interface IHomeProps {
  searchParams: {
    page?: string;
    category?: string;
  };
}

const ITEMS_PER_PAGE = 30;

const Home = async ({ searchParams }: IHomeProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const productsResponse = await fetchAllProducts({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const categories: ICategory[] = await fetchCategories();

  const { products, totalPages } = productsResponse;
  const categoryId = searchParams.category;

  const filteredProducts = categoryId
    ? products.filter(
        (product: IIProduct) => product.categoryId?.toString() === categoryId
      )
    : products;

  return (
    <>
      <AppContainer
        title={`Все продукты ${filteredProducts.length}`}
        myClass="justify-start"
      >
        <Box
          display={{ base: 'flex', md: 'flex' }}
          flexDirection={{ base: 'column', md: 'row' }}
          w="100%"
        >
          <Box
            as="aside"
            mb={{ base: '20px', md: '20px' }}
            w={{ base: '100%', md: '240px' }}
            mr={{ base: '0', md: '60px', lg: '100px' }}
          >
            <CategoryMenu categories={categories} />
          </Box>
          <Box as="main" mb="20" flex="1">
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(5, 1fr)',
              }}
              gap={{ base: 6, md: 3 }}
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
        </Box>
      </AppContainer>
      <Box mb="80px">
        {/* {products.length > 0 ? <Pagination currentPage={currentPage} totalPages={totalPages} /> : null} */}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Box>
    </>
  );
};

export default Home;
