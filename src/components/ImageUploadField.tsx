"use client";

import Image from "next/image";
import { useMemo, useState, useTransition } from "react";

function parseUrls(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [urls, setUrls] = useState(() => parseUrls(defaultValue ?? ""));
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const serialized = useMemo(() => urls.join("\n"), [urls]);

  function removeAt(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function onFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setError(null);
    setStatus(`Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`);

    startTransition(async () => {
      const uploaded: string[] = [];
      const failures: string[] = [];

      for (const file of files) {
        const body = new FormData();
        body.set("file", file);
        try {
          const response = await fetch("/api/admin/upload", {
            method: "POST",
            body,
          });
          const data = (await response.json()) as { url?: string; error?: string };
          if (!response.ok || !data.url) {
            failures.push(data.error ?? file.name);
            continue;
          }
          uploaded.push(data.url);
        } catch {
          failures.push(file.name);
        }
      }

      if (uploaded.length > 0) {
        setUrls((prev) => [...prev, ...uploaded]);
      }
      if (failures.length > 0) {
        setError(`Failed: ${failures.slice(0, 3).join("; ")}${failures.length > 3 ? "…" : ""}`);
      } else {
        setError(null);
      }
      setStatus(
        uploaded.length > 0
          ? `Added ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`
          : null,
      );
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-ink">Lot images</p>
        <p className="mt-1 text-xs leading-relaxed text-steel">
          Select multiple photos at once. Uploads go to Supabase Storage and join the gallery.
        </p>
      </div>

      <input type="hidden" name={name} value={serialized} required={urls.length === 0} />

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {urls.map((url, index) => (
            <li key={`${url}-${index}`} className="relative overflow-hidden border border-line bg-mist">
              <div className="relative aspect-[4/3]">
                <Image
                  src={url}
                  alt={`Lot image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="160px"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-2 py-1.5 text-[11px] text-steel">
                <span>#{index + 1}</span>
                <button
                  type="button"
                  className="font-semibold text-warn hover:underline"
                  onClick={() => removeAt(index)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-dashed border-line bg-white px-3 py-6 text-center text-sm text-steel">
          No images yet. Upload files or paste URLs below.
        </p>
      )}

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Upload images</span>
        <input
          type="file"
          accept="image/*"
          multiple
          className="block w-full text-sm"
          onChange={onFilesChange}
          disabled={pending}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Or edit image URLs</span>
        <textarea
          className="field min-h-24"
          value={serialized}
          onChange={(event) => setUrls(parseUrls(event.target.value))}
          placeholder="One https URL per line"
        />
      </label>

      {pending ? <p className="text-sm text-steel">{status ?? "Uploading…"}</p> : null}
      {!pending && status ? <p className="text-sm text-ink-soft">{status}</p> : null}
      {error ? <p className="text-sm text-warn">{error}</p> : null}
      {urls.length === 0 ? (
        <p className="text-xs text-warn">At least one image is required before save.</p>
      ) : null}
    </div>
  );
}
