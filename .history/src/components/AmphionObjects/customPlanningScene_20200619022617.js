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
    console.log(message);
    // you have references to the mesh file here. Use this to populate your scene. 
    debugger
    this.debouncedEnd();
    debugger
  }
}

export default CustomPlanningScene;
