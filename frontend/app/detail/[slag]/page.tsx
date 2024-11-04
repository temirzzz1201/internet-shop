'use client';
import {
  getProductDetail,
  addToCart,
  removeFromCart,
} from '@/actions/clientActions';
import AppContainer from '@/components/app-container';
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  HStack,
  Divider,
  SimpleGrid,
  Image,
  useNumberInput,
  useToast,
  Input,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import AppModal from '@/components/app-modal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { IIProduct } from '@/types';

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

  const [quantity, setQuantity] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const toast = useToast();

  const getProduct = async () => {
    const { payload } = await dispatch(getProductDetail(slag));
    setProduct(payload?.product);
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

  console.log('imageUrls ', imageUrls);

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
      toast({
        title: 'Авторизуйтесь, чтобы сделать заказ!',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (userId === null) {
      toast({
        title: 'Ошибка: не удалось получить идентификатор пользователя.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newItem = { userId, productId: product!.id.toString(), quantity };
    dispatch(addToCart(newItem))
      .unwrap()
      .then(() => {
        toast({
          title: 'Товар добавлен в корзину!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          title: 'Не удалось добавить товар в корзину',
          description: error.message || 'Ошибка сети',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const goToBusket = () => {
    router.push('/busket');
  };

  const handleResetQuantity = () => {
    setQuantity(0);
    dispatch(removeFromCart({ id: product.id.toString() }));
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
      <AppContainer title="Детальная" myClass="flex-col">
        <Heading>Товар не найден или неверный формат</Heading>
      </AppContainer>
    );
  }

  return (
    <AppContainer title={''} myClass="flex-col">
      <Breadcrumb
        spacing="8px"
        separator={<ChevronRightIcon color="gray.500" />}
        mb={4}
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

      <Stack spacing={6} mb="10">
        <HStack spacing={4}>
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            {imageUrls?.map((url, index) => (
              <Image
                key={index}
                boxSize="300px"
                objectFit="contain"
                src={url}
                alt={`${product.name} изображение ${index + 1}`}
                borderRadius="md"
                cursor="pointer"
                onClick={() => openModal(url)}
              />
            ))}
          </SimpleGrid>
        </HStack>

        <Divider />

        <Text fontSize={{ base: 'lg', md: 'xl' }} color="green.600">
          ₽{product.name}
        </Text>
        <Text fontSize={{ base: 'lg', md: 'xl' }} color="green.600">
          ₽{product.price}
        </Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
          В наличии: {product.stock}
        </Text>
        <Text
          fontSize={{ base: 'lg', md: 'xl' }}
          color="gray.500"
          maxW="70%"
          fontWeight="600"
        >
          Описание: {product.description}
        </Text>

        <Box mb="4">
          <HStack maxW="60%">
            <Button
              size={{ base: 'md', md: 'lg' }}
              {...dec}
              isDisabled={stock === 0}
            >
              -
            </Button>
            <Input
              size={{ base: 'md', md: 'lg' }}
              {...input}
              textAlign="center"
              isDisabled={stock === 0}
            />
            <Button
              size={{ base: 'md', md: 'lg' }}
              {...inc}
              isDisabled={stock === 0}
            >
              +
            </Button>
          </HStack>
        </Box>

        <Box mb="5">
          <Button
            disabled={quantity === 0}
            size={{ base: 'md', md: 'lg' }}
            colorScheme="green"
            mr={3}
            onClick={handleOrder}
            isDisabled={stock === 0}
          >
            В корзину
          </Button>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="red"
            onClick={handleResetQuantity}
            isDisabled={stock === 0}
          >
            Удалить
          </Button>
          <Button
            size={{ base: 'md', md: 'lg' }}
            colorScheme="blue"
            variant="ghost"
            onClick={goToBusket}
          >
            Перейти в корзину
          </Button>
        </Box>
      </Stack>

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
    </AppContainer>
  );
}
