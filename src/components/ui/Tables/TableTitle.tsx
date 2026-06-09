interface Props {
  title: string;
  total?: number;
}

export const TableTitle = ({ title, total }: Props) => {
  return (
    <div className="flex items-center justify-start flex-col gap-1 md:gap-7 md:flex-row px-4 md:items-end mb-4">
      <div className="flex items-center justify-between ">
        <h1 className="text-[#5b6670] text-2xl font-semibold antialiased md:text-3xl lg:text-4xl">
          {title}
        </h1>
      </div>

      <div className="flex justify-center items-center">
        <span className="text-[#5b6670]/60 text-base font-semibold md:text-lg">
          ({total} resultados)
        </span>
      </div>
    </div>
  );
};
