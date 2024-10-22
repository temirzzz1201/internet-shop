'use client'; 

import { IProductCardProps } from '@/types';
import {
  AspectRatio,
  Box,
  Badge,
} from '@chakra-ui/react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import formatDate from '@/utils/dateHelper';
import AppModal from './app-modal';
import { EmblaOptionsType } from 'embla-carousel';

// Динамический импорт карусели без SSR
const EmblaCarousel = dynamic(() => import('./carousel/embla-carousel'), { ssr: false });

const OPTIONS: EmblaOptionsType = { loop: true };

export default function ProductCard({ product }: IProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const { images } = product;

  const imageUrls = images.map(image => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`);

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <Box maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <AppModal isOpen={isModalOpen} onClose={handleClose} title="Product Carousel">
        <EmblaCarousel slides={imageUrls} options={OPTIONS} />
      </AppModal>

      <AspectRatio maxW='480px' ratio={4 / 6} onClick={handleOpen} cursor="pointer">
        <EmblaCarousel slides={imageUrls} options={OPTIONS} />
      </AspectRatio>

      <Box p='6'>
        <Box display='flex' alignItems='baseline'>
          <Badge borderRadius='full' px='2' colorScheme='teal'>
            {product.stock}
          </Badge>
        </Box>
        <Box mt='1' fontWeight='semibold' as='h2' lineHeight='tight' noOfLines={1}>
          {product.name.toUpperCase()}
        </Box>
        <Box mt='1' fontWeight='500' as='h4' lineHeight='tight' noOfLines={1}>
          {product.description}
        </Box>
        <Box>
          {product.price}
          <Box as='span' color='gray.600' fontSize='sm'>
            {" "} руб
          </Box>
        </Box>
        <Box display='flex' mt='2' as='small' alignItems='center'>
          {formatDate(product.createdAt)}
        </Box>
      </Box>
    </Box>
  );
}
