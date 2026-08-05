"use client";
import React from "react";

interface FormWrapperProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}

export default function FormWrapper({
  onSubmit,
  children,
  ...props
}: FormWrapperProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" {...props}>
      {children}
    </form>
  );
}
