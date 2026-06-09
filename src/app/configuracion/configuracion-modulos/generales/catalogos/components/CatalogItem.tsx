"use client";
import React, { useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";




interface CatalogItemProps {
  catalogData: any[]
}

const CatalogItem = ({catalogData}: CatalogItemProps) => {
  const router = useRouter();
   const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (path: string) => {
    router.push(path);
  };

  const handleCardSelect = (src: any) => {
    setSelectedCard(src); 
    handleCardClick(src);
  };
  return (
    <Box sx={{ p: 2,  }}>
      <Grid container spacing={3}>
        {catalogData.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.segment}>
             <Card
              sx={{
                position: "relative",
                border: "2px solid #3C98CB",
                borderRadius: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                height: 200,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: selectedCard === item.src ? "#E4E4E4" : "transparent", 
                "&:hover": {
                  boxShadow: "0 8px 12px rgba(0,0,0,0.15)",
                  transform: "translateY(-4px)",
                  cursor: "pointer",
                  backgroundColor: "#E4E4E4", 
                },
              }}
              onClick={() => handleCardSelect(item.src)} 
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  py: 2,
                }}
              >
                <Box sx={{ mb: 2, }}>{item.icon}</Box>
                <h3 
                  className="text-xl text-center font-light"
                >
                  {item.title}
                </h3>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CatalogItem;
