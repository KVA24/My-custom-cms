'use client';

import * as React from 'react';
import {Button} from './button.tsx';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu.tsx';

interface BaseOption {
  label: string;
  value: string;
}

interface OptionGroup<T extends BaseOption> {
  groupName: string;
  options: T[];
}

type Options<T extends BaseOption> = T[] | OptionGroup<T>[];

interface MultiSelectProps<T extends BaseOption> {
  label?: string;
  options: Options<T>;
  value: T[];
  onChange: (value: T[]) => void;
  placeholder?: string;
}

export function DropdownMenuMultiSelect<T extends BaseOption>({
                                                                label,
                                                                options,
                                                                value,
                                                                onChange,
                                                                placeholder = 'Select items',
                                                              }: MultiSelectProps<T>) {
  const toggleValue = (opt: T) => {
    if (value.some((v) => v.value === opt.value)) {
      onChange(value.filter((v) => v.value !== opt.value));
    } else {
      onChange([...value, opt]);
    }
  };
  
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const measureRef = React.useRef<HTMLSpanElement | null>(null);
  const [width, setWidth] = React.useState<number>();
  const [isOverflow, setIsOverflow] = React.useState(false);
  
  React.useEffect(() => {
    if (triggerRef.current) {
      setWidth(triggerRef.current.offsetWidth);
    }
  }, [triggerRef.current]);
  
  React.useEffect(() => {
    if (measureRef.current && width) {
      setIsOverflow(measureRef.current.scrollWidth > width - 32);
    }
  }, [value, width]);
  
  const selectedLabels = value.map((opt) => opt.label).join(', ');
  
  const renderOptions = () => {
    // check nếu có groupName thì xử lý theo group
    if (options.length > 0 && 'groupName' in (options[0] as any)) {
      return (options as OptionGroup<T>[]).map((group, gi) => (
        <React.Fragment key={gi}>
          <DropdownMenuLabel>{group.groupName}</DropdownMenuLabel>
          {group.options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={value.some((v) => v.value === option.value)}
              onCheckedChange={() => toggleValue(option)}
              onSelect={(e) => e.preventDefault()}
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}
          {gi < options.length - 1 && <DropdownMenuSeparator/>}
        </React.Fragment>
      ));
    }
    
    // nếu không có groupName thì hiển thị list thường
    return (options as T[]).map((option) => (
      <DropdownMenuCheckboxItem
        key={option.value}
        checked={value.some((v) => v.value === option.value)}
        onCheckedChange={() => toggleValue(option)}
        onSelect={(e) => e.preventDefault()}
      >
        {option.label}
      </DropdownMenuCheckboxItem>
    ));
  };
  
  return (
    <div className="w-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            className="w-full justify-between overflow-hidden"
          >
            <span className="truncate">
              {value.length > 0
                ? isOverflow
                  ? `${value.length} selected`
                  : selectedLabels
                : placeholder}
            </span>
            <span
              ref={measureRef}
              className="absolute invisible whitespace-nowrap"
            >
              {selectedLabels}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{width}}>
          {label && (
            <>
              <DropdownMenuLabel>{label}</DropdownMenuLabel>
              <DropdownMenuSeparator/>
            </>
          )}
          {renderOptions()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
