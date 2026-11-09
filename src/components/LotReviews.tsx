import { RelativeTime } from "@/components/RelativeTime";
import { averageRating, type LotReview } from "@/lib/reviews";

function Stars({ rating }: { rating: number }) {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${clamped} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const on = index < clamped;
        return (
          <span
            key={index}
            aria-hidden="true"
            className={on ? "text-accent-deep" : "text-line"}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

export function LotReviews({ reviews }: { reviews: LotReview[] }) {
  if (reviews.length === 0) return null;

  const avg = averageRating(reviews);

  return (
    <section className="mt-12 border-t border-line pt-10" data-testid="lot-reviews">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Reviews</h2>
          <p className="mt-1 text-sm text-steel">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
            {avg != null ? ` · ${avg} average` : ""}
          </p>
        </div>
        {avg != null ? (
          <div className="flex items-center gap-2 text-sm text-ink-soft">
            <Stars rating={avg} />
            <span className="font-medium text-ink">{avg.toFixed(1)}</span>
          </div>
        ) : null}
      </div>

      <ul className="mt-6 space-y-0 divide-y divide-line border-y border-line">
        {reviews.map((review) => (
          <li key={review.id} className="py-5" data-testid="lot-review">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <Stars rating={review.rating} />
              <p className="font-medium text-ink">{review.authorName}</p>
              {review.verified ? (
                <span className="text-[11px] uppercase tracking-[0.12em] text-steel">
                  Buyer
                </span>
              ) : null}
              <RelativeTime
                date={review.createdAt}
                className="text-sm text-steel sm:ml-auto"
              />
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{review.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
