// https://github.com/Klerith/bolt-product-editor

import { Navigate, useParams } from "react-router";

import { useProduct } from "@/admin/hooks/useProduct";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { ProductForm } from "./ui/ProductForm";
import type { Product } from "@/interfaces/product.interface";

export const AdminProductPage = () => {
  const { id } = useParams();

  // const navigate = useNavigate();

  const {
    isLoading,
    isError,
    data: product,
    mutation: productMutation,
  } = useProduct(id || "");

  //console.log({ mutation: mutation.isPending });

  const title = id === "new" ? "Nuevo producto" : "Editar producto";
  const subtitle =
    id === "new"
      ? "Aquí puedes crear un nuevo producto."
      : "Aquí puedes editar el producto.";

  const handleSaveProduct = async (
    productLike: Partial<Product> & { files?: File[] },
  ) => {
    productMutation.mutate(productLike);
  };

  if (isError) {
    return <Navigate to="/admin/products" />;
  }

  if (isLoading) {
    return <CustomFullScreenLoading />;
  }

  if (!product) {
    return <Navigate to="/admin/products" />;
  }

  return (
    <ProductForm
      title={title}
      subTitle={subtitle}
      product={product}
      onSubmit={handleSaveProduct}
      isPending={productMutation.isPending}
    />
  );
};
