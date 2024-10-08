'use client';

import { getUsers, placeProduct, placeCategory, getCategory } from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useEffect, useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Select
} from '@chakra-ui/react';

export default function Admin() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);
  const { category } = useAppSelector((state) => state.category);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(1);
  const [categoryName, setCategoryName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      categoryId,
      name,
      description,
      price,
      stock,
      image: file,
    };

    dispatch(placeProduct(productData));
  };

  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = { categoryName };
    dispatch(placeCategory(categoryData));
  };

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

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

                  <Button
                    mt={4}
                    colorScheme="teal"
                    type="submit"
                    onClick={handleSubmitCategory}
                  >
                    Submit
                  </Button>
                </FormControl>

                <section className="p-3 flex flex-col justify-center items-center">
                  <FormControl className="max-w-[500px]">
                    <FormLabel>Upload new product</FormLabel>
                    <Select
                      placeholder="Choose category"
                      onChange={(e) => setCategoryId(Number(e.target.value))}
                    >
                      {category?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.categoryName}
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
                    <Input
                      className="mb-4"
                      size="md"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <Button
                      mt={4}
                      colorScheme="teal"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>

                    <FormHelperText>We will never share your email.</FormHelperText>
                  </FormControl>
                </section>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="container min-h-screen">
                <TableContainer>
                  <Table variant="striped" size="sm" colorScheme="teal">
                    <TableCaption>List of users</TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Username</Th>
                        <Th>Email</Th>
                        <Th>Password</Th>
                        <Th>Created At</Th>
                        <Th>Updated At</Th>
                        <Th>Role</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users?.map((user) => (
                        <Tr key={user.id}>
                          <Td>{user.username}</Td>
                          <Td>{user.email}</Td>
                          <Td>{user.password}</Td>
                          <Td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}</Td>
                          <Td>{user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}</Td>
                          <Td>{user.role || 'N/A'}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>
    </>
  );
}
