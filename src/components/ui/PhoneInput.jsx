import React, { useState } from "react";

const PhoneInput = ({ value, onChange, error, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleChange = (e) => {
    const val = e.target.value;

    // Remove non-digit characters
    const digitsOnly = val.replace(/\D/g, "");

    // Allow only 10 digits
    if (digitsOnly.length <= 10) {
      onChange(digitsOnly);
    }
  };

  return (
    <div>
      <div
        className={`flex border rounded-lg transition-all duration-300 ${
          error
            ? "border-red-500 ring-2 ring-red-200"
            : isFocused
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-200"
        }`}
      >
        {/* Country Code */}
        <div className="flex items-center justify-center px-3 bg-gray-50 border-r border-gray-200 rounded-l-lg text-gray-500">
          +91
        </div>

        {/* Phone Input */}
        <input
          type="number"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="9123456789"
          className="flex-1 min-w-0 w-full py-2.5 px-4 rounded-r-lg bg-gray-50 focus:outline-none"
          inputMode="numeric"
          pattern="[6-9]{1}[0-9]{9}"
          title="Please enter a valid 10-digit number"
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 transition-all duration-300">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
