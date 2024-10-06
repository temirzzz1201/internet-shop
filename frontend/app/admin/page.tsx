'use client';

import { placeProduct } from '@/actions/clientActions';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useState } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';

export default function Admin() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name,
      description,
      price,
      stock,
      image: file,
    };
    dispatch(placeProduct(productData));
  };

  return (
    <div className="container min-h-screen">
      <section className="p-3 flex mb-10">
        <Text color="blue.600" fontSize="2xl">
          Admin page
        </Text>
      </section>
      <section className="p-3 flex flex-col justify-center items-center">
        <FormControl className="max-w-[500px]">
          <FormLabel>Download new product</FormLabel>
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
            placeholder="Is product in stock"
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
  );
}
