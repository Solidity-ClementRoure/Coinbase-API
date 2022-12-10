import React, { FC, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  sizeClass?: string;
}

const Select: FC<SelectProps> = ({
  className = "",
  sizeClass = "h-11",
  children,
  ...args
}) => {
  return (
    <select
      className={`nc-Select ${sizeClass} ${className} h-10 w-20 px-1 text-xl font-semibold text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
      {...args}
    >
      {children}
    </select>
  );
};

export default Select;