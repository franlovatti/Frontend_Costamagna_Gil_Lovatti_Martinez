type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

export function InputField({type, placeholder, value, onChange, required}: InputProps) {
  return (
    <input
              type={type}
              className="form-control"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              required={required}
            />
  )
}