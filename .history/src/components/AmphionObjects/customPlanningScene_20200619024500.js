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
    const {world: {collision_objects}} = message
    // you have references to the mesh file here. Use this to populate your scene. 
    //this.object =  will give you a threeJS scene object.
    // you can parse the collision objects and load them here. 
    // the mesh names should be resolvable. Again this would need the meshes to be hosted somewhere. or brought to the public folder. 
    debugger
    this.debouncedEnd();
    debugger
  }
}

export default CustomPlanningScene;
