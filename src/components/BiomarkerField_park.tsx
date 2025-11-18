"use client";

import { useState ,useEffect} from "react";
import {Info} from "lucide-react";

export function BiomarkerField({
  fieldKey,
  field,
  value,
  onChange,
  styles,
}: {
  fieldKey: string;
  field: any;
  value: any;
  onChange: (key: string, val: any) => void;
  styles: any;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  // Mettre à jour la valeur interne quand la prop value change
  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Convertir en nombre si c&apos;est un champ numérique
    if (field.type === "number") {
      const numValue = newValue === "" ? "" : Number.parseFloat(newValue);
      onChange(fieldKey, numValue);
    } else {
      onChange(fieldKey, newValue);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(fieldKey, e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(fieldKey, e.target.value);
  };

  return (
    <div
      key={fieldKey}
      className="space-y-2 p-4 bg-white/50 dark:bg-slate-700/50 rounded-lg border border-gray-100/60 dark:border-slate-600/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <label className={`text-sm font-medium ${styles.textPrimaryStyle} block mb-2`}>
            {field.label}
          </label>
        </div>

        {/* Tooltip button */}
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

          {showTooltip && field.description && (
            <div className="absolute z-10 left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-64">
              <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                <div className="font-medium mb-1">Description</div>
                <p>{field.description}</p>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      {field.type === "select" ? (
        <select
          value={value || ""}
          onChange={handleSelectChange}
          className={`w-full ${styles.inputBgStyle} rounded-lg  border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50 transition-colors`}
        >
          <option value="">Select an option...</option>
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
          onChange={handleDateChange}
          className={`w-full ${styles.inputBgStyle} rounded-lg p-2 border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50 transition-colors`}
        />
      ) : (
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full text-sm ${styles.inputBgStyle} rounded-lg p-2 border border-gray-200/60 dark:border-slate-500/60 focus:ring-2 focus:ring-blue-400/50 transition-colors`}
          placeholder={field.range ? `Range: ${field.range}` : 'Enter value...'}
          min={field.range?.split("-")[0]}
          max={field.range?.split("-")[1]}
          step="0.1"
        />
      )}

      {/* Mobile description */}
      <div className="md:hidden">
        {field.description && (
          <p className={`text-xs ${styles.textTertiaryStyle} mt-2 italic`}>{field.description}</p>
        )}
      </div>
    </div>
  );
}