import { ImageResponse } from "next/og";
import { instances } from "@/app/prototypes/explorer/instances";
import { MOMENTIFY_DEFAULT_CONFIG } from "@/lib/explorer/defaults";
import { CLARIUM_CONFIG } from "@/lib/explorer/configs/clarium";
import { CLARIUM_MOBILE_CONFIG } from "@/lib/explorer/configs/clarium-mobile";
import { MAVEN_FP_CONFIG } from "@/lib/explorer/configs/maven-fp";
import { CDK_CONFIG } from "@/lib/explorer/configs/cdk";
import { SALESFLOWIQ_CONFIG } from "@/lib/explorer/configs/salesflowiq";
import { DEALROOM_CONFIG } from "@/lib/explorer/configs/dealroom";
import { DEALROOM_MOBILE_CONFIG } from "@/lib/explorer/configs/dealroom-mobile";
import { SALAS_OBRIEN_CONFIG } from "@/lib/explorer/configs/salas-o-brien";
import { SALAS_OBRIEN_MOBILE_CONFIG } from "@/lib/explorer/configs/salas-o-brien-mobile";
import { DFWPB_PICKLEBALL_CONFIG } from "@/lib/explorer/configs/dfwpb-pickleball-may132026";
import { DFWPB_PICKLEBALL_MOBILE_CONFIG } from "@/lib/explorer/configs/dfwpb-pickleball-may132026-mobile";
import type { ExplorerConfig, SplashStepConfig } from "@/lib/explorer/types";

export const runtime = "edge";

const CONFIGS: Record<string, ExplorerConfig> = {
  "momentify-default": MOMENTIFY_DEFAULT_CONFIG,
  clarium: CLARIUM_CONFIG,
  "clarium-mobile": CLARIUM_MOBILE_CONFIG,
  "maven-fp": MAVEN_FP_CONFIG,
  cdk: CDK_CONFIG,
  salesflowiq: SALESFLOWIQ_CONFIG,
  dealroom: DEALROOM_CONFIG,
  "dealroom-mobile": DEALROOM_MOBILE_CONFIG,
  "salas-o-brien": SALAS_OBRIEN_CONFIG,
  "salas-o-brien-mobile": SALAS_OBRIEN_MOBILE_CONFIG,
  "dfwpb-pickleball-may132026": DFWPB_PICKLEBALL_CONFIG,
  "dfwpb-pickleball-may132026-mobile": DFWPB_PICKLEBALL_MOBILE_CONFIG,
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const instance = instances.find((i) => i.slug === slug);
  const config = slug ? CONFIGS[slug] : undefined;

  const name = instance?.name ?? "Explorer Prototype";
  const company = instance?.company ?? "Momentify";
  const industry = instance?.industry ?? "";
  const accent = instance?.accentColor ?? "#0CF4DF";

  // If a brand config exists, render the actual splash screen.
  if (config) {
    const splash = config.steps.find((s) => s.type === "splash") as
      | SplashStepConfig
      | undefined;
    const branding = config.branding;
    const bgGradient = branding.colors.dark.bgGradient;
    const orbs = branding.auroraOrbs;
    const gradientWordCSS = branding.gradientWord;
    const ctaGradient = branding.ctaGradient;
    const ctaText = branding.ctaTextColor;
    const title = splash?.title ?? name;
    const gradientWord = splash?.gradientWord ?? "";
    const subtitle = splash?.subtitle ?? "";
    const buttonText = splash?.buttonText ?? "Tap to Begin";
    const titleParts = title.split("\n");
    const logoSrc = branding.logo.dark || instance?.logo;

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
            background: bgGradient,
            fontFamily: "Inter, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {orbs && (
            <>
              <div
                style={{
                  position: "absolute",
                  top: -200,
                  left: -160,
                  width: 720,
                  height: 720,
                  borderRadius: "50%",
                  background: orbs.orb1,
                  filter: "blur(110px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -180,
                  right: -120,
                  width: 640,
                  height: 640,
                  borderRadius: "50%",
                  background: orbs.orb2,
                  filter: "blur(100px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 120,
                  right: 80,
                  width: 380,
                  height: 380,
                  borderRadius: "50%",
                  background: orbs.orb3,
                  filter: "blur(90px)",
                }}
              />
            </>
          )}

          {logoSrc && (
            <img
              src={`https://www.momentifyapp.com${logoSrc}`}
              width={64}
              height={64}
              style={{
                borderRadius: 14,
                marginBottom: 28,
                objectFit: "contain",
                opacity: 0.95,
              }}
            />
          )}

          <div
            style={{
              fontSize: 76,
              fontWeight: 500,
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1040,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {titleParts.map((part, i) => (
              <span key={i} style={{ display: "flex" }}>
                {part}
              </span>
            ))}
            {gradientWord && (
              <span
                style={{
                  background: gradientWordCSS,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  display: "flex",
                }}
              >
                {gradientWord}
              </span>
            )}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 300,
                color: "rgba(255,255,255,0.65)",
                textAlign: "center",
                lineHeight: 1.4,
                maxWidth: 880,
                marginTop: 28,
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}

          {buttonText && (
            <div
              style={{
                marginTop: 36,
                padding: "16px 32px",
                borderRadius: 999,
                background: ctaGradient,
                color: ctaText,
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: "0.02em",
                display: "flex",
              }}
            >
              {buttonText}
            </div>
          )}

          <div
            style={{
              position: "absolute",
              bottom: 32,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                background: accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="13"
                height="13"
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
                fontSize: 14,
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.04em",
              }}
            >
              {company}
              {industry ? ` · ${industry}` : ""} · Powered by Momentify
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

  // Fallback for static-HTML instances without a config: original generic card.
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
