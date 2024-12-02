import { fetchAllProducts, fetchCategories } from '@/actions/serverActions';
import CategoryMenu from '@/components/category-menu';
import Pagination from '@/components/pagination';
import { ICategory } from '@/types';
import { Box } from '@chakra-ui/react';
import AppContainer from '@/components/app-container';
import ClientProducts from '@/components/client-products';

export interface IHomeProps {
  searchParams: {
    page?: string;
    category?: string;
  };
}

const ITEMS_PER_PAGE = 30;

const Home = async ({ searchParams }: IHomeProps) => {
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  const categoryId = searchParams.category;

  const productsResponse = await fetchAllProducts({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });
  const categories: ICategory[] = await fetchCategories();

  const { products, totalPages } = productsResponse;

  return (
    <>
      <AppContainer myClass="justify-start">
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
          {/* Передаем категорию в клиентский компонент */}
          <ClientProducts products={products} selectedCategory={categoryId} />
        </Box>
      </AppContainer>
      <Box as="section" mb="80px">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </Box>
    </>
  );
};

export default Home;
