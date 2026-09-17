"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function GTMLogin() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(false)
    setLoading(true)

    try {
      const res = await fetch("/api/gtm/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.success) {
        router.push("/gtm")
      } else {
        setError(true)
        setLoading(false)
      }
    } catch {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#061341",
        padding: 24,
      }}
    >
      <Image
        src="/Momentify-Logo_White.svg"
        alt="Momentify"
        width={180}
        height={36}
        style={{
          height: 36,
          width: "auto",
          marginBottom: 48,
        }}
        priority
      />

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          padding: 40,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "var(--gtm-text-primary)",
            margin: 0,
          }}
        >
          Team Access
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
            fontSize: 14,
            color: "var(--gtm-text-muted)",
            margin: "8px 0 24px",
          }}
        >
          Internal use only.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            width: "100%",
            border: "1px solid var(--gtm-border-strong)",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 15,
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 200ms ease",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "var(--gtm-cyan)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--gtm-border-strong)")
          }
        />

        {error && (
          <p
            style={{
              color: "var(--gtm-danger-text)",
              fontSize: 13,
              fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
              margin: "8px 0 0",
            }}
          >
            Incorrect password. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 44,
            marginTop: 16,
            background: "var(--gtm-grad-action)",
            borderRadius: 9999,
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "var(--font-inter), 'Inter', system-ui, sans-serif",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}
