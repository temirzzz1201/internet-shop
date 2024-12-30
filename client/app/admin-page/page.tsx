'use client';
import {
  getUsers,
  placeProduct,
  placeCategory,
  getProducts,
  getCategory,
} from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  Divider,
  Heading,
} from '@chakra-ui/react';
import AdminTable from '@/components/admin-table';
import AppContainer from '@/components/app-container';
import { getGreetingByTime } from '@/utils/dateHelper';
import { capitalize } from '@/utils/capitalize';
import Cookies from 'js-cookie';

export default function Admin() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { category } = useAppSelector((state) => state.category);
  const { products, isLoading } = useAppSelector((state) => state.products);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState(0);
  const [categoryName, setCategoryName] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [userName, setUserName] = useState('');


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      categoryId,
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      images: files,
    };

    if(!name || !description || !price || !stock || !files.length) return

    dispatch(placeProduct(productData));
    setName('');
    setCategoryId(0);
    setDescription('');
    setPrice('');
    setStock('');
    setFiles([]);
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = { categoryName };
    if(!categoryName) return
    dispatch(placeCategory(categoryData));
  };

  const memoizedUsers = useMemo(() => {
    return users;
  }, [users]);

  const memoizedProducts = useMemo(() => {
    // @ts-ignore: should type products
    return products.products;
  }, [products]);

  const memoizedCategory = useMemo(() => {
    return category;
  }, [category]);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    const name = Cookies.get('user');
    if (name) {
      const userNameFromCookie = JSON.parse(name);
      setUserName(capitalize(userNameFromCookie.username));
    }
  }, []);

  const productColumns = [
    { label: 'Название', key: 'name' },
    { label: 'Описание', key: 'description' },
    { label: 'Цена', key: 'price' },
    { label: 'Остатки', key: 'stock' },
    {
      label: 'Создано',
      key: 'createdAt',
      format: (value: string) =>
        value ? new Date(value).toLocaleString() : 'N/A',
    },
    {
      label: 'Обновлено',
      key: 'updatedAt',
      format: (value: string) =>
        value ? new Date(value).toLocaleString() : 'N/A',
    },
  ];

  const userColumns = [
    { label: 'Имя', key: 'username' },
    { label: 'Эл.почта', key: 'email' },
    { label: 'Пароль', key: 'password' },
    {
      label: 'Создано',
      key: 'createdAt',
      format: (value: string) =>
        value ? new Date(value).toLocaleString() : 'N/A',
    },
    {
      label: 'Обновлено',
      key: 'updatedAt',
      format: (value: string) =>
        value ? new Date(value).toLocaleString() : 'N/A',
    },
    { label: 'Роль пользователя', key: 'role' },
  ];

  return (
    <AppContainer
      title={` ${getGreetingByTime()}, ${userName} `}
      myClass="justify-start"
    >
      <Tabs isLazy>
        <TabList>
          <Tab>Продукты</Tab>
          <Tab>Пользователи</Tab>
        </TabList>
        <TabPanels className="mt-10">
          <TabPanel>
            <FormControl className="max-w-[500px] mb-3">
              <Heading size="md" mb="5">
                Создать категорию
              </Heading>
              <Input
                placeholder="Название категории"
                size="md"
                className="mb-2"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmitCategory}
                disabled={!categoryName}
              >
                Создать
              </Button>
            </FormControl>

            <Divider my="10" />

            <FormControl className="max-w-[500px]">
              <Heading size="md" mb="5">
                Создать продукт
              </Heading>
              <FormLabel fontSize="12">Выбрать категорию</FormLabel>
              <Select
                mb="2"
                placeholder="Выбрать категорию"
                onChange={(e) => setCategoryId(Number(e.target.value))}
              >
                {memoizedCategory?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
              <FormLabel fontSize="12">Название продукта</FormLabel>
              <Input
                placeholder="Название продукта"
                size="md"
                className="mb-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FormLabel fontSize="12">Описание продукта</FormLabel>
              <Input
                placeholder="Описание продукта"
                size="md"
                className="mb-2"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormLabel fontSize="12">Цена</FormLabel>
              <Input
                placeholder="Цена"
                size="md"
                className="mb-2"
                min={0}
                type="number"
                value={price === 0 ? '' : price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <FormLabel fontSize="12">Остатки</FormLabel>
              <Input
                placeholder="Остатки"
                size="md"
                className="mb-2"
                type="number"
                value={stock === 0 ? '' : stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
              <FormLabel fontSize="12">
                Загрузить изображения (до 5ти штук)
              </FormLabel>
              <Input
                className="mb-4"
                size="md"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                onClick={handleSubmitProduct}
                disabled={!name || !description || !price || !stock || !files.length}
              >
                Создать
              </Button>
            </FormControl>

            <Divider my="10" />

            <AdminTable
              caption="List of products"
              columns={productColumns}
              data={memoizedProducts}
              isLoading={isLoading}
              deleteFlag="products/delete-product"
              updateFlag="products/update-product"
            />
          </TabPanel>

          <TabPanel>
            <AdminTable
              caption="List of users"
              columns={userColumns}
              data={memoizedUsers}
              isLoading={isLoading}
              deleteFlag="users/delete-user"
              updateFlag="users/update-user"
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </AppContainer>
  );
}
