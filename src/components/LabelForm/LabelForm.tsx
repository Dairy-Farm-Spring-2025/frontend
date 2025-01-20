import React from 'react';

interface LabelFormProps {
  className?: string;
  children: string | string[] | null | React.ReactElement | any;
}

const LabelForm = ({ children, className, ...props }: LabelFormProps) => {
  return (
    <p className={`text-base font-bold ${className}`} {...props}>
      {children}
    </p>
  );
};

export default LabelForm;
