import { CheckCircleIcon } from "lucide-react";
import React from "react";

interface Props {
  title?: string;
  description: string;
}

export const ToastSuccessMsg = ({ title, description }: Props) => {
  return (
    <div className="bg-[#318F41] text-white p-3 flex items-center space-x-4">
      <CheckCircleIcon color="#FFFFFF" size={36} />
      <span className="text-xl">{title}</span>
      <span>{description}</span>
    </div>
  );
};
