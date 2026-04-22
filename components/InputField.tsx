
import React from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name?: string;
  type?: 'text' | 'date' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  wrapperClassName?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, id, name, type = 'text', value, onChange, placeholder, wrapperClassName = "mb-4" }) => {
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default InputField;
