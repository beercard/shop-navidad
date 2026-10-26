/**
 * Typed, replaceable campaign themes for each participating shopping.
 * Colors are campaign interface approximations, not verified corporate colors.
 * Official logo files were not present in the repository at audit time.
 */

export type ShoppingBrandId = "centenario" | "uniplaza";

export type BrandTheme = {
  id: ShoppingBrandId;
  name: string;
  shortName: string;
  logo: {
    src: string | null;
    lightSrc: string | null;
    alt: string;
    /** Text fallback until an approved official asset is supplied. */
    wordmark: string;
  };
  fonts: {
    display: string;
    body: string;
    utility: string;
  };
  colors: {
    /** Campaign palette approximation; replace after receiving brand guidelines. */
    primary: string;
    primaryStrong: string;
    accent: string;
    accentSoft: string;
    surface: string;
    surfaceRaised: string;
    text: string;
    textMuted: string;
    border: string;
    focus: string;
    success: string;
    danger: string;
    onPrimary: string;
  };
  shape: {
    radiusSmall: string;
    radiusCard: string;
    radiusPill: string;
    shadowCard: string;
    shadowPopover: string;
    contentMax: string;
  };
  campaign: {
    /** Use approved shopping photography when supplied; null avoids fake brand assets. */
    heroImage: string | null;
    /** Christmas accents belong to the shared campaign, not the corporate logo. */
    seasonalMotif: "star-and-ribbon" | "open-air-lights";
    tone: string;
    /** Campaign-specific art direction tokens. These are approximations, not official brand colors. */
    palette: {
      deep: string;
      field: string;
      fieldRaised: string;
      accent: string;
      accentStrong: string;
      festive: string;
      soft: string;
      line: string;
      ink: string;
      wheelA: string;
      wheelB: string;
    };
  };
  experience: {
    navInstructions: string;
    navPrizes: string;
    heroEyebrow: string;
    heroTitle: string;
    heroEmphasis: string;
    heroMessage: string;
    primaryAction: string;
    howTitle: string;
    howEmphasis: string;
    howDescription: string;
    prizeTitle: string;
    prizeEmphasis: string;
    prizeDescription: string;
  };
};

/**
 * Theme values below are deliberately campaign-level design directions.
 * They are not assertions about either shopping's official color specification.
 */
export const shoppingBrands: Record<ShoppingBrandId, BrandTheme> = {
  centenario: {
    id: "centenario",
    name: "Centenario Shopping",
    shortName: "Centenario",
    logo: {
      src: "/brand/centenario-logo.png",
      lightSrc: null,
      alt: "Centenario Shopping",
      wordmark: "CENTENARIO SHOPPING",
    },
    fonts: {
      display: 'var(--font-playfair), "Playfair Display", Georgia, serif',
      body: 'var(--font-dm-sans), "DM Sans", Arial, sans-serif',
      utility: 'var(--font-dm-mono), "DM Mono", ui-monospace, monospace',
    },
    colors: {
      primary: "#315D4B",
      primaryStrong: "#203F34",
      accent: "#B94F43",
      accentSoft: "#F3E6D1",
      surface: "#F8F5ED",
      surfaceRaised: "#FFFDF8",
      text: "#203A31",
      textMuted: "#5F6D66",
      border: "#DFE2D8",
      focus: "#A86E28",
      success: "#287450",
      danger: "#A63F37",
      onPrimary: "#FFFDF8",
    },
    shape: {
      radiusSmall: "0.25rem",
      radiusCard: "0.5rem",
      radiusPill: "999px",
      shadowCard: "0 12px 34px rgb(32 58 49 / 9%)",
      shadowPopover: "0 20px 56px rgb(19 41 32 / 18%)",
      contentMax: "76rem",
    },
    campaign: {
      heroImage: null,
      seasonalMotif: "star-and-ribbon",
      tone: "Cálido y familiar: el primer shopping de Corrientes, para disfrutar con familia y amigos.",
      palette: { deep: "#102C22", field: "#17382B", fieldRaised: "#FAF5EC", accent: "#A34832", accentStrong: "#18382B", festive: "#D4AD68", soft: "#F1E4D2", line: "#BD9C61", ink: "#18382B", wheelA: "#A34832", wheelB: "#17382B" },
    },
    experience: {
      navInstructions: "Cómo jugar",
      navPrizes: "Regalos",
      heroEyebrow: "NAVIDAD EN CENTENARIO",
      heroTitle: "Esta Navidad,",
      heroEmphasis: "vivila en Centenario.",
      heroMessage: "Cines, comidas, juegos y tus locales de siempre. Encontrá las postas navideñas y girá por regalos para disfrutar en familia.",
      primaryAction: "Encontré una posta",
      howTitle: "Recorré, encontrá",
      howEmphasis: "y ganá.",
      howDescription: "Seguí las pistas por el shopping, escaneá cada posta y participá por regalos de Centenario Shopping.",
      prizeTitle: "Regalos para",
      prizeEmphasis: "disfrutar en familia.",
      prizeDescription: "Los premios y su disponibilidad se confirman para la campaña de Centenario.",
    },
  },
  uniplaza: {
    id: "uniplaza",
    name: "UniPlaza Shopping",
    shortName: "UniPlaza",
    logo: {
      src: "/brand/uniplaza-logo.png",
      lightSrc: null,
      alt: "UniPlaza Shopping",
      wordmark: "UniPlaza Shopping",
    },
    fonts: {
      display: 'var(--font-dm-sans), "DM Sans", Arial, sans-serif',
      body: 'var(--font-dm-sans), "DM Sans", Arial, sans-serif',
      utility: 'var(--font-dm-mono), "DM Mono", ui-monospace, monospace',
    },
    colors: {
      primary: "#315C70",
      primaryStrong: "#203E4D",
      accent: "#93572F",
      accentSoft: "#E9EEF0",
      surface: "#F5F7F6",
      surfaceRaised: "#FFFFFF",
      text: "#243A42",
      textMuted: "#5D6C70",
      border: "#DCE3E5",
      focus: "#9E5C2E",
      success: "#287450",
      danger: "#A63F37",
      onPrimary: "#FFFFFF",
    },
    shape: {
      radiusSmall: "0.25rem",
      radiusCard: "0.75rem",
      radiusPill: "999px",
      shadowCard: "0 14px 38px rgb(31 59 70 / 9%)",
      shadowPopover: "0 22px 60px rgb(24 48 56 / 17%)",
      contentMax: "80rem",
    },
    campaign: {
      heroImage: null,
      seasonalMotif: "open-air-lights",
      tone: "Urbano y moderno: el nuevo shopping de la ciudad, a cielo abierto en La Unidad.",
      palette: { deep: "#16303B", field: "#203E4D", fieldRaised: "#FFFFFF", accent: "#93572F", accentStrong: "#824A28", festive: "#E4C18B", soft: "#E6EFF1", line: "#B9D0D5", ink: "#243A42", wheelA: "#A25D32", wheelB: "#31778A" },
    },
    experience: {
      navInstructions: "Tu recorrido",
      navPrizes: "Premios",
      heroEyebrow: "NAVIDAD EN UNIPLAZA",
      heroTitle: "Esta Navidad,",
      heroEmphasis: "UniPlaza se vive.",
      heroMessage: "Moda, gastronomía y diversión a cielo abierto en La Unidad. Recorré las postas y descubrí qué sorpresa te espera.",
      primaryAction: "Tengo una posta",
      howTitle: "Siempre hay algo",
      howEmphasis: "por descubrir.",
      howDescription: "Recorré UniPlaza, escaneá cada posta y participá por premios de esta campaña.",
      prizeTitle: "Premios para",
      prizeEmphasis: "lo que amás.",
      prizeDescription: "La disponibilidad corresponde a la campaña activa de UniPlaza Shopping.",
    },
  },
};

export function getShoppingBrand(id: ShoppingBrandId): BrandTheme {
  return shoppingBrands[id];
}

/** Convert a theme into CSS custom properties for a shared component tree. */
export function brandCssVariables(brand: BrandTheme, overrides?: Record<string, unknown>): Record<`--brand-${string}`, string> {
  const variables: Record<`--brand-${string}`, string> = {
    "--brand-primary": brand.colors.primary,
    "--brand-primary-strong": brand.colors.primaryStrong,
    "--brand-accent": brand.colors.accent,
    "--brand-accent-soft": brand.colors.accentSoft,
    "--brand-surface": brand.colors.surface,
    "--brand-surface-raised": brand.colors.surfaceRaised,
    "--brand-text": brand.colors.text,
    "--brand-text-muted": brand.colors.textMuted,
    "--brand-border": brand.colors.border,
    "--brand-focus": brand.colors.focus,
    "--brand-success": brand.colors.success,
    "--brand-danger": brand.colors.danger,
    "--brand-on-primary": brand.colors.onPrimary,
    "--brand-font-display": brand.fonts.display,
    "--brand-font-body": brand.fonts.body,
    "--brand-font-utility": brand.fonts.utility,
    "--brand-radius-small": brand.shape.radiusSmall,
    "--brand-radius-card": brand.shape.radiusCard,
    "--brand-radius-pill": brand.shape.radiusPill,
    "--brand-shadow-card": brand.shape.shadowCard,
    "--brand-shadow-popover": brand.shape.shadowPopover,
    "--brand-content-max": brand.shape.contentMax,
    "--brand-campaign-deep": brand.campaign.palette.deep,
    "--brand-campaign-field": brand.campaign.palette.field,
    "--brand-campaign-field-raised": brand.campaign.palette.fieldRaised,
    "--brand-campaign-accent": brand.campaign.palette.accent,
    "--brand-campaign-accent-strong": brand.campaign.palette.accentStrong,
    "--brand-campaign-festive": brand.campaign.palette.festive,
    "--brand-campaign-soft": brand.campaign.palette.soft,
    "--brand-campaign-line": brand.campaign.palette.line,
    "--brand-campaign-ink": brand.campaign.palette.ink,
    "--brand-campaign-wheel-a": brand.campaign.palette.wheelA,
    "--brand-campaign-wheel-b": brand.campaign.palette.wheelB,
  };
  const tokens: Record<string, `--brand-${string}`> = { primary: "--brand-primary", accent: "--brand-accent", surface: "--brand-surface", text: "--brand-text" };
  for (const [key, token] of Object.entries(tokens)) {
    const value = overrides?.[key];
    if (typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value)) variables[token] = value;
  }
  if (overrides?.fontPreset === "urban") variables["--brand-font-display"] = 'var(--font-dm-sans), "DM Sans", Arial, sans-serif';
  if (overrides?.fontPreset === "classic") variables["--brand-font-display"] = 'var(--font-playfair), "Playfair Display", Georgia, serif';
  return variables;
}
