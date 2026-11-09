import { ImageUploadField } from "@/components/ImageUploadField";
import { categories, conditionGrades, lotTypes } from "@/lib/constants";
import { lotPrice } from "@/lib/pricing";
import type { Lot } from "@/lib/types";

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function LotForm({
  lot,
  mode,
}: {
  lot?: Lot;
  mode: "create" | "edit";
}) {
  const action =
    mode === "create" ? "/api/admin/lots" : `/api/admin/lots/${lot?.id}`;
  const imagesValue = lot?.images.join("\n") ?? "";
  const priceDefault = lot ? lotPrice(lot) : 500;

  return (
    <form
      method="post"
      action={action}
      className="space-y-8 border border-line bg-white p-6 shadow-[var(--shadow)]"
      encType="application/x-www-form-urlencoded"
    >
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Basics</h2>
          <p className="mt-1 text-sm text-steel">Title, place, category, and grade.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="mb-1.5 block font-medium">Title</span>
            <input className="field" name="title" required defaultValue={lot?.title ?? ""} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Slug (optional)</span>
            <input
              className="field"
              name="slug"
              defaultValue={lot?.slug ?? ""}
              placeholder="auto from title if blank"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Warehouse location</span>
            <input className="field" name="location" required defaultValue={lot?.location ?? ""} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Category</span>
            <select className="field" name="category" defaultValue={lot?.category ?? "Electronics"}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Condition grade</span>
            <select className="field" name="condition" defaultValue={lot?.condition ?? "B"}>
              {conditionGrades.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Lot type</span>
            <select className="field" name="lotType" defaultValue={lot?.lotType ?? "Pallet"}>
              {lotTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-line pt-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Price &amp; inventory</h2>
          <p className="mt-1 text-sm text-steel">Fixed asking price buyers see on the lot.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Asking price (USD)</span>
            <input
              className="field"
              name="price"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={priceDefault}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Unit count / stock</span>
            <input
              className="field"
              name="unitCount"
              type="number"
              step="1"
              min="1"
              required
              defaultValue={lot?.unitCount ?? 100}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Min quantity</span>
            <input
              className="field"
              name="minQuantity"
              type="number"
              step="1"
              min="1"
              required
              defaultValue={lot?.minQuantity ?? 1}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Estimated retail</span>
            <input
              className="field"
              name="estimatedRetail"
              type="number"
              step="1"
              min="0"
              required
              defaultValue={lot?.estimatedRetail ?? 5000}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Available until</span>
            <input
              className="field"
              name="endsAt"
              type="datetime-local"
              required
              defaultValue={toLocalInput(
                lot?.endsAt ?? new Date(Date.now() + 14 * 24 * 3600000).toISOString(),
              )}
            />
          </label>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="sellByUnit"
              value="true"
              defaultChecked={lot?.sellByUnit}
            />
            Sell by unit (price is per unit; buyers pick qty)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="featured" value="true" defaultChecked={lot?.featured} />
            Featured on home
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              value="true"
              defaultChecked={lot?.published ?? true}
            />
            Published
          </label>
        </div>
      </section>

      <section className="space-y-4 border-t border-line pt-6">
        <ImageUploadField name="images" defaultValue={imagesValue} />
      </section>

      <section className="space-y-4 border-t border-line pt-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink">Listing details</h2>
          <p className="mt-1 text-sm text-steel">Manifest, condition, seller notes, and logistics.</p>
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Manifest summary</span>
          <textarea
            className="field min-h-28"
            name="manifestSummary"
            required
            defaultValue={lot?.manifestSummary ?? ""}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Condition notes</span>
          <textarea
            className="field min-h-24"
            name="conditionNotes"
            required
            defaultValue={lot?.conditionNotes ?? ""}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Seller notes</span>
          <textarea
            className="field min-h-24"
            name="sellerNotes"
            required
            defaultValue={lot?.sellerNotes ?? ""}
          />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Shipping</span>
            <textarea className="field min-h-24" name="shipping" required defaultValue={lot?.shipping ?? ""} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Pickup</span>
            <textarea className="field min-h-24" name="pickup" required defaultValue={lot?.pickup ?? ""} />
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 border-t border-line pt-6">
        <button type="submit" name="intent" value="save" className="btn btn-primary">
          {mode === "create" ? "Create lot" : "Save lot"}
        </button>
        {mode === "edit" && lot ? (
          <>
            <button type="submit" name="intent" value="publish" className="btn btn-secondary">
              Publish
            </button>
            <button type="submit" name="intent" value="unpublish" className="btn btn-secondary">
              Unpublish
            </button>
            <button
              type="submit"
              name="intent"
              value="delete"
              className="btn btn-secondary"
              formNoValidate
            >
              Delete
            </button>
          </>
        ) : null}
      </div>
    </form>
  );
}
