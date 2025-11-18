"use client";

import { useState} from "react";
import {Info} from "lucide-react";

type BiomarkerFieldProps = {
  fieldKey: string
  field: any
  value: any
  onChange: (key: string, val: any) => void
  styles: any
}

export function BiomarkerField({ fieldKey, field, value, onChange, styles }: BiomarkerFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      key={fieldKey}
      className="space-y-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-gray-100/60 dark:border-slate-600/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label className={`text-sm font-medium ${styles.textPrimaryStyle} block mb-2`}>
            {field.label}
          </label>
        </div>

        {/* Bouton tooltip */}
        {field.description && (
          <div className="relative ml-2">
            <button
              type="button"
              className="text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              aria-label="Information"
            >
              <Info className="h-4 w-4" />
            </button>

            {showTooltip && (
              <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                  <div className="font-medium mb-1">Description</div>
                  <p>{field.description}</p>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      {field.type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className={`w-full ${styles.inputBgStyle} rounded-md p-2 border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50`}
        >
          <option value="">Select...</option>
          {field.options?.map((option: any) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === "date" ? (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(fieldKey, e.target.value)}
          className={`w-full text-sm ${styles.inputBgStyle} rounded-md p-2 border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50`}
        />
      ) : (
        <input
          type="number"
          placeholder={
          field.range
            ? `${field.range}${field.unit ? " " + field.unit : ""}`
            : `Enter ${field.label.toLowerCase()}`
          }
          value={value || ""}
          onChange={(e) => onChange(fieldKey, Number.parseFloat(e.target.value) || "")}
          className={`w-full text-sm ${styles.inputBgStyle} rounded-md p-2 border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50`}
          min={field.range?.split("-")[0]}
          max={field.range?.split("-")[1]}
          step="1"
        />
      )}

      {/* Description visible en mobile */}
      <div className="md:hidden">
        {field.description && (
          <p className={`text-xs ${styles.textTertiaryStyle} mt-2 italic`}>
            {field.description}
          </p>
        )}
      </div>
    </div>
  )
}
