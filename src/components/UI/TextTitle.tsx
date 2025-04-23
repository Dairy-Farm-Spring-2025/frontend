const Title = ({ children }: any) => {
  return (
    <p className="text-sm lg:text-sm 2xl:text-base font-bold">{children}</p>
  );
};

const TextChildren = ({ children }: any) => {
  return <p className="text-sm 2xl:text-base">{children}</p>;
};

interface TextTitleProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode | any;
  layout?: 'vertical' | 'horizontal';
}

const TextTitle = ({
  title,
  description,
  layout = 'vertical',
}: TextTitleProps) => {
  return (
    <div
      className={`flex ${
        layout === 'vertical' ? 'flex-col' : 'flex-row items-center'
      } gap-2`}
    >
      <Title>{title}: </Title>
      <TextChildren>{description}</TextChildren>
    </div>
  );
};

export default TextTitle;
