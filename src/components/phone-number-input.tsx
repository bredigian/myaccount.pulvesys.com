import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Input } from './ui/input';
import Image from 'next/image';
import argentinaFlag from '@/assets/ar.svg';

interface Props {
  onChange: (value: string) => void;
  value: string;
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
      onChange={onChange}
      {...props}
      className='w-full pl-9 text-sm lg:text-base'
      placeholder='Nro. de teléfono'
    />
  </div>
);

export default function PhoneNumberInput({ value, onChange }: Props) {
  return (
    <div className='relative col-span-full flex h-fit items-center md:col-span-3 lg:col-span-4 xl:col-span-3'>
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
