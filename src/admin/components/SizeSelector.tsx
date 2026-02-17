interface Size {
  id: string;
  size: string;
  in_stock: boolean;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string | null;
  onSelectSize: (size: string) => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Talla</h3>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => size.in_stock && onSelectSize(size.size)}
            disabled={!size.in_stock}
            className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
              selectedSize === size.size
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : size.in_stock
                  ? "border-gray-300 hover:border-blue-300 text-gray-700"
                  : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {size.size}
          </button>
        ))}
      </div>
    </div>
  );
}
