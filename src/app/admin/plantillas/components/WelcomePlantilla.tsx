"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import Image from "next/image";
import InfoIcon from "@/assets/HelpCircle.png";
import Link from "next/link";

interface WelcomeProps {
  title: string;
  subtitle: string;
  textButton: string;
  showTooltip?: boolean; // Prop opcional para mostrar el Tooltip
  tooltipPlacement?: "start" | "end";
  pathDimamic: string;
}

export const WelcomePlantillas = ({
  title,
  subtitle,
  textButton,
  showTooltip = true,
  tooltipPlacement = "start",
  pathDimamic
}: WelcomeProps) => {
  return (
    <div className="bg-white min-h-[calc(100vh-header-height)] flex flex-col items-center justify-center gap-6 p-4">
      <div className="flex items-center space-x-2 mb-8 gap-2">
        {/* Flexbox para alinear el tooltip junto al título */}
        <div className={tooltipPlacement === "start" ? "order-0" : "order-1"}>
          {showTooltip && ( // Condicional para mostrar el Tooltip solo si `showTooltip` es true
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="flex items-center">
                  <span>
                    <Image
                      className="mt-2"
                      src={InfoIcon}
                      alt="Info"
                      width={18}
                      height={18}
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Crea tu primer plantilla</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div>
          <h1 className="text-[#3c98cb] text-4xl font-bold">{title}</h1>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <svg
          width="150"
          height="108"
          viewBox="0 0 150 108"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 105.669H110C116.627 105.669 122 100.296 122 93.6689V65L144.5 53.375L122 43.5V14C122 7.37258 116.627 2 110 2H14C7.37259 2 2 7.37258 2 14V93.6689C2 100.296 7.37259 105.669 14 105.669Z"
            stroke="#D05559"
            stroke-width="4"
          />
          <path
            d="M66.6562 43.1875V77H58.375V43.1875H66.6562ZM57.8125 34.3438C57.8125 33.1146 58.2292 32.0938 59.0625 31.2812C59.9167 30.4688 61.0625 30.0625 62.5 30.0625C63.9375 30.0625 65.0729 30.4688 65.9062 31.2812C66.7604 32.0938 67.1875 33.1146 67.1875 34.3438C67.1875 35.5521 66.7604 36.5625 65.9062 37.375C65.0729 38.1875 63.9375 38.5938 62.5 38.5938C61.0625 38.5938 59.9167 38.1875 59.0625 37.375C58.2292 36.5625 57.8125 35.5521 57.8125 34.3438Z"
            fill="#D05559"
          />
        </svg>

        <span
          className="text-slate-500 text-center mb-2 text-2xl"
          style={{ whiteSpace: "pre-line" }}
        >
          {subtitle}
          <span className="font-semibold text-slate-500 text-2xl">
            {textButton}.
          </span>
        </span>
      </div>

      <Link
        href={pathDimamic}
        className="bg-[#3c98cb] text-white px-6 py-3 mt-8 rounded-md flex items-center space-x-2 hover:bg-[#3188b8] transition duration-300"
        aria-label="Crear nueva plantilla"
      >
        <Plus size={24} />
        <span>{textButton}</span>
      </Link>
    </div>
  );
};
