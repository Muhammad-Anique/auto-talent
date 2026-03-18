import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Free",
    limits: {
      cv_download: 1,
      cover_letter_create: 1,
      follow_up_email: 1,
      questionnaire: 1,
      job_search: 1,
      agent_message: 10,
    },
  },
  starter: {
    name: "Starter",
    limits: {
      cv_download: 5,
      cover_letter_create: 5,
      follow_up_email: 5,
      questionnaire: 5,
      job_search: 10,
      agent_message: 50,
    },
  },
  pro: {
    name: "Pro",
    limits: {
      cv_download: Infinity,
      cover_letter_create: Infinity,
      follow_up_email: Infinity,
      questionnaire: Infinity,
      job_search: Infinity,
      agent_message: Infinity,
    },
  },
  lifetime: {
    name: "Lifetime",
    limits: {
      cv_download: Infinity,
      cover_letter_create: Infinity,
      follow_up_email: Infinity,
      questionnaire: Infinity,
      job_search: Infinity,
      agent_message: Infinity,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
export type ActionType = keyof typeof PLANS.free.limits;
