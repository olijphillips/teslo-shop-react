import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { SizeSelector } from "../../components/SizeSelector";
import { ReviewsSection } from "../../components/ReviewsSection";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
}

interface Size {
  id: string;
  size: string;
  in_stock: boolean;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

export function ProductDetail() {
  const { name } = useParams<{ name: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const decodedName = decodeURIComponent(name || "");

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*")
          .ilike("name", decodedName)
          .maybeSingle();

        if (productError) throw productError;
        if (!productData) {
          setError("Producto no encontrado");
          setLoading(false);
          return;
        }

        setProduct(productData);

        const { data: sizesData, error: sizesError } = await supabase
          .from("product_sizes")
          .select("*")
          .eq("product_id", productData.id)
          .order("size", { ascending: true });

        if (sizesError) throw sizesError;
        setSizes(sizesData || []);
        if (sizesData && sizesData.length > 0) {
          setSelectedSize(sizesData[0].size);
        }

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("product_reviews")
          .select("*")
          .eq("product_id", productData.id)
          .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData || []);

        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el producto",
        );
        setLoading(false);
      }
    };

    if (name) {
      fetchProduct();
    }
  }, [name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={24} />
          <p>{error || "Producto no encontrado"}</p>
        </div>
      </div>
    );
  }

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
              <span
                className={`text-lg font-semibold ${inStock ? "text-green-600" : "text-red-600"}`}
              >
                {inStock ? `${product.stock} en stock` : "Sin stock"}
              </span>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {product.description}
            </p>

            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
            />

            <button
              disabled={!inStock}
              className={`mt-8 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                inStock
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={20} />
              {inStock ? "Agregar al Carrito" : "Sin Stock"}
            </button>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-600">
                Envío disponible a nivel nacional en 3-5 días hábiles
              </p>
            </div>
          </div>
        </div>

        {reviews.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <ReviewsSection reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
}
