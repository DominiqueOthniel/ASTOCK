import { categories, conditionGrades, lotTypes, saleTypes } from "@/lib/constants";
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

  return (
    <form method="post" action={action} className="space-y-5 border border-line bg-white p-6 shadow-[var(--shadow)]">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block font-medium">Title</span>
          <input className="field" name="title" required defaultValue={lot?.title ?? ""} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Slug</span>
          <input
            className="field"
            name="slug"
            defaultValue={lot?.slug ?? ""}
            placeholder="auto from title if blank"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Location</span>
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
          <span className="mb-1.5 block font-medium">Condition</span>
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
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Sale type</span>
          <select className="field" name="saleType" defaultValue={lot?.saleType ?? "Auction"}>
            {saleTypes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Current bid</span>
          <input
            className="field"
            name="currentBid"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={lot?.currentBid ?? 500}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Starting bid</span>
          <input
            className="field"
            name="startingBid"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={lot?.startingBid ?? 500}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Buy now price</span>
          <input
            className="field"
            name="buyNowPrice"
            type="number"
            step="1"
            min="0"
            defaultValue={lot?.buyNowPrice ?? ""}
            placeholder="Optional"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Bid count</span>
          <input
            className="field"
            name="bidCount"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={lot?.bidCount ?? 0}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Unit count</span>
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
          <span className="mb-1.5 block font-medium">Ends at</span>
          <input
            className="field"
            name="endsAt"
            type="datetime-local"
            required
            defaultValue={toLocalInput(
              lot?.endsAt ?? new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
            )}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="reserveMet" value="true" defaultChecked={lot?.reserveMet} />
          Reserve met
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" value="true" defaultChecked={lot?.featured} />
          Featured
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

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Image URLs (one per line)</span>
        <textarea
          className="field min-h-28"
          name="images"
          required
          defaultValue={imagesValue}
          placeholder="https://images.unsplash.com/..."
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Manifest summary</span>
        <textarea className="field min-h-28" name="manifestSummary" required defaultValue={lot?.manifestSummary ?? ""} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Condition notes</span>
        <textarea className="field min-h-24" name="conditionNotes" required defaultValue={lot?.conditionNotes ?? ""} />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Seller notes</span>
        <textarea className="field min-h-24" name="sellerNotes" required defaultValue={lot?.sellerNotes ?? ""} />
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

      <div className="flex flex-wrap gap-3 pt-2">
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
