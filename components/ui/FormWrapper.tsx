"use client";
export default function FormWrapper({ onSubmit, children, ...props }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left" {...props}>
      {children}
    </form>
  );
}
