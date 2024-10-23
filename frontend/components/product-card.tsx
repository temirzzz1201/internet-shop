'use client'; 

import { IProductCardProps } from '@/types';
import {
  Box,
  Badge,
  Heading,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import formatDate from '@/utils/dateHelper';
import AppModal from './app-modal';
import { EmblaOptionsType } from 'embla-carousel';
import { capitalize } from '@/utils/capitalize';

// Динамический импорт карусели без SSR
const EmblaCarousel = dynamic(() => import('./carousel/embla-carousel'), { ssr: false });

const OPTIONS: EmblaOptionsType = { loop: true };

export default function ProductCard({ product }: IProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { images } = product;

  const imageUrls = images.map(image => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  console.log(product);

  return (
    <Box>
      <AppModal isOpen={isModalOpen} onClose={handleClose} title={product.category.name}>
        <EmblaCarousel slides={imageUrls} options={OPTIONS} autoPlayFlag imageClass='340' />
      </AppModal>

      <Box maxW='140px' minW='140' p={4} bg="gray.200"  borderRadius={10} as="article">
        <Box cursor="pointer" mb='3'>
          <EmblaCarousel slides={imageUrls} options={OPTIONS} handleOpen={handleOpen} />
        </Box>
        <Heading noOfLines={1} size="l" fontWeight="bold"> {capitalize(product.name)} </Heading> 
        <Badge my='1' borderRadius='full' px='2' colorScheme='teal'> {product.stock} </Badge>
        <Text fontSize='md' noOfLines={1}> {capitalize(product.description)} </Text>
        <Text fontWeight="bold"> {product.price}{" "} руб. </Text>
        <Text fontSize='xs'> {formatDate(product.createdAt)} </Text>
      </Box>  
    </Box>
  );
}
