import { CustomJumbotron } from "@/shop/components/CustomJumbotron";
import { CustomPagination } from "../../../components/custom/CustomPagination";
import { ProductsGrid } from "@/shop/components/ProductsGrid";
//import { products } from "@/mocks/products.mock";
import { useProducts } from "@/shop/hooks/useProducts";

export const HomePage = () => {
  const { data } = useProducts();

  console.log({ data });

  return (
    <>
      <CustomJumbotron title="Todos los productos" subTitle="Perro viejo" />
      <ProductsGrid products={data?.products || []} />
      <CustomPagination totalPages={data?.pages || 0} />
    </>
  );
};
