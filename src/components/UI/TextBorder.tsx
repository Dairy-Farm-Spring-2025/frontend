interface TextBorderProps {
  children: React.ReactNode;
}
const TextBorder = ({ children }: TextBorderProps) => {
  return (
    <div className="border-[1px] bg-[#f1f1f1] px-3 py-1 border-gray-300 rounded-md border-solid">
      {children}
    </div>
  );
};

export default TextBorder;
