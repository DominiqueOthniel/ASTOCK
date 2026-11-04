"use client";

import { useState, useTransition } from "react";

export function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [urls, setUrls] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    const body = new FormData();
    body.set("file", file);
    startTransition(async () => {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setUrls((prev) => (prev.trim() ? `${prev.trim()}\n${data.url}` : data.url!));
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Image URLs (one per line)</span>
        <textarea
          className="field min-h-28"
          name={name}
          required
          value={urls}
          onChange={(event) => setUrls(event.target.value)}
          placeholder="https://… or upload below"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1.5 block font-medium">Upload to Supabase Storage</span>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm"
          onChange={onFileChange}
          disabled={pending}
        />
        <p className="mt-1 text-xs text-steel">
          Requires `lot-images` bucket and SUPABASE_SERVICE_ROLE_KEY on the server.
        </p>
      </label>
      {pending ? <p className="text-sm text-steel">Uploading…</p> : null}
      {error ? <p className="text-sm text-warn">{error}</p> : null}
    </div>
  );
}
