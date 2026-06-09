interface Props {
  status: string;
}

export const StatusConnection = ({ status }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <span>{status}</span>
      <div
        className={`w-3 h-3 rounded-full ml-2 ${
          status === "Activo"
            ? "bg-green-500"
            : status === "Ausente"
              ? "bg-yellow-500"
              : "bg-red-500"
        }`}
      ></div>
    </div>
  );
};
