'use client'
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { pricingOptions } from "@/lib/data/dataPricing";
import PricingCard from "./PricingCard";

interface PricingSwitcherProps {
  diseaseType: "alzheimer" | "parkinson" | null;
}

export const PricingSwitcher = ({ diseaseType }: PricingSwitcherProps) => {
  const [pricingPlan, setPricingPlan] = useState<"monthly" | "yearly">("monthly");

  return (
    <div>
      {/* Pricing toggle */}
      <Tabs
        defaultValue="monthly"
        value={pricingPlan}
        onValueChange={(value) => {
          if (value === 'monthly' || value === 'yearly') {
            setPricingPlan(value);
          }
        }}
        className="w-full mb-16"
      >
        <div className="relative max-w-md mx-auto">
          <TabsList className="grid w-52 grid-cols-2 bg-white p-1 relative text-brand-dark rounded-full mx-auto shadow-sm">
            {["monthly", "yearly"].map((plan) => (
              <TabsTrigger
                key={plan}
                value={plan}
                className="data-[state=active]:bg-brand-dark data-[state=active]:text-white relative z-10 rounded-full transition-all duration-300"
              >
                <span className="relative z-10 capitalize">{plan}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={pricingPlan} className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingOptions[pricingPlan].map((option) => (
              <PricingCard 
                key={option.title} 
                {...option} 
                isAlzheimer={diseaseType === "alzheimer"}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PricingSwitcher;