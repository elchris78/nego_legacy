const TitleForm = ({ label }: { label: string }) => {
  return (
    <div className="flex items-center justify-start space-x-2 mb-8 mt-4">
      <h1 className="text-[#5b6670] text-2xl font-semibold antialiased md:text-3xl lg:text-4xl">
        {label}
      </h1>
    </div>
  );
};

export default TitleForm;
