import AnimationAppear from '@components/UI/AnimationAppear';
import WhiteBackground from '@components/UI/WhiteBackground';
import TaskSchedule from './components/components/TaskSchedule';

const TaskManagement = () => {
  return (
    <AnimationAppear>
      <WhiteBackground>
        <TaskSchedule />
      </WhiteBackground>
    </AnimationAppear>
  );
};

export default TaskManagement;
