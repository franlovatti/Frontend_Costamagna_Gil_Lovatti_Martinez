import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  type: string;
  placeholder: string;
};

export function InputField({ type, placeholder, ...rest }: InputProps) {
  return (
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      {...rest}
    />
  );
}