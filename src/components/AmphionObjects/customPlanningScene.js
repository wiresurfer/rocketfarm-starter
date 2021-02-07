import Amphion from 'amphion';
import _ from 'lodash';
import * as THREE from 'three';
import ColladaLoader from 'three-collada-loader';
var textureLoader = new THREE.TextureLoader();

class CustomPlanningScene extends Amphion.PlanningScene {
  constructor(ros, message, robot, options) {
    super(ros, message, robot);
    this.onEnd = options.onEnd;
    this.debouncedEnd = _.debounce(this.onEnd, 500);
    this.objects = []
    this.boxes = {}
  }

  update(message) {
    super.update(message);
    //console.log(message);
    //const {world: {collision_objects}} = message
    //var loader = new ColladaLoader();
    //const that = this;
    //collision_objects.forEach(obj3dDae => {
    //    //debugger
    //    let file_path = "/"+ obj3dDae.id.replace(".dae", "") + "/"+ obj3dDae.id; 
    //    const isConveyor = file_path.indexOf("conveyor") > -1;
    //    const isBox = file_path.indexOf("box") > -1;
    //    if(isBox){
    //      file_path = "/box_4/box_4.dae";
    //    }

    //    if(isBox || isConveyor){
    //      loader.load(file_path, function (result) {
    //        //debugger
    //        //console.log(result)
    //        if(obj3dDae.mesh_poses.length > 0){
    //          const {position, orientation} = obj3dDae.mesh_poses[0];
    //          result.scene.traverse(node => {
    //            if (isConveyor && node.isMesh ) 
    //              node.frustumCulled = false;

    //            if(isConveyor && node.isMesh) {
    //              console.log(node)
    //              // if(node.material && node.material.map)
    //                const {parent : {name}} = node
    //                // const image = node.material.map.image
    //                console.log(node)
    //                var texture = textureLoader.load("./conveyor/conveyor-diffuse.png");
    //                if(name.includes("Conveyor01Belt"))
    //                  texture = textureLoader.load("./conveyor/rubberbelt.png");
    //                node.material.map = texture

    //            }
    //          })
    //          result.scene.translateX(position.x).translateY(position.y).translateZ(position.z);
    //          result.scene.quaternion.set(orientation.x,orientation.y,orientation.z, orientation.w);
    //          // result.scene.position = obj3dDae.mesh_poses[0].position
    //          // result.scene
    //          that.object.add(result.scene);
    //        }
    //        else if(obj3dDae.primitive_poses.length > 0){
    //          const {position, orientation} = obj3dDae.primitive_poses[0];
    //          const box_allready_added = that.boxes[obj3dDae.id]

    //          if(!box_allready_added){
    //            that.boxes[obj3dDae.id] = result.scene
    //          }
    //          //else{
    //            
    //            //result.scene.translateX(position.x).translateY(position.y).translateZ(position.z);
    //            //result.scene.quaternion.set(orientation.x,orientation.y,orientation.z, orientation.w);
    //            // result.scene.position = obj3dDae.mesh_poses[0].position
    //            // result.scene
    //          //}

    //          //that.boxes[obj3dDae.id].translateX(position.x).translateY(position.y).translateZ(position.z);
    //          that.boxes[obj3dDae.id].position.set(position.x, position.y, position.z);
    //          that.boxes[obj3dDae.id].quaternion.set(orientation.x,orientation.y,orientation.z, orientation.w);
    //          if(!box_allready_added){
    //            that.object.add(result.scene);
    //          }
    //          
    //        }

    //        
    //        

    //      });
    //    };
    //})
    
    // you have references to the mesh file here. Use this to populate your scene. 
    //this.object =  will give you a threeJS scene object.
    // you can parse the collision objects and load them here. 
    // the mesh names should be resolvable. Again this would need the meshes to be hosted somewhere. or brought to the public folder. 
    //debugger
    this.debouncedEnd();
    //debugger
  }
}

export default CustomPlanningScene;
