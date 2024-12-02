'use client';
import { useRouter } from 'next/navigation';
import { ICategoryMenuProps } from '@/types';
import { UnorderedList, ListItem } from '@chakra-ui/react';
import { capitalize } from '@/utils/capitalize';

const CategoryMenu: React.FC<ICategoryMenuProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string | null) => {
    router.push(`/?category=${categoryId ? categoryId : ''}`);
  };

  return (
    <UnorderedList
      w="100%"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      as="aside"
      px={4}
      listStyleType="none"
      ml="0"
    >
      <ListItem
        onClick={() => handleCategoryClick(null)}
        className="flex cursor-pointer mx-0 my-5"
      >
        Все товары
      </ListItem>
      {categories.map((cat) => (
        <ListItem
          key={cat.id}
          onClick={() => handleCategoryClick(cat.id)}
          className="flex cursor-pointer mx-0 my-5"
        >
          {capitalize(cat.name)}
        </ListItem>
      ))}
    </UnorderedList>
  );
};

export default CategoryMenu;
