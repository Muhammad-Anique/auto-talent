import { Check } from "lucide-react";
// import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { AuthDialog } from "@/components/auth/auth-dialog";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  gradient: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Self-host or use with your own API keys",
    gradient: "from-[#5b6949]/80 to-[#5b6949]/80",
    features: [
      { text: "Use your own API keys", included: true },
      { text: "2 base resumes", included: true },
      { text: "5 tailored resumes", included: true },
      { text: "Self-host option available", included: true },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$20",
    description: "Enhanced features for serious job seekers",
    gradient: "from-[#5b6949]/80 to-yellow-500/80",
    popular: true,
    features: [
      { text: "Access to all premium AI models", included: true },
      { text: "Unlimited base resumes", included: true },
      { text: "Unlimited tailored resumes", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced analytics", included: true },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Enterprise",
    price: "$50",
    description: "For teams and organizations",
    gradient: "from-yellow-500/80 to-orange-500/80",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Team collaboration", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated support", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: true },
    ],
    buttonText: "Contact Sales",
  },
];

export function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5b6949]/10 text-[#5b6949] px-4 py-2 rounded-full text-sm font-medium mb-6">
            💰 Simple, Transparent Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose your
            <span className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] bg-clip-text text-transparent">
              {" "}
              perfect plan
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core
            features with no hidden fees.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group",
                tier.popular && "lg:scale-105 lg:-mt-4 z-10"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "h-full rounded-2xl p-8 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2",
                  tier.popular
                    ? "bg-white border-2 border-[#5b6949]/30 shadow-xl"
                    : "bg-white/80 backdrop-blur-sm border border-gray-200 hover:border-gray-300"
                )}
              >
                {/* Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    {tier.price !== "$0" && (
                      <span className="text-gray-500 ml-2">/month</span>
                    )}
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5",
                          feature.included
                            ? "bg-gradient-to-r from-[#5b6949] to-[#5b6949]"
                            : "bg-gray-200"
                        )}
                      >
                        <Check
                          className={cn(
                            "w-3 h-3",
                            feature.included ? "text-white" : "text-gray-400"
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          feature.included ? "text-gray-700" : "text-gray-400"
                        )}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300",
                    tier.popular
                      ? "bg-gradient-to-r from-[#5b6949] to-[#5b6949] text-white hover:from-[#5b6949]/90 hover:to-[#5b6949]/90 shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  )}
                >
                  {tier.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
