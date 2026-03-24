"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams, notFound } from "next/navigation";
import { instances } from "../instances";

export default function ExplorerInstancePage() {
  const params = useParams();
  const router = useRouter();
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
          background: "#0a0a0a",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 360, padding: "0 24px" }}>
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
