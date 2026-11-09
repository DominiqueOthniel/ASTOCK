"use client";

type BuyerDetailsFieldsProps = {
  idPrefix?: string;
  disabled?: boolean;
  compact?: boolean;
};

export function BuyerDetailsFields({
  idPrefix = "buyer",
  disabled = false,
  compact = false,
}: BuyerDetailsFieldsProps) {
  const gap = compact ? "gap-3" : "gap-4";

  return (
    <div className={`space-y-4 ${compact ? "" : "border border-line bg-mist/40 p-4"}`} data-testid="buyer-details">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-steel">Buyer details</p>
        <p className="mt-1 text-sm text-ink-soft">
          Required for every order. Must be 18 or older.
        </p>
      </div>

      <div className={`grid ${gap}`}>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">Full name</span>
          <input
            className="field"
            name="fullName"
            id={`${idPrefix}-fullName`}
            autoComplete="name"
            required
            minLength={2}
            maxLength={80}
            placeholder="First and last name"
            disabled={disabled}
          />
        </label>

        <div className={`grid ${gap} sm:grid-cols-2`}>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Phone</span>
            <input
              className="field"
              name="phone"
              id={`${idPrefix}-phone`}
              type="tel"
              autoComplete="tel"
              required
              placeholder="+1 (555) 010-2000"
              disabled={disabled}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">Age</span>
            <input
              className="field"
              name="age"
              id={`${idPrefix}-age`}
              type="number"
              inputMode="numeric"
              min={18}
              max={120}
              step={1}
              required
              placeholder="18+"
              disabled={disabled}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1.5 block font-medium text-ink">Street address</span>
          <input
            className="field"
            name="street"
            id={`${idPrefix}-street`}
            autoComplete="street-address"
            required
            minLength={5}
            maxLength={120}
            placeholder="Street and number"
            disabled={disabled}
          />
        </label>

        <div className={`grid ${gap} sm:grid-cols-3`}>
          <label className="block text-sm sm:col-span-1">
            <span className="mb-1.5 block font-medium text-ink">City</span>
            <input
              className="field"
              name="city"
              id={`${idPrefix}-city`}
              autoComplete="address-level2"
              required
              disabled={disabled}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">State</span>
            <input
              className="field"
              name="state"
              id={`${idPrefix}-state`}
              autoComplete="address-level1"
              required
              maxLength={2}
              placeholder="TX"
              disabled={disabled}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium text-ink">ZIP</span>
            <input
              className="field"
              name="postal"
              id={`${idPrefix}-postal`}
              autoComplete="postal-code"
              required
              placeholder="75001"
              disabled={disabled}
            />
          </label>
        </div>

        <input type="hidden" name="country" value="US" />
      </div>
    </div>
  );
}
