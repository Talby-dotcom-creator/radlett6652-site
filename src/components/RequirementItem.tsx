import React from "react";
import { CheckCircle } from "lucide-react";

interface RequirementItemProps {
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ text }) => {
  return (
    <li className="flex items-start space-x-3">
      <CheckCircle className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" />
      <span className="text-neutral-700 leading-relaxed">{text}</span>
    </li>
  );
};

export default RequirementItem;
