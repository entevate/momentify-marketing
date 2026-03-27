"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { instances } from "../instances";
import { useSessionTracker } from "../use-session-tracker";

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

  useSessionTracker(slug, authorized);

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
          {(instance.gateLogo || instance.logo) && (
            <img
              src={instance.gateLogo || instance.logo}
              alt={instance.company}
              style={{
                display: "block",
                maxWidth: 180,
                maxHeight: 64,
                objectFit: "contain",
                margin: "0 auto 16px",
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

  if (instance.bezel === "dual-iphone-ipad") {
    return <DualBezel src={instance.prototypeFile} />;
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

function DualBezel({ src }: { src: string }) {
  const [scale, setScale] = useState(1);
  const ipadW = 1398;
  const ipadH = 1056;
  const phoneW = 430;
  const phoneH = 932;
  const gap = 48;
  const totalW = ipadW + gap + phoneW;
  const totalH = Math.max(ipadH, phoneH);

  useEffect(() => {
    function resize() {
      const w = window.innerWidth - 80;
      const h = window.innerHeight - 100;
      const sx = w / totalW;
      const sy = h / totalH;
      setScale(Math.min(sx, sy, 1));
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [totalW, totalH]);

  // Relay all sync messages between iframes
  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      const syncTypes = ["goToStep", "selectAnswer", "selectLocation", "syncForm"];
      if (e.data && syncTypes.includes(e.data.type)) {
        const ipadFrame = document.getElementById("dual-ipad-frame") as HTMLIFrameElement;
        const phoneFrame = document.getElementById("dual-phone-frame") as HTMLIFrameElement;
        [ipadFrame, phoneFrame].forEach((frame) => {
          if (frame?.contentWindow && e.source !== frame.contentWindow) {
            frame.contentWindow.postMessage(e.data, "*");
          }
        });
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: gap * scale,
        }}
      >
        {/* iPhone Pro bezel */}
        <div
          style={{
            width: phoneW * scale,
            height: phoneH * scale,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: phoneW,
              height: phoneH,
              background: "#1a1a1a",
              borderRadius: 50,
              border: "1.5px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03), 0 30px 100px rgba(0,0,0,0.65), 0 6px 24px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.08)",
              padding: 14,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Dynamic Island */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 34,
                background: "#000",
                borderRadius: 20,
                zIndex: 10,
              }}
            />
            <div
              style={{
                width: 402,
                height: 904,
                borderRadius: 38,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <iframe
                id="dual-phone-frame"
                src={src}
                style={{
                  width: 402,
                  height: 904,
                  border: "none",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div>

        {/* iPad Pro 12.9" landscape bezel */}
        <div
          style={{
            width: ipadW * scale,
            height: ipadH * scale,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "relative",
              width: ipadW,
              height: ipadH,
              background: "#1a1a1a",
              borderRadius: 22,
              border: "1.5px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.03), 0 30px 100px rgba(0,0,0,0.65), 0 6px 24px rgba(0,0,0,0.4), inset 0 0.5px 0 rgba(255,255,255,0.08)",
              padding: 16,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Camera dot */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: 5,
                transform: "translateY(-50%)",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#1e1e1e",
                border: "0.5px solid rgba(255,255,255,0.06)",
              }}
            />
            <div
              style={{
                width: 1366,
                height: 1024,
                borderRadius: 6,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <iframe
                id="dual-ipad-frame"
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
          marginTop: 12,
          flexShrink: 0,
        }}
      >
        Mustang CAT Open Interview &mdash; iPhone Pro &amp; iPad Pro 12.9&quot;
      </div>
    </div>
  );
}

function IPadBezel({ src }: { src: string }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function resize() {
      const w = window.innerWidth;
      const h = window.innerHeight - 48;
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
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#000E1F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 1398 * scale,
          height: 1056 * scale,
          flexShrink: 0,
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
            transformOrigin: "top left",
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
      </div>
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
          textAlign: "center",
          fontFamily: "'Inter', sans-serif",
          marginTop: 12,
          flexShrink: 0,
        }}
      >
        Prototype preview &mdash; best viewed in landscape on desktop
      </div>
    </div>
  );
}
