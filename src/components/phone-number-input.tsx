import 'react-phone-number-input/style.css';

import Image from 'next/image';
import { Input } from './ui/input';
import PhoneInput from 'react-phone-number-input';
import argentinaFlag from '@/assets/ar.svg';
import { cn } from '@/lib/utils';

interface Props {
  onChange: (value: string) => void;
  value: string;
  className?: string;
}

const CustomInput = ({ value, onChange, ...props }: Props) => (
  <div className='relative flex w-full items-center'>
    <span className='absolute pl-2'>
      <Image
        src={argentinaFlag}
        alt='Argentina Country Code'
        quality={100}
        width={20}
        height={20}
        className='rounded-xl'
      />
    </span>
    <Input
      id='phone_number_input'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      {...props}
      className='w-full pl-9 text-sm lg:text-base'
      placeholder='Nro. de teléfono'
    />
  </div>
);

export default function PhoneNumberInput({
  value,
  onChange,
  className,
}: Props) {
  return (
    <div
      className={cn(
        'relative col-span-full flex h-fit items-center md:col-span-3 lg:col-span-4 xl:col-span-3',
        className,
      )}
    >
      <PhoneInput
        onChange={(val) => {
          if (!val) return;
          if (!value) {
            onChange('+54'.concat(val?.replace('+', '')?.toString() as string));
          } else onChange(val?.toString() || '+54');
        }}
        value={value}
        inputComponent={CustomInput}
        countrySelectComponent={() => null}
        countryCallingCodeEditable={false}
        countries={['AR']}
        international
        className='w-full'
      />
    </div>
  );
}
