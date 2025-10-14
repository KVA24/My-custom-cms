import React, {useState} from "react"
import {DateRange} from "react-day-picker"
import {format} from "date-fns"
import {CalendarDays, X} from "lucide-react"

import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"

interface DateRangePickerProps {
  start?: Date
  end?: Date
  onApply?: (range: DateRange | undefined) => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({start, end, onApply}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
    start || end ? {from: start, to: end} : undefined,
  )
  
  const handleApply = () => {
    setIsOpen(false)
    onApply?.(tempDateRange)
  }
  
  const handleResetTemp = () => {
    setTempDateRange(undefined)
  }
  
  const handleReset = () => {
    setTempDateRange(undefined)
    onApply?.(undefined)
  }
  
  const displayRange = start || end ? {from: start, to: end} : undefined
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button id="date" variant="outline" className="w-full">
          <CalendarDays size={16} className="me-0.5"/>
          {displayRange?.from ? (
            displayRange.to ? (
              <>
                {format(displayRange.from, "dd/MM/yyyy")} - {format(displayRange.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(displayRange.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Pick a date range</span>
          )}
          {displayRange && (
            <X
              size={16}
              onClick={(e) => {
                e.stopPropagation()
                console.log('Clicked on X')
                handleReset()
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={tempDateRange?.from}
          selected={tempDateRange}
          onSelect={setTempDateRange}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
          <Button variant="outline" onClick={handleResetTemp}>
            Reset
          </Button>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateRangePicker
