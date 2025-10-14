'use client';

import * as React from 'react';
import {Eye, EyeOff} from 'lucide-react';
import {Input} from '@/components/ui/input';

export function InputPassword({
                                name = 'password',
                                placeholder = 'Nhập mật khẩu',
                                ...props
                              }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = React.useState(false);
  
  return (
    <div className="relative">
      <Input
                  autoComplete="off"
        {...props}
        name={name}
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        tabIndex={-1}
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-3 top-4.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}
      </button>
    </div>
  );
}
