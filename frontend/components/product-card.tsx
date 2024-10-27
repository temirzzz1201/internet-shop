'use client';

/**
 * TODO
 * разбить на компоненты
 */
import { IProductCardProps } from '@/types';
import {
  Box,
  Badge,
  Heading,
  Text,
  Button,
  HStack,
  Input,
  useNumberInput,
  useToast,
  Tooltip,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { formatDate } from '@/utils/dateHelper';
import AppModal from './app-modal';
import { EmblaOptionsType } from 'embla-carousel';
import { capitalize } from '@/utils/capitalize';
import Cookies from 'js-cookie';
import busketSrcOrange from '../app/images/purchase_orange.svg'

// Динамический импорт карусели без SSR
const EmblaCarousel = dynamic(() => import('./carousel/embla-carousel'), {
  ssr: false,
});

const OPTIONS: EmblaOptionsType = { loop: true };

export default function ProductCard({ product }: IProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [stock, setStock] = useState<number>(product.stock); // Состояние для отслеживания stock
  const { images } = product;
  const toast = useToast();

  const router= useRouter()

  const imageUrls = images!.map(
    (image) => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`
  );

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleOpenProduct = () => setIsProductModalOpen(true);
  const handleCloseProduct = () => setIsProductModalOpen(false);

  const [userId, setUserId] = useState<string | null>(null);
  const userCookie = Cookies.get('user');

  useEffect(() => {
    if (userCookie) {
      const userFromCookie = JSON.parse(userCookie);
      setUserId(userFromCookie.id);
    }
  }, [userId, userCookie]);

  const handleOrder = () => {
    if (!userCookie) {
      setUserId(null);
      toast({
        title: 'Авторизуйтесь, чтобы сделать заказ!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    const busket = JSON.parse(localStorage.getItem('busket') || '[]');
    const newItem = { product, quantity }; 

    console.log('newItem ', newItem);
    
    
    busket.push(newItem);
    localStorage.setItem('busket', JSON.stringify(busket));
  };

  const goToBusket = () => {
    router.push('/busket');
  }
  

  const handleResetQuantity = () => {
    setQuantity(0);
  };

  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step: 1,
      value: quantity,
      min: 0,
      max: stock,
      onChange: (valueAsString, valueAsNumber) => {
        setQuantity(valueAsNumber);
      },
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <Box className={stock === 0 ? 'pointer-events-none' : ''}>
      <AppModal
        isOpen={isModalOpen}
        onClose={handleClose}
        title={product.category?.name || ''}
      >
        <EmblaCarousel
          slides={imageUrls}
          options={OPTIONS}
          autoPlayFlag
          imageHeightClass="300"
          product={product}
          // imageMaxHeightClass='200'
        />
      </AppModal>

      <AppModal
        isOpen={isProductModalOpen}
        onClose={handleCloseProduct}
        title={product.category?.name || ''}
      >
        <Box mb="4">
          <EmblaCarousel
            slides={imageUrls}
            options={OPTIONS}
            autoPlayFlag
            imageHeightClass="300"
          />
        </Box>
        <Box mb="4">
          <HStack>
            <Button size="sm" {...dec} isDisabled={stock === 0}>
              -
            </Button>
            <Input
              size="sm"
              {...input}
              textAlign="center"
              isDisabled={stock === 0}
            />
            <Button size="sm" {...inc} isDisabled={stock === 0}>
              +
            </Button>
          </HStack>
        </Box>
        <Box as='p' mt='5' mb='5'>{ product?.name }</Box>

        <Box mb="5">
          <Button
            disabled={quantity === 0}
            size="sm"
            colorScheme="green"
            mr={3}
            onClick={handleOrder}
            isDisabled={stock === 0}
          >
            В корзину
          </Button>
          <Button
            size="sm"
            colorScheme="red"
            onClick={handleResetQuantity}
            isDisabled={stock === 0}
          >
            Удалить
          </Button>
        </Box>
        <Box>
          <Button
              size="sm"
              colorScheme="blue"
              variant='ghost'
              onClick={goToBusket}
            >
            Перейти в корзину
          </Button>
        </Box>
      </AppModal>

      <Box
        p={4}
        bg={stock === 0 ? 'gray.100' : 'white'}
        borderRadius={10}
        as="article"
        border='1px solid #DCDCDC'
        boxShadow="md" 
      >
        <Box mb="3">
          <EmblaCarousel
            slides={imageUrls}
            options={OPTIONS}
            handleOpen={handleOpen}
            imageMaxHeightClass='200'
            // imageMaxWidthClass='250'
          />
        </Box>
        <Tooltip label={product.name} aria-label='A tooltip'>
          <Heading noOfLines={1} size="l" fontWeight="bold">
            {' '}
            {capitalize(product.name)}{' '}
          </Heading>
        </Tooltip>
        <Badge
          my="2"
          borderRadius="full"
          px="2"
          colorScheme={stock === 0 ? 'red' : 'teal'}
        >
          {' '}
          Осталось {stock}{' '} шт.
        </Badge>
        <Tooltip label={product.description} aria-label='A tooltip'>
          <Text mb="2" fontSize="md" noOfLines={1}>
            {' '}
            {capitalize(product.description)}{' '}
          </Text>
        </Tooltip>
        <Text
          display='flex'
          justifyContent='space-between'
          cursor="pointer"
          mb="2"
          fontWeight="bold"
          onClick={handleOpenProduct}
          sx={{
            transition: 'color 0.3s ease',
            _hover: {
              color: 'orange',
              fontWeight: 'bold',
            },
          }}
        >
          {' '}
          {product.price} руб.{' '}
          <Image className='max-w-[20px] hover:fill-orange-400' src={busketSrcOrange} alt={busketSrcOrange} />
        </Text>
        <Text mb="3" fontSize="xs">
          {' '}
          {formatDate(product.createdAt)}{' '}
        </Text>
      </Box>
    </Box>
  );
}
