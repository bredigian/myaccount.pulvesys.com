import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

import { Button } from './ui/button';
import { HexColorPicker } from 'react-colorful';
import { useState } from 'react';

interface Props {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: Props) {
  const [open, toggle] = useState(false);

  return (
    <Popover open={open} onOpenChange={toggle}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          className='size-full'
          style={{ backgroundColor: color }}
        ></Button>
      </PopoverTrigger>
      <PopoverContent
        className='z-[99999] mt-1 w-full p-0'
        align='end'
        side='bottom'
      >
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
}
