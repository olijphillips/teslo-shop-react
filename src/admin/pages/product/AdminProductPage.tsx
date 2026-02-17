// https://github.com/Klerith/bolt-product-editor

import { Navigate, useNavigate, useParams } from "react-router";

import { useProduct } from "@/admin/hooks/useProduct";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading";
import { ProductForm } from "./ui/ProductForm";
import type { Product } from "@/interfaces/product.interface";
import { toast } from "sonner";

export const AdminProductPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { isLoading, isError, data: product, mutation } = useProduct(id || "");

  //console.log({ mutation: mutation.isPending });

  const title = id === "new" ? "Nuevo producto" : "Editar producto";
  const subtitle =
    id === "new"
      ? "Aquí puedes crear un nuevo producto."
      : "Aquí puedes editar el producto.";

  const handleSaveProduct = (
    productLike: Partial<Product> & { files?: File[] },
  ) => {
    mutation.mutate(productLike, {
      onSuccess: (data) => {
        toast.success("Producto actualizado correctamente", {
          position: "top-right",
        });
        // Remover esta línea, ya que el invalidateQueries causará un re-render
        // y el componente ya tiene el producto actualizado
        // navigate(`/admin/products/${data.id}`);
      },
      onError: (error: any) => {
        console.error("Error completo:", error);
        console.error("Response data:", error.response?.data);
        toast.error(
          error.response?.data?.message || "Error al actualizar el producto",
          {
            position: "top-right",
          },
        );
      },
    });
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
      isPending={mutation.isPending}
    />
  );
};
