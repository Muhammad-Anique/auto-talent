import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    limits: {
      cvDownloads: 1,
      coverLetterDownloads: 1,
      jobApplications: 10,
    },
  },
  pro: {
    name: "Pro",
    limits: {
      cvDownloads: Infinity,
      coverLetterDownloads: Infinity,
      jobApplications: Infinity,
    },
  },
  lifetime: {
    name: "Lifetime",
    limits: {
      cvDownloads: Infinity,
      coverLetterDownloads: Infinity,
      jobApplications: Infinity,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
