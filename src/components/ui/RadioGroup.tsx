"use client"
import {cn} from "@/lib/utils"

export interface RadioOption {
  value: string
  label: string
}

export interface RadioGroupProps {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  name: string
  className?: string
  disabled?: boolean
}

const RadioGroup = ({options, value, onChange, name, className, disabled}: RadioGroupProps) => {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className={cn("text-sm font-medium cursor-pointer", disabled && "cursor-not-allowed opacity-50")}
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  )
}

export {RadioGroup}
