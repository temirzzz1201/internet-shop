'use client';
import { useRouter } from 'next/navigation';
import { ICategoryMenuProps } from '@/types';
import { UnorderedList, ListItem, Box } from '@chakra-ui/react';

const CategoryMenu: React.FC<ICategoryMenuProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string | null) => {
    router.push(`/?category=${categoryId ? categoryId : ''}`);
  };

  return (
    <Box maxW='md' borderWidth='1px' borderRadius='lg' overflow='hidden' as='aside' px={4} maxH={320} >
      <aside>
        <UnorderedList>
          <ListItem onClick={() => handleCategoryClick(null)} style={{ cursor: 'pointer', margin: '5px 0' }}>Все товары</ListItem>
          {categories.map((cat) => (
            <ListItem key={cat.id} onClick={() => handleCategoryClick(cat.id)} style={{ cursor: 'pointer', margin: '5px 0' }}>
              {cat.name}
            </ListItem>
          ))}
        </UnorderedList>
      </aside>
    </Box>
  );
};

export default CategoryMenu;
