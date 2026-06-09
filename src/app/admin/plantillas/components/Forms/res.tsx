"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Switch,
  Typography,
  Button,
} from "@mui/material";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { fetchClaims } from '@/lib/services/claims/claimsSlices'
import { AppDispatch } from "@/lib/store/store";
import { usePlantillaForm } from "./PlantillaFormContext";

type Claim = {
  claimType: string;
  claimValue: string;
};

export const PermissionsForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [groupedClaims, setGroupedClaims] = useState<{ [key: string]: Claim[] }>({});
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [switchStates, setSwitchStates] = useState<{ [key: string]: boolean }>({});
  const { claims, setClaims } = usePlantillaForm();

  useEffect(() => {
    const fetchClaimsData = async () => {
      const token = Cookies.get("auth-token");

      if (token) {
        try {
          const result = await dispatch(fetchClaims(token)).unwrap();
          setClaims(result);
          console.log("Permisos a asignar", result);
        } catch (error) {
          console.error("Error fetching claims", error);
        }
      }
    };

    fetchClaimsData();
  }, [dispatch]);

  useEffect(() => {
    const grouped: { [key: string]: Claim[] } = {};
    claims?.forEach((claim) => {
      const section = claim.claimValue.split(".")[0];
      if (!grouped[section]) grouped[section] = [];
      grouped[section].push(claim);

      setSwitchStates((prev) => ({
        ...prev,
        [claim.claimValue]: false,
        [section]: false, 
      }));
    });
    setGroupedClaims(grouped);
  }, [claims]);

  const handleToggle = (section: string) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSwitchChange = (claimValue: string) => {
    setSwitchStates((prev) => {
      const newState = { ...prev, [claimValue]: !prev[claimValue] };

      
      const activatedClaims = Object.keys(newState).filter((key) => newState[key]);
      console.log("Claims activados:", activatedClaims);

      return newState;
    });
  };

  const handleSectionSwitch = (section: string, sectionClaims: Claim[]) => {
    setSwitchStates((prev) => {
      const newState = { ...prev, [section]: !prev[section] };

      sectionClaims.forEach((claim) => {
        newState[claim.claimValue] = newState[section];
      });

      return newState;
    });
  };


  return (
    <div>
      {Object.entries(groupedClaims).map(([section, sectionClaims]) => (
        <Accordion key={section} expanded={expanded[section] || false}>
          <AccordionSummary
            onClick={() => handleToggle(section)}
            expandIcon={expanded[section] ? <ChevronDown /> : <ChevronRight />}
            className="flex justify-between items-center"
          >
            <Typography variant="h6">{section}</Typography>
            <Switch
              checked={switchStates[section] || false}
              onChange={() => handleSectionSwitch(section, sectionClaims)}
              onClick={(e) => e.stopPropagation()} 
            />
          </AccordionSummary>

          <AccordionDetails sx={{ height: "20vh", overflow: "auto" }}>
            {sectionClaims.map((claim) => {
              const [, subSection, action] = claim.claimValue.split(".");
              return (
                <div
                  key={claim.claimValue}
                  className="flex items-center justify-between py-1"
                >
                  <Typography variant="body2">
                    {subSection || "General"} - {action || "Permiso"}
                  </Typography>
                  <Switch
                    checked={switchStates[claim.claimValue] || false}
                    onChange={() => handleSwitchChange(claim.claimValue)}
                  />
                </div>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}

    </div>
  );
};
