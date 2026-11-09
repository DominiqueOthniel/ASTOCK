"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { submitReviewAction } from "@/app/actions/reviews";

export function ReviewForm({ lotId, slug }: { lotId: string; slug: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(5);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("lotId", lotId);
    formData.set("slug", slug);
    formData.set("rating", String(rating));
    startTransition(async () => {
      const result = await submitReviewAction(formData);
      if (!result.ok) {
        setError(result.error);
        setDone(false);
        return;
      }
      setError(null);
      setDone(true);
      form.reset();
      setRating(5);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-8 border border-line bg-surface p-5 shadow-[var(--shadow)]"
      data-testid="review-form"
    >
      <h3 className="font-display text-xl font-semibold text-ink">Write a review</h3>
      <p className="mt-1 text-sm text-steel">Keep it real. Stars and a short note are enough.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Name</span>
          <input
            className="field"
            name="authorName"
            required
            minLength={2}
            maxLength={40}
            placeholder="Jordan M."
            disabled={pending}
          />
        </label>
        <fieldset className="text-sm">
          <legend className="mb-1.5 block font-medium">Stars</legend>
          <div className="flex items-center gap-1 pt-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className={`text-2xl leading-none ${
                  value <= rating ? "text-accent-deep" : "text-line"
                }`}
                aria-label={`${value} stars`}
                aria-pressed={value === rating}
                onClick={() => setRating(value)}
                disabled={pending}
              >
                ★
              </button>
            ))}
          </div>
          <input type="hidden" name="rating" value={rating} />
        </fieldset>
      </div>

      <label className="mt-4 block text-sm">
        <span className="mb-1.5 block font-medium">Review</span>
        <textarea
          className="field min-h-28"
          name="body"
          required
          minLength={12}
          maxLength={600}
          placeholder="What showed up, shipping, anything buyers should know."
          disabled={pending}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Posting…" : "Post review"}
        </button>
        {done ? (
          <p className="text-sm font-medium text-accent-deep" role="status">
            Posted. Thanks.
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-warn" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </form>
  );
}
