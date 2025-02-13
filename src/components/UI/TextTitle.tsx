const Title = ({ children }: any) => {
  return <p className="text-base font-bold">{children}</p>;
};

const TextChildren = ({ children }: any) => {
  return <p className="">{children}</p>;
};

interface TextTitleProps {
  title: string;
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
