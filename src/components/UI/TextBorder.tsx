interface TextBorderProps {
  children: React.ReactNode;
}
const TextBorder = ({ children }: TextBorderProps) => {
  return (
    <div className="border-[1px] px-3 py-1 hover:border-primary duration-300 border-gray-300 rounded-md border-solid">
      {children}
    </div>
  );
};

export default TextBorder;
