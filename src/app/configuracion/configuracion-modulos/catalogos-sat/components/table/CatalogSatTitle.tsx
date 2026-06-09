const CatalogSatTitle = () => {
  return (
    <div className="flex flex-col md:flex-row space-x-2 px-4">
      <div className="flex flex-col items-start mb-8">
        <h1 className="text-[#5b6670] text-5xl font-semibold antialiased">
          Catálogos SAT
        </h1>
        <span className="text-[#5b6670]/60 font-medium mt-2">
          Selecciona el catálogo que requieras gestionar
        </span>
      </div>
    </div>
  );
};

export default CatalogSatTitle;
