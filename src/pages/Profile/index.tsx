import { Spin } from 'antd';
import useFetcher from '../../hooks/useFetcher';
import TabsProfile from './components/TabsProfile';

const Profile = () => {
  const { data, isLoading, mutate } = useFetcher<any>('users/profile', 'GET');
  return !isLoading ? (
    <>
      <div>
        <div className="mt-5">
          <TabsProfile profile={data} mutate={mutate} />
        </div>
      </div>
    </>
  ) : (
    <Spin />
  );
};

export default Profile;
