import React from "react";

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string; // Add className prop
};

const TextField: React.FC<TextFieldProps> = ({ label, placeholder, value, onChange, className }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} // Apply className
      />
    </div>
  );
};

export default TextField;