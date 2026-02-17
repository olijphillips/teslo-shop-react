import type { Product } from "@/interfaces/product.interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUpdateProductAction } from "../actions/create-update-product.action";
import { getProductionByIdAction } from "../actions/get-product-by-id.action";

export const useProduct = (id: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["product", { id }],
    queryFn: () => getProductionByIdAction(id),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    // enabled: id
  });

  const mutation = useMutation({
    mutationFn: createUpdateProductAction,
    onSuccess: (product: Product) => {
      // Invalidar la lista de productos
      queryClient.invalidateQueries({ queryKey: ["products"] });

      // Actualizar el caché del producto específico
      queryClient.setQueryData(["product", { id: product.id }], product);
    },
  });

  return {
    ...query,
    mutation,
  };
};
