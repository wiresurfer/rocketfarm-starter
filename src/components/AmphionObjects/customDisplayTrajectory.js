import Amphion from 'amphion';
import _ from 'lodash';
import moment from 'moment-timezone';

const WAIT_TIME = 200; // milliseconds

class CustomDisplayTrajectory extends Amphion.DisplayTrajectory {
  constructor(ros, message, options) {
    super(ros, message, options);
    this.onEnd = options.onEnd;
    this.onMessage = options.onMessage || (() => {});
    this.debouncedEnd = _.debounce(this.onEnd, WAIT_TIME);
    this.initTime = moment().format('x'); // UNIX milliseconds
  }

  update(message) {
    const {
      trajectory_start: {
        joint_state: { name: initialNames, position: initialPositions },
      },
    } = message;
    if (moment().format('x') - this.initTime < 500) {
      // Ignore fist trajectory and set robot pose as soon as the page opens
      const { originalRobot } = this.options;
      const lastPoint = _.last(_.get(message, 'trajectory[0].joint_trajectory.points'));
      if (originalRobot && lastPoint) {
        initialNames.forEach((name, index) => {
          const joint = originalRobot.getObjectByName(name);
          if (joint) {
            joint.setAngle(lastPoint.positions[index]);
          }
        });
      }
      return;
    }
    const { originalRobot } = this.options;
    if (originalRobot) {
      initialNames.forEach((name, index) => {
        const joint = originalRobot.getObjectByName(name);
        if (joint) {
          joint.setAngle(initialPositions[index]);
        }
      });
    }
    super.update(message);
    this.onMessage(message);
    const { secs, nsecs } = _.get(
      _.last(_.get(message, 'trajectory[0].joint_trajectory.points')),
      'time_from_start',
    );
    setTimeout(() => {
      this.debouncedEnd();
    }, 1000 * secs + nsecs / 10 ** 6);
  }
}

export default CustomDisplayTrajectory;
