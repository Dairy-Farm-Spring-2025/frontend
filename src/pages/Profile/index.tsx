import AnimationAppear from '@components/UI/AnimationAppear';
import useFetcher from '../../hooks/useFetcher';
import TabsProfile from './components/TabsProfile';

const Profile = () => {
  const { data, isLoading, mutate } = useFetcher<any>('users/profile', 'GET');
  return (
    <AnimationAppear loading={isLoading}>
      <TabsProfile profile={data} mutate={mutate} />
    </AnimationAppear>
  );
};

export default Profile;
