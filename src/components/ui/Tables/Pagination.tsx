"use client";

import { Box, MenuItem, Select, Typography } from "@mui/material";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

interface Props {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (value: number) => void;
  goToNextPage: () => void;
  goToPrevPage: () => void;
}

export const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  setItemsPerPage,
  goToNextPage,
  goToPrevPage,
}: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      mt={2}
      p={2}
      flexDirection={{ xs: "column", sm: "row" }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: "center", sm: "start" }}
        width={{ xs: "100%", sm: "41%" }}
      >
        <Typography variant="body1" mr={2}>
          Mostrar:
        </Typography>
        <Select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          size="small"
        >
          <MenuItem value={0}>Total</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
        <Typography variant="body1" ml={2}>
          registros por página
        </Typography>
      </Box>
      <Box
        flex={1}
        display={"flex"}
        justifyContent={{ xs: "end", md: "start" }}
        mr={{ xs: 1, md: 0 }}
      >
        <div className="flex items-center justify-center xs:mr-4 md:mr-0">
          <div>
            <button
              className="xs:p-4 md:p-6"
              onClick={goToPrevPage}
              disabled={currentPage === 1 || totalPages === 0}
            >
              <NavigateBeforeIcon className="text-[#5B89B4]" />
            </button>
          </div>

          <div>
            <span>
              {currentPage} de {totalPages}
            </span>
          </div>

          <div>
            <button
              className="xs:p-4 md:p-6 text-[#5B89B4]"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <NavigateNextIcon className="text-[#5B89B4]" />
            </button>
          </div>
        </div>
      </Box>
    </Box>
  );
};
