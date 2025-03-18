import { formatStatusWithCamel } from '@utils/format';
import { t } from 'i18next';
import { MdModeNight, MdSunny } from 'react-icons/md';

interface ShiftTitleProps {
  data: any;
}

const ShiftTitle = ({ data }: ShiftTitleProps) => {
  return (
    <div className="flex items-center w-full justify-center">
      {data === 'dayShift' ? (
        <MdSunny color="orange" size={25} />
      ) : (
        <MdModeNight color="blue" size={25} />
      )}
      <p
        className={`!px-2 !py-5 !h-full font-black text-base rounded-lg  ${
          data === 'dayShift' ? 'text-yellow-500' : 'text-blue-500'
        }`}
      >
        {t(formatStatusWithCamel(data))}
      </p>
    </div>
  );
};

export default ShiftTitle;
