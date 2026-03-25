import { NextRequest, NextResponse } from "next/server";

// European country codes (EU + EEA)
const EUROPEAN_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "NO", "IS", "LI", "CH",
]);

interface PricingConfig {
  currency: string;
  symbol: string;
  symbolAfter: boolean;
  starter: number;
  pro: number;
  lifetime: number;
}

const PRICING: Record<string, PricingConfig> = {
  SEK: { currency: "SEK", symbol: "kr", symbolAfter: true, starter: 99, pro: 199, lifetime: 1499 },
  EUR: { currency: "EUR", symbol: "€", symbolAfter: false, starter: 9, pro: 19, lifetime: 149 },
  USD: { currency: "USD", symbol: "$", symbolAfter: false, starter: 9, pro: 19, lifetime: 149 },
};

export async function GET(req: NextRequest) {
  // Try Vercel/Cloudflare geo headers first
  const country =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    "";

  let pricing: PricingConfig;

  if (country === "SE") {
    pricing = PRICING.SEK;
  } else if (EUROPEAN_COUNTRIES.has(country)) {
    pricing = PRICING.EUR;
  } else {
    pricing = PRICING.USD;
  }

  return NextResponse.json({ country, ...pricing });
}
