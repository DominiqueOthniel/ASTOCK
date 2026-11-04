import Link from "next/link";

export function TermsAgree({
  checked,
  onChange,
  id = "terms-agree",
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  id?: string;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 text-sm leading-relaxed text-ink-soft">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
        required
      />
      <span>
        I agree to the{" "}
        <Link href="/terms" target="_blank" className="font-semibold text-accent-deep underline-offset-2 hover:underline">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" target="_blank" className="font-semibold text-accent-deep underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}
