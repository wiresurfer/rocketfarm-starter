import Amphion from 'amphion';
import _ from 'lodash';

class CustomPlanningScene extends Amphion.PlanningScene {
  constructor(ros, message, robot, options) {
    super(ros, message, robot);
    this.onEnd = options.onEnd;
    this.debouncedEnd = _.debounce(this.onEnd, 500);
  }

  update(message) {
    super.update(message);
    debugger;
    this.debouncedEnd();
  }
}

export default CustomPlanningScene;
