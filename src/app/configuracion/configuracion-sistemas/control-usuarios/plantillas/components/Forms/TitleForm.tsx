

interface Props {
  mode: string;
}

const titleMap: Record<string, string> = {
  new: "Crear plantilla de perfil",
  edit: "Editar plantilla de perfil",
  view: "Consultar plantilla de perfil",
};

export const TitleForm = ({ mode }: Props) => {
  const label = titleMap[mode];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-start space-x-2 mb-2 mt-4">
        <h1 className="text-[#5B6670] text-5xl font-semibold antialiased">
          {label}
        </h1>
      </div>
    </div>
  );
};
