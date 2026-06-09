import { StaticImageData } from "next/image";

export type MenuItemType = {
    title: string;
    segment?: string;
    icon?: React.ReactNode | StaticImageData;
    children?: MenuItemType[];
    kind?: string;
    src?: string;
    createOption?: boolean;
    createSrc?: string;
  };
  