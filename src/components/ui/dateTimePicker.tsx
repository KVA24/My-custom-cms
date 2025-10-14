'use client';

import React, {useMemo, useRef} from 'react';
import Flatpickr from 'react-flatpickr';
import {type Options} from 'flatpickr/dist/types/options';

import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/airbnb.css';
import {observer} from "mobx-react-lite";
import {format} from "date-fns";

interface DateTimePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  options?: Partial<Options>;
}

const DateTimePicker: React.FC<DateTimePickerProps> = observer(({
                                                                  value = null,
                                                                  onChange,
                                                                  placeholder = 'Select date & time',
                                                                  className,
                                                                  options,
                                                                }) => {
  const fpRef = useRef<any>(null);
  
  const defaultOptions: Partial<Options> = useMemo(() => (
    {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      time_24hr: true,
      closeOnSelect: false,
      clickOpens: true,
      ...options,
    }
  ), []);
  
  return (
    <div className="w-full">
      <Flatpickr
        ref={(node) => {
          if (node && node.flatpickr) {
            fpRef.current = node.flatpickr;
          }
        }}
        value={format(value ?? new Date(), "yyyy-MM-dd HH:mm") ?? undefined}
        options={defaultOptions}
        placeholder={placeholder}
        className={`w-full rounded-md border bg-white px-3 py-2 text-xs focus:border-primary focus:outline-0 ${className ?? ''}`}
        onChange={(dates) => {
          const d = dates.length > 0 ? dates[0] : null;
          onChange?.(d);
        }}
      />
    </div>
  );
});

export default DateTimePicker;
