import { PublicShell } from "@/components/PublicShell";
import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { About } from "@/components/landing/About";
import { Categories } from "@/components/landing/Categories";
import { Featured, B2BCallout } from "@/components/landing/Featured";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export default function HomePage() {
  return (
    <PublicShell>
      <main>
      <Hero />
      <Services />
      <About />
      <Categories />
      <Featured />
      <B2BCallout />
      <WhatsAppFloat context="general" />
    </main>
    </PublicShell>
  );
}
