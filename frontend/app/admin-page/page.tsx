'use client';
import { getUsers, placeProduct, placeCategory, getCategory, getProducts } from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Select,
  FormHelperText,
} from '@chakra-ui/react';
import { AdminTable } from '@/components/admin-table';

export default function Admin() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { category } = useAppSelector((state) => state.category);
  const { products, isLoading } = useAppSelector((state) => state.products);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  // const [file, setFile] = useState<File | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  
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
      price,
      stock,
      images: files, 
    };

    dispatch(placeProduct(productData)); 
  };


  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = { categoryName };
    dispatch(placeCategory(categoryData));
  };

  const memoizedUsers = useMemo(() => {
    return users;
  }, [users]);

  const memoizedProducts = useMemo(() => {
    return products;
  }, [products]);
  
  const memoizedCategory = useMemo(() => {
    return category;
  }, [category]);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const productColumns = [
    { label: 'Name', key: 'name' },
    { label: 'Description', key: 'description' },
    { label: 'Price', key: 'price' },
    { label: 'Stock', key: 'stock' },
    { label: 'Image', key: 'imageUrl' },
    { label: 'Created At', key: 'createdAt', format: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A') },
    { label: 'Updated At', key: 'updatedAt', format: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A') },
  ];

  const userColumns = [
    { label: 'Username', key: 'username' },
    { label: 'Email', key: 'email' },
    { label: 'Password', key: 'password' },
    { label: 'Created At', key: 'createdAt', format: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A') },
    { label: 'Updated At', key: 'updatedAt', format: (value: string) => (value ? new Date(value).toLocaleString() : 'N/A') },
    { label: 'Role', key: 'role' },
  ];

  return (
    <>
      <section className="p-3 flex mb-10">
        <Text color="blue.600" fontSize="2xl">
          Admin page
        </Text>
      </section>

      <div className="p-5">
        <Tabs isLazy>
          <TabList>
            <Tab>PRODUCTS</Tab>
            <Tab>USERS</Tab>
          </TabList>
          <TabPanels className="mt-10">
            <TabPanel>
              <div className="container min-h-screen">
                <FormControl className="max-w-[500px]">
                  <FormLabel>Upload new category</FormLabel>
                  <Input
                    placeholder="Category name"
                    size="md"
                    className="mb-2"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                  <Button mt={4} colorScheme="teal" type="submit" onClick={handleSubmitCategory}>
                    Submit
                  </Button>
                </FormControl>

                <section className="p-3 flex flex-col justify-center items-center">
                  <FormControl className="max-w-[500px]">
                    <FormLabel>Upload new product</FormLabel>
                    <Select placeholder="Choose category" onChange={(e) => setCategoryId(Number(e.target.value))}>
                      {memoizedCategory?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                    <Input
                      placeholder="Product name"
                      size="md"
                      className="mb-2"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                      placeholder="Product description"
                      size="md"
                      className="mb-2"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <Input
                      placeholder="Product price"
                      size="md"
                      className="mb-2"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                    <Input
                      placeholder="Stock quantity"
                      size="md"
                      className="mb-2"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                    />
                    <Input className="mb-4" size="md" type="file" multiple onChange={handleFileChange} />
                    {/* <MultipleImageUploader /> */}
                    <Button mt={4} colorScheme="teal" type="submit" onClick={handleSubmitProduct}>
                      Submit
                    </Button>

                    <FormHelperText>We will never share your email.</FormHelperText>
                  </FormControl>
                </section>
              </div>

              <AdminTable caption="List of products" columns={productColumns} data={memoizedProducts} isLoading={isLoading} deleteFlag="products/delete-product" updateFlag="products/update-product" />
            </TabPanel>

            <TabPanel>
              <AdminTable caption="List of users" columns={userColumns} data={memoizedUsers} isLoading={isLoading} deleteFlag="users/delete-user" updateFlag="users/update-user" />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}
