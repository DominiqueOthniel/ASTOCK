import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PalletDeals bulk liquidation marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 72,
          background: "linear-gradient(145deg, #1a2e1f 0%, #243828 45%, #3d5c3a 100%)",
          color: "#f4f7f2",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -1 }}>PalletDeals</div>
        <div style={{ marginTop: 18, fontSize: 34, maxWidth: 820, opacity: 0.92 }}>
          Fixed-price liquidation pallets, toys, electronics, and Christmas trees
        </div>
        <div style={{ marginTop: 28, fontSize: 24, opacity: 0.7 }}>palletdealsshop.com</div>
      </div>
    ),
    { ...size },
  );
}
