import { useQuery } from "@tanstack/react-query";
import { getProductsAction } from "../actions/get-products.action";
import { useParams, useSearchParams } from "react-router";

export const useProducts = () => {
  const { gender } = useParams(); // este mae aqui jalo el gender directo del URL

  const [searchParams] = useSearchParams();

  const limit = searchParams.get("limit") || 9; //estos me los jalo del URL pero como filtros o parametros del query GET
  const page = searchParams.get("page") || 1;
  const sizes = searchParams.get("sizes") || undefined;
  const query = searchParams.get("query") || undefined;

  //console.log(sizes, gender);

  const offset = (Number(page) - 1) * Number(limit);
  const price = searchParams.get("price") || "any";

  let minPrice = undefined;
  let maxPrice = undefined;

  switch (price) {
    case "any":
      break;

    case "0-50":
      minPrice = 0;
      maxPrice = 50;
      break;

    case "50-100":
      minPrice = 50;
      maxPrice = 100;
      break;

    case "100-200":
      minPrice = 100;
      maxPrice = 200;
      break;

    case "200+":
      minPrice = 200;
      maxPrice = undefined;
      break;
  }

  return useQuery({
    queryKey: [
      "products",
      { offset, limit, gender, sizes, maxPrice, minPrice, query },
    ],
    queryFn: () =>
      getProductsAction({
        limit: isNaN(+limit) ? 9 : limit, //si es texto o undefined lo pasa a 9 sino al limit que le estand proporcionando, null pasa a cero
        offset: isNaN(offset) ? 0 : offset,
        gender,
        sizes,
        maxPrice,
        minPrice,
        query,
      }),
    staleTime: 1000 * 60 ** 5,
  });
};

// si quiero transformalo en un hook devolver cualquier cosa que NO sea un funcional component ej ()!!!!!
// se puede retornar arreglo un valor cualquier excepto un fncional component
