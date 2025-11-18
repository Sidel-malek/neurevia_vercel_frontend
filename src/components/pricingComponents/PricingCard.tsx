"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, X } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { PricingOption } from "@/types"

export default function PricingCard({
  title,
  description,
  price,
  period,
  features,
  negativeFeatures,
  buttonText,
  buttonLink,
  icon,
  highlighted,
  premium,
  isAlzheimer, // Nouveau prop pour savoir si Alzheimer est sélectionné
}: PricingOption & { isAlzheimer?: boolean }) { // Ajout du type pour le nouveau prop
  const [pricingPlan, setPricingPlan] = useState("monthly")
  const isLoggedIn = false // Remplace ça par ta logique d'authentification

  return (
    <Card
      className={`flex flex-col relative rounded-2xl overflow-hidden transition-all duration-300 gap-0 hover:shadow-xl hover:-translate-y-1 ${
        premium
          ? "bg-gradient-to-b from-slate-900 to-slate-800 border-0"
          : highlighted
            ? "border-2 border-blue-600"
            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
      }`}
    >
      {premium && (
        <Badge className="absolute top-0 right-0 text-white px-4 py-1 font-medium text-sm rounded-tl-lg rounded-br-lg rounded-tr-lg bg-amber-500 border-0">
          PREMIUM
        </Badge>
      )}

      <CardHeader className="flex flex-col gap-2 pt-6 px-6">
        <div className="flex items-center mb-3">
          {icon && (
            <div
              className={`mr-3 w-10 h-10 rounded-full flex items-center justify-center ${
                premium
                  ? "bg-amber-100/10"
                  : highlighted
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-slate-100 dark:bg-slate-700"
              }`}
            >
              <div
                className={`${
                  premium
                    ? "text-amber-500"
                    : highlighted
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {icon}
              </div>
            </div>
          )}

          <CardTitle
            className={`text-xl font-bold ${
              premium ? "text-white" : "text-slate-800 dark:text-white"
            }`}
          >
            {title}
          </CardTitle>
        </div>

        <p
          className={`text-sm ${
            premium ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {description}
        </p>

        <div className="mt-4 flex items-baseline">
          <span
            className={`text-4xl font-bold ${
              premium
                ? "text-white"
                : highlighted
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                  : "text-slate-800 dark:text-blue-600"
            }`}
          >
            {price}
          </span>
          {period && (
            <span
              className={`ml-2 text-sm ${
                premium ? "text-slate-400" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {period}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 py-4">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 group">
              <Check
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  premium ? "text-amber-500" : "text-emerald-500"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-200 ${
                  premium
                    ? "text-slate-300 group-hover:text-white"
                    : "text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}

          {negativeFeatures?.map((feature, index) => (
            <div key={index} className="flex items-start gap-2 group">
              <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <span
                className={`text-sm transition-colors duration-200 ${
                  premium
                    ? "text-slate-400 group-hover:text-slate-300"
                    : "text-slate-600 dark:text-slate-300 group-hover:text-slate-800 dark:group-hover:text-white"
                }`}
              >
                {feature}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="px-6 pb-6">
        <Link 
          href={
            isLoggedIn 
              ? buttonLink[0] 
              : isAlzheimer 
                ? buttonLink[1] 
                : buttonLink[2] || buttonLink[1] // Fallback si buttonLink[2] n'existe pas
          } 
          className="w-full"
        >
          <Button
            className={`w-full py-3 font-medium transition-all duration-300 ${
              premium
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : highlighted
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  : "border border-slate-300 dark:border-slate-600 bg-white dark:bg-transparent text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            <span className="relative z-10">{buttonText}</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}