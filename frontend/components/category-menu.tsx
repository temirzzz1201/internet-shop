'use client';
import { useRouter } from 'next/navigation';
import { ICategoryMenuProps } from '@/types';
import { UnorderedList, ListItem, Box } from '@chakra-ui/react';
import { capitalize } from '@/utils/capitalize';

const CategoryMenu: React.FC<ICategoryMenuProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string | null) => {
    router.push(`/?category=${categoryId ? categoryId : ''}`);
  };

  return (
    <UnorderedList 
      // maxW="md"
      w='100%'
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      as="aside"
      px={4}
      listStyleType='none'
      ml='0'
    >
      <ListItem
        onClick={() => handleCategoryClick(null)}
        style={{ cursor: 'pointer', margin: '5px 0' }}
      >
        Все товары
      </ListItem>
      {categories.map((cat) => (
        <ListItem
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          style={{ cursor: 'pointer', margin: '5px 0' }}
        >
          {capitalize(cat.name)}
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default CategoryMenu;
