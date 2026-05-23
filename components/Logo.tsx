// Logo Paesaggio recreado en SVG basado en la marca original
// (icono circular + wordmark serif). El wordmark usa Fraunces.

type Props = {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
  color?: "dark" | "light";
};

export function Logo({ className, variant = "full", color = "dark" }: Props) {
  const stroke = color === "dark" ? "#1F3815" : "#F8F6F0";
  const fill = color === "dark" ? "#1F3815" : "#F8F6F0";

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 600,
          color: fill,
          letterSpacing: "-0.04em",
          fontFeatureSettings: '"ss01"',
        }}
      >
        paesaggio
      </span>
    );
  }

  const Mark = (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
      width="100%"
      height="100%"
    >
      {/* outer circle */}
      <circle cx="50" cy="50" r="42" fill="none" stroke={stroke} strokeWidth="6" />
      {/* central stem */}
      <line x1="50" y1="78" x2="50" y2="36" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
      {/* leaf veins from center outward */}
      <path d="M50 58 Q34 56 26 50" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 58 Q66 56 74 50" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 48 Q36 44 30 36" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 48 Q64 44 70 36" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* top crown */}
      <path d="M50 38 Q44 30 38 26" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M50 38 Q56 30 62 26" stroke={stroke} strokeWidth="5" fill="none" strokeLinecap="round" />
      <line x1="50" y1="36" x2="50" y2="24" stroke={stroke} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );

  if (variant === "mark") {
    return <span className={className}>{Mark}</span>;
  }

  // full: mark + wordmark side by side
  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ width: "1.8em", height: "1.8em" }}>{Mark}</span>
      <span
        style={{
          fontFamily: "var(--font-fraunces), Georgia, serif",
          fontWeight: 600,
          color: fill,
          letterSpacing: "-0.04em",
          fontSize: "inherit",
        }}
      >
        paesaggio
      </span>
    </span>
  );
}
