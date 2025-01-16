import { SiTicktick } from "react-icons/si";
import WhiteBackground from "../../../components/UI/WhiteBackground";
import { UserProfileData } from "../../../model/User";
import AvatarProfile from "./AvatarProfile";

interface GeneralInformationProps {
  profile: UserProfileData;
  mutate: any;
}

const GeneralInformation = ({ profile, mutate }: GeneralInformationProps) => {
  return (
    <WhiteBackground className="w-full flex gap-5 items-center">
      <div className="w-1/4 ">
        <AvatarProfile avatar={profile?.profilePhoto} mutate={mutate} />
      </div>
      <div className="flex flex-col gap-5 justify-between py-2">
        <p className="text-xl font-bold">
          {profile?.name}{" "}
          <span className="font-normal text-gray-500">
            ({profile?.roleId?.name})
          </span>
        </p>
        <p className="text-base">
          <strong>Employee Number: </strong> {profile?.employeeNumber}
        </p>
        <p className="text-sm text-gray-500">
          A middle-aged man with a kind demeanor, standing about 5'10" tall,
          with a lean but slightly muscular build. His face carries the marks of
          experience—laugh lines at the corners of his mouth and a faint scar
          just above his left eyebrow. His deep-set hazel eyes are framed by
          thick brows and a pair of rectangular glasses that give him an
          intellectual air. His short, slightly wavy dark brown hair is streaked
          with touches of gray at the temples. He wears a simple outfit: a
          button-up navy shirt tucked into well-worn jeans, with a leather belt
          and sturdy brown boots. His hands are calloused, suggesting a life of
          both mental and physical work, and his voice carries a calm, steady
          tone that puts others at ease.
        </p>
        <div>
          <SiTicktick size={20} className="text-green-500" />
        </div>
      </div>
    </WhiteBackground>
  );
};

export default GeneralInformation;
