import React from "react";
import Image from "next/image";
import searchIcon from "@/Asset/searchIcon.png";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

const SearchCatalog = ({ search, setSearch }: Props) => {
  return (
    <div className="px-4 pt-5">
      <form
        className="flex flex-col items-center md:flex-row md:justify-between gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex w-full flex-wrap justify-center md:justify-start md:w-3/4 lg:w-4/6 gap-3">
          <div className="flex-1 min-w-56 max-w-80">
            <div className="flex items-center gap-3 rounded-md border border-input bg-white pl-3 text-sm ring-offset-background focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-2 h-[2.625rem]">
              <Image src={searchIcon} alt="Search" width={20} height={20} />
              <input
                id="search"
                type="search"
                placeholder="Buscar..."
                className="w-full p-2 placeholder:text-muted-foreground bg-white disabled:bg-gray-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchCatalog;
