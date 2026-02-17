import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  reviewer_name: string;
  created_at: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-semibold mb-6">Opiniones de Clientes</h2>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={
                  i < Math.round(Number(averageRating))
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-lg font-semibold">{averageRating}</span>
          <span className="text-gray-600">({reviews.length} opiniones)</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{review.title}</h3>
                <p className="text-sm text-gray-600">{review.reviewer_name}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(review.created_at).toLocaleDateString("es-ES")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
