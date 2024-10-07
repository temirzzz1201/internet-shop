'use client';
import { useRouter } from 'next/navigation';
import { ICategiry } from '@/types';
import { UnorderedList, ListItem } from '@chakra-ui/react';


interface CategoryMenuProps {
  categories: ICategiry[];
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories }) => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string | null) => {
    router.push(`/?category=${categoryId ? categoryId : ''}`);
  };

  return (
    <aside className='px-4 border'>
      <nav>
        <UnorderedList styleType="'-'">
          <ListItem onClick={() => handleCategoryClick(null)} style={{ cursor: 'pointer', margin: '5px 0' }}>All products</ListItem>
          {categories.map((cat) => (
            <ListItem key={cat.id} onClick={() => handleCategoryClick(cat.id)} style={{ cursor: 'pointer', margin: '5px 0' }}>
              {cat.categoryName}
            </ListItem>
          ))}
        </UnorderedList>
      </nav>
    </aside>

  );
};

export default CategoryMenu;
