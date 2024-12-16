'use client';
import { useRouter } from 'next/navigation';
import { ICategoryMenuProps } from '@/types';
import { UnorderedList, ListItem, Box, Heading } from '@chakra-ui/react';
import { capitalize } from '@/utils/capitalize';

const CategoryMenu: React.FC<ICategoryMenuProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string | null) => {
    router.push(`/?category=${categoryId ? categoryId : ''}`);
  };

  return (
    <Box as="aside" className="bg-white border rounded-lg" shadow="md">
      <Heading className="mt-4 ml-4" size="md">
        Каталог
      </Heading>
      <UnorderedList
        className="w-[100%] overflow-hidden list-none"
        px={4}
        listStyleType="none"
        ml="0"
      >
        <ListItem
          onClick={() => handleCategoryClick(null)}
          className="flex cursor-pointer mx-0 my-5 text-black hover:text-blue-800 hover:underline transition-all duration-300"
        >
          Все товары
        </ListItem>
        {categories.map((cat) => (
          <ListItem
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="flex cursor-pointer mx-0 my-5 text-black hover:text-blue-800 hover:underline transition-all duration-300"
          >
            {capitalize(cat.name)}
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default CategoryMenu;
