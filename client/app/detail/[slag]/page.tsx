'use client';
import { getProductDetail, addToCart } from '@/actions/clientActions';
import AppContainer from '@/components/app-container';
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  SimpleGrid,
  Image,
  useNumberInput,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { IIProduct } from '@/types';
import { useInfoMessage } from '@/utils/toastHelper';

import OrderActions from '@/components/order-actions';

const AppModal = dynamic(() => import('@/components/app-modal'), {
  ssr: false,
});

interface DetailPageProps {
  params: {
    slag: string;
  };
}

export default function DetailPage({ params }: DetailPageProps) {
  const { slag } = params;
  const dispatch = useAppDispatch();
  const [product, setProduct] = useState<IIProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const router = useRouter();
  const showInfoMessage = useInfoMessage();

  const [quantity, setQuantity] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);

  const getProduct = async () => {
    const { payload } = await dispatch(getProductDetail(slag));

    if (payload && typeof payload === 'object' && 'product' in payload) {
      setProduct(payload.product as IIProduct);
    } else {
      console.error('Ошибка: payload не содержит корректного объекта product');
    }
  };

  /* eslint-disable */
  useEffect(() => {
    getProduct();
  }, []);

  /* eslint-disable */
  useEffect(() => {
    if (product) {
      setStock(product?.stock);
    }
  }, [product]);

  const imageUrls = product?.images.map(
    (image) => `${process.env.NEXT_PUBLIC_API_URL}/uploads/${image.imageUrl}`
  );

  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

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
      showInfoMessage('top', 'Авторизуйтесь, чтобы сделать заказ!', 'warning');
      return;
    }

    if (userId === null) {
      showInfoMessage(
        'top',
        'Ошибка: не удалось получить идентификатор пользователя.',
        'error'
      );
      return;
    }

    const newItem = { userId, productId: product!.id.toString(), quantity };
    dispatch(addToCart(newItem))
      .unwrap()
      .then(() => {
        showInfoMessage('top', 'Товар добавлен в корзину!', 'success');
      })
      .catch((error) => {
        showInfoMessage(
          'top',
          'Не удалось добавить товар в корзину',
          'success',
          error.message
        );
      });
  };

  const goToBusket = () => {
    router.push('/busket');
  };

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

  if (!product) {
    return (
      <AppContainer title="" myClass="flex-col">
        <Heading>Товар не найден!</Heading>
      </AppContainer>
    );
  }

  return (
    <AppContainer myClass="flex-col">
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={10}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Главная</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href={`/products/${slag}`}>
            {product.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Stack spacing={6} mb="10" w="100%" alignItems="flex-start">
        <HStack
          spacing={4}
          w="100%"
          bg="white"
          alignItems="flex-start"
          direction={{ base: 'column', md: 'row' }}
          border="1px solid #DEDEDE"
          p="5"
          borderRadius="10"
          shadow="lg"
        >
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 5 }}
            spacing={2}
            w="100%"
            justifyContent={{ base: 'center', md: 'flex-start' }}
          >
            {imageUrls?.map((url, index) => (
              <Image
                w={{ base: '300px', sm: '250px' }}
                h={{ base: '140px', sm: '250px' }}
                mr={{ base: '0', sm: '20px' }}
                objectFit="contain"
                key={index}
                src={url}
                alt={`изображение ${product.name} ${index + 1}`}
                borderRadius="md"
                cursor="pointer"
                onClick={() => openModal(url)}
              />
            ))}
          </SimpleGrid>
        </HStack>
        <Heading size="lg" mb="5" color="green.600">
          {product.name}
        </Heading>
        whiteSpace='nowrap'
        <Text fontSize={{ base: 'lg', md: 'xl' }} whiteSpace="nowrap">
          {product.price} ₽
        </Text>
        <Box
          fontSize={{ base: 'sm', md: 'md' }}
          fontWeight="bold"
          as="p"
          whiteSpace="nowrap"
        >
          В наличии: {product.stock}
        </Box>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          w="100%"
          textAlign="left"
          fontWeight="600"
        >
          {product.description}
        </Text>
        <Box mb="4" w="100%">
          <HStack
            maxW={{ base: '100%', md: '320px' }}
            direction={{ base: 'column', md: 'row' }}
            spacing={4}
          >
            <Button
              size={{ base: 'sm', md: 'md' }}
              {...dec}
              isDisabled={stock === 0}
            >
              -
            </Button>
            <Input
              size={{ base: 'sm', md: 'md' }}
              {...input}
              textAlign="center"
              isDisabled={stock === 0}
            />
            <Button
              size={{ base: 'sm', md: 'md' }}
              {...inc}
              isDisabled={stock === 0}
            >
              +
            </Button>
          </HStack>
        </Box>
        <Box mb="5" w="full" maxW="450px">
          <OrderActions
            quantity={quantity}
            stock={stock}
            handleOrder={handleOrder}
            handleResetQuantity={handleResetQuantity}
            goToBusket={goToBusket}
          />
        </Box>
      </Stack>

      <Suspense fallback={<Box as="div">Загрузка...</Box>}>
        <AppModal
          title={product.name}
          isOpen={isModalOpen}
          onClose={closeModal}
          modalSize="xl"
        >
          <Image
            src={selectedImage || ''}
            alt="Изображение товара"
            boxSize="700px"
            objectFit="contain"
            borderRadius="md"
          />
        </AppModal>
      </Suspense>
    </AppContainer>
  );
}
