const NotFoundCatalog = () => {
  return (
    <div className="col-span-4 text-center py-4 text-gray-500">
      <span className="text-xl font-semibold">¡No se encontraron catálogos!</span>
      <br />
      <span className="text-lg font-light">
        No hay catálogos que coincidan con la búsqueda
      </span>
    </div>
  );
};

export default NotFoundCatalog;
