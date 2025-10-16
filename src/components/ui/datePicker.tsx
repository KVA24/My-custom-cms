import {format} from "date-fns";
import {CalendarDays} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {cn} from "@/lib/utils";
import * as React from "react";

interface DatePickerInputProps {
  value?: Date | null;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
                                                           value,
                                                           onChange,
                                                           placeholder = "Pick a date",
                                                           id = "date",
                                                           className,
                                                         }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          mode="input"
          variant="outline"
          id={id}
          className={cn(
            "w-full data-[state=open]:border-primary text-foreground",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarDays className="-ms-0.5"/>
          {value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="single"
          defaultMonth={value || new Date()}
          selected={value || undefined}
          onSelect={onChange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerInput;
