const Title = ({ children }: any) => {
  return (
    <p className="text-xs lg:text-sm 2xl:text-base font-bold">{children}</p>
  );
};

const TextChildren = ({ children }: any) => {
  return <p className="text-xs 2xl:text-sm">{children}</p>;
};

interface TextTitleProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode | any;
}

const TextTitle = ({ title, description }: TextTitleProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Title>{title}: </Title>
      <TextChildren>{description}</TextChildren>
    </div>
  );
};

export default TextTitle;
