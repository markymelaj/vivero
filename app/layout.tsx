import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, address: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "PlantNursery",
              name: SITE.name,
              description: SITE.description,
              url: SITE.url,
              telephone: SITE.whatsapp.display,
              areaServed: { "@type": "City", name: "Gran Mendoza" },
              address: {
                "@type": "PostalAddress",
                addressLocality: "Maipú",
                addressRegion: "Mendoza",
                addressCountry: "AR",
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              sameAs: [SITE.instagram],
            }),
          }}
        />
      </head>
      <body className="font-sans"><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
