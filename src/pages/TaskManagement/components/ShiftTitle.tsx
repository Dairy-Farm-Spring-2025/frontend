import { formatStatusWithCamel } from '@utils/format';
import { t } from 'i18next';
import { MdModeNight, MdSunny } from 'react-icons/md';

interface ShiftTitleProps {
  data: any;
}

const ShiftTitle = ({ data }: ShiftTitleProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center w-full justify-center">
        {data === 'dayShift' ? (
          <MdSunny className="!text-yellow-500" size={25} />
        ) : (
          <MdModeNight className="!text-blue-700" size={25} />
        )}
        <p
          className={`!px-2 !h-full font-black text-base rounded-lg  ${
            data === 'dayShift' ? 'text-yellow-600' : 'text-blue-800'
          }`}
        >
          {t(formatStatusWithCamel(data))}
        </p>
      </div>
      <p
        className={`font-bold text-base ${
          data === 'dayShift' ? 'text-yellow-600' : 'text-blue-800'
        }`}
      >
        (
        {data === 'dayShift' ? (
          <span>8:am - 17:pm</span>
        ) : (
          <span>17:pm - 6:am</span>
        )}
        )
      </p>
    </div>
  );
};

export default ShiftTitle;
