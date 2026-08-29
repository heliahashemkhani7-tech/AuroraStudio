import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: Props) {
  return (
    <div
      className={`w-full max-w-3xl mx-auto px-4 sm:max-w-7xl lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
}
