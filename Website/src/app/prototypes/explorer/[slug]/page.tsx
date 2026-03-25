"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { instances } from "../instances";

export default function ExplorerInstancePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const instance = instances.find((i) => i.slug === slug);
  const [authorized, setAuthorized] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);

  useEffect(() => {
    if (!instance) return;
    if (!instance.password) {
      setAuthorized(true);
      return;
    }
    // Check query param ?pw=
    const qpw = searchParams.get("pw");
    if (qpw === instance.password) {
      sessionStorage.setItem(`proto-auth-${slug}`, "1");
      setAuthorized(true);
      return;
    }
    const key = `proto-auth-${slug}`;
    if (sessionStorage.getItem(key) === "1") {
      setAuthorized(true);
    }
  }, [slug, instance, searchParams]);

  useEffect(() => {
    if (!instance || !authorized) return;
    fetch("/api/prototypes/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug, instance, authorized]);

  if (!instance) {
    notFound();
  }

  function handleSubmit() {
    if (pwInput === instance!.password) {
      sessionStorage.setItem(`proto-auth-${slug}`, "1");
      setAuthorized(true);
      setPwError(false);
    } else {
      setPwError(true);
    }
  }

  // Password gate
  if (!authorized && instance.password) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: instance.bezel ? "#000E1F" : "#0a0a0a",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360, padding: "0 24px" }}>
          {instance.logo && (
            <img
              src={instance.logo}
              alt={instance.company}
              style={{
                width: 64,
                height: 64,
                objectFit: "contain",
                marginBottom: 16,
              }}
            />
          )}
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: instance.accentColor,
              marginBottom: 8,
            }}
          >
            {instance.company}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              color: "#fff",
              marginBottom: 24,
            }}
          >
            {instance.name}
          </div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            Enter password to continue
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="password"
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value);
                setPwError(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Password"
              autoFocus
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: 10,
                border: `1px solid ${pwError ? "#E5484D" : "rgba(255,255,255,0.12)"}`,
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: 15,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
            <button
              onClick={handleSubmit}
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                border: `1px solid ${instance.accentColor}`,
                background: "transparent",
                color: instance.accentColor,
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Enter
            </button>
          </div>
          {pwError && (
            <div
              style={{
                fontSize: 12,
                color: "#E5484D",
                marginTop: 8,
              }}
            >
              Incorrect password
            </div>
          )}
        </div>
      </div>
    );
  }

  if (instance.bezel === "ipad-landscape") {
    return <IPadBezel src={instance.prototypeFile} />;
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <iframe
        src={instance.prototypeFile}
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          background: "#0a0a0a",
        }}
        allow="fullscreen"
      />
    </div>
  );
}

function IPadBezel({ src }: { src: string }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight - 32;
      const sx = w / 1398;
      const sy = h / 1056;
      setScale(Math.min(sx, sy, 1));
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
        background: "#000E1F",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 1398,
          height: 1056,
          background: "#0a1628",
          borderRadius: 22,
          border: "1.5px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), 0 30px 100px rgba(0,0,0,0.65), 0 6px 24px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.08)",
          padding: 16,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Camera dot (landscape = right edge) */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 5,
            transform: "translateY(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#0a1628",
            border: "0.5px solid rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            width: 1366,
            height: 1024,
            borderRadius: 6,
            overflow: "hidden",
            background: "#000E1F",
          }}
        >
          <iframe
            src={src}
            style={{
              width: 1366,
              height: 1024,
              border: "none",
              display: "block",
            }}
          />
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        Prototype preview &mdash; best viewed in landscape on desktop
      </div>
    </div>
  );
}
