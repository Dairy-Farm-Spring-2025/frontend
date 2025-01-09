interface underlineProps {
    color?: string
}

const Underline = ({ color }: underlineProps) => {
    return (
        <span className={`absolute left-1/2 bottom-0 w-0 h-[2px] bg-${color ? color : 'black'} transition-all duration-400 group-hover:w-full group-hover:left-0`}></span>
    );
};

export default Underline;
