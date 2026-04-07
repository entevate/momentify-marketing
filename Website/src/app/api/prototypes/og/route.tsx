import { ImageResponse } from "next/og";
import { instances } from "@/app/prototypes/explorer/instances";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const instance = instances.find((i) => i.slug === slug);

  const name = instance?.name ?? "Explorer Prototype";
  const company = instance?.company ?? "Momentify";
  const industry = instance?.industry ?? "";
  const accent = instance?.accentColor ?? "#0CF4DF";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #07081F 0%, #0B0B3C 55%, #1A2E73 100%)",
          fontFamily: "Inter, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Accent orb top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: accent,
            opacity: 0.08,
            filter: "blur(80px)",
          }}
        />
        {/* Accent orb bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: accent,
            opacity: 0.06,
            filter: "blur(60px)",
          }}
        />

        {/* Logo */}
        {instance?.logo && (
          <img
            src={`https://www.momentifyapp.com${instance.logo}`}
            width={72}
            height={72}
            style={{
              borderRadius: 16,
              marginBottom: 28,
              objectFit: "contain",
            }}
          />
        )}

        {/* Name */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 600,
            color: "#FFFFFF",
            textAlign: "center",
            lineHeight: 1.2,
            marginBottom: 12,
            maxWidth: 900,
          }}
        >
          {name}
        </div>

        {/* Company + Industry */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: "rgba(255,255,255,0.55)",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span>{company}</span>
          {industry && (
            <>
              <span style={{ color: accent, fontSize: 18 }}>&#x2022;</span>
              <span>{industry}</span>
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.04em",
            }}
          >
            Powered by Momentify
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
