
import { fetchProducts } from "@/actions";
import ProductCard from "@/components/productCard";
import { IIProduct } from "@/types";
import { Grid, Text } from '@chakra-ui/react'

export default async function Home() {
  const products = await fetchProducts() ?? []


  console.log(products);

  return (
    <div className="container min-h-screen">
      <section className="p-3">
        <Text className="mb-8" color='blue.600' fontSize='4xl'>All Products: {products.length}</Text>
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
          {products && products.length ? products.map((product: IIProduct) => (
            <ProductCard product={product} key={product.id} />
          )) : (
            <p>No products yet!</p>
          )}
        </Grid>
      </section>
    </div>
  );
}


