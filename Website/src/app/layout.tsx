import type { Metadata } from "next";
import { Inter, Archivo, Manrope, Space_Grotesk, Syne } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-archivo",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL("https://momentifyapp.com"),
  title: {
    default: "Momentify | Empower Every Moment",
    template: "%s | Momentify",
  },
  description:
    "Stop paying for moments you cannot measure. Momentify captures and scores every in-person interaction with ROX (Return on Experience) across trade shows, recruiting events, field sales, facilities, and venues.",
  keywords: [
    "Momentify",
    "Momentify platform",
    "ROX",
    "return on experience",
    "ROX score",
    "ROX calculator",
    "in-person engagement platform",
    "event engagement software",
    "trade show lead capture",
    "event ROI measurement",
    "badge scanning alternative",
    "event analytics platform",
    "lead capture and scoring",
    "event follow-up automation",
    "field sales enablement software",
    "recruiting event technology",
    "facility visitor tracking",
    "venue engagement analytics",
  ],
  authors: [{ name: "Momentify" }],
  creator: "Momentify",
  publisher: "Momentify",
  icons: {
    icon: "/Momentify-Icon.svg",
    apple: "/Momentify-Icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://momentifyapp.com",
    siteName: "Momentify",
    title: "Momentify | Empower Every Moment",
    description:
      "Stop paying for moments you cannot measure. Momentify captures engagement at trade shows, recruiting events, field sales, and more.",
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "Momentify - Empower Every Moment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Momentify | Empower Every Moment",
    description:
      "Stop paying for moments you cannot measure. Momentify captures engagement at trade shows, recruiting events, field sales, and more.",
    images: ["/og/og-default.png"],
    creator: "@mymomentify",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://momentifyapp.com",
  },
};

/* JSON-LD structured data for rich search results */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://momentifyapp.com/#organization",
      name: "Momentify",
      url: "https://momentifyapp.com",
      logo: {
        "@type": "ImageObject",
        url: "https://momentifyapp.com/Momentify-Icon.svg",
      },
      sameAs: [
        "https://linkedin.com/company/mymomentify",
        "https://instagram.com/mymomentify",
        "https://x.com/mymomentify",
      ],
      description:
        "Momentify is the operating system for in-person engagement. Capture, score, and convert every interaction at trade shows, recruiting events, field sales, and facilities with ROX (Return on Experience) scoring.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        url: "https://momentifyapp.com/demo",
      },
      knowsAbout: [
        "Return on Experience (ROX)",
        "ROX scoring methodology",
        "trade show lead capture and analytics",
        "event engagement measurement",
        "in-person interaction scoring",
        "technical recruiting event technology",
        "field sales enablement",
        "facility visitor engagement tracking",
        "venue and event sponsor analytics",
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://momentifyapp.com/#software",
      name: "Momentify",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Event Engagement Platform",
      operatingSystem: "Web, iOS, Android",
      description:
        "Enterprise engagement platform that captures, scores, and converts in-person interactions using ROX (Return on Experience) scoring across trade shows, recruiting events, field sales, facilities, and venues.",
      url: "https://momentifyapp.com",
      featureList: [
        "Lead capture with intent scoring",
        "ROX (Return on Experience) calculator",
        "Real-time engagement analytics",
        "CRM and ATS integrations",
        "Offline-capable mobile capture",
        "Persona-based content delivery",
        "Multi-event performance comparison",
        "Automated follow-up workflows",
        "Zone-level engagement tracking",
        "Sponsor attribution reporting",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Schedule a demo for personalized pricing",
        url: "https://momentifyapp.com/demo",
      },
      publisher: { "@id": "https://momentifyapp.com/#organization" },
    },
    {
      "@type": "WebSite",
      "@id": "https://momentifyapp.com/#website",
      name: "Momentify",
      url: "https://momentifyapp.com",
      publisher: { "@id": "https://momentifyapp.com/#organization" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${archivo.variable} ${manrope.variable} ${spaceGrotesk.variable} ${syne.variable}`}>
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        {/* Microsoft Clarity */}
        <Script id="clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vtsh499uhm");
          `}
        </Script>
      </head>
      <body className="font-[family-name:var(--font-inter)] antialiased">
        {children}
      </body>
    </html>
  );
}
