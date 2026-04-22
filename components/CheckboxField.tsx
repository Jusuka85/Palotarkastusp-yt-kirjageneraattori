
import React from 'react';

interface CheckboxFieldProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, id, checked, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-blue-600 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 block text-sm text-slate-900 dark:text-slate-200">
        {label}
      </label>
    </div>
  );
};

export default CheckboxField;
