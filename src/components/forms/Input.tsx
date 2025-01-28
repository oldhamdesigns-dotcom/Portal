import { DetailedHTMLProps, InputHTMLAttributes, memo } from 'react';
import { cn } from '@utils/CN';

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  label?: string | undefined;
  containerClassName?: string | undefined;
};

const Input = ({ label, containerClassName = '', className = '', ...props }: InputProps) => {
  return (
    <div className={cn('flex w-full flex-col gap-2', containerClassName)}>
      {label ? <label className={'text-placeholder-2'}>{label}</label> : null}
      <input
        {...props}
        className={cn('w-full rounded-xl border border-gray p-2 outline-0', className)}
      />
    </div>
  );
};
export default memo(Input);
