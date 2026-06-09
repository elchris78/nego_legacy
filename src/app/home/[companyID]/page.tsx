"use client";

import { Box } from "@mui/material";
import dashboard from "@/assets/dashboardfalso.png";
import Image from "next/image";

export default function HomePage() {


  return (
    <div className="min-h-screen flex flex-col">
      <>
        <Box width={'100%'}>
          <Image src={dashboard} alt="Dashboard"style={{width:'100%', height:'auto'}} />
        </Box>
      </>
    </div>
  );
}
