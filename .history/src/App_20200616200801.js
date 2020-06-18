import React from 'react';
import Amphion from 'amphion';
import RosManager from './shared/ros';
import * as THREE from 'three';

import { Button } from 'antd';
import Layout from './containers/_layout'
import CustomPlanningScene from './components/AmphionObjects/customPlanningScene';
import CustomDisplayTrajectory from './components/AmphionObjects/customDisplayTrajectory';

import './App.css';

export const ROS_SOCKET_STATUSES = {
  INITIAL: 'Idle. Not Connected',
  CONNECTING: 'Connecting',
  CONNECTED: 'Connected successfully',
  CONNECTION_ERROR: 'Error in connection',
};


class App extends React.Component {
  constructor(props) {    
    super(props);
    this.initRosConnection = this.initRosConnection.bind(this)
    this.initViz = this.initViz.bind(this);
    this.initRobotModel = this.initRobotModel.bind(this);
    this.initPlanningScene = this.initPlanningScene.bind(this);
  }
  initRosConnection() {
    this.rosManager = new RosManager({
      onConnection: () => {
        this.setState({
          rosStatus: ROS_SOCKET_STATUSES.CONNECTED,
        });
      },
      onError: () => {
        this.setState({
          rosStatus: ROS_SOCKET_STATUSES.CONNECTION_ERROR,
        });
      },
      onClose: () => {
        const { rosStatus } = this.state;

        if (rosStatus === ROS_SOCKET_STATUSES.CONNECTION_ERROR) {
          return;
        }

        this.setState({
          rosStatus: ROS_SOCKET_STATUSES.INITIAL,
        });
      },
      onFinalReconnectFail: () => {
        // props.setExceptionState(null, 'Failed to connect to the ros websocket');
      },
    });
    this.ros = this.rosManager.ros;
  } 

  initViz() {
    this.viewer = new Amphion.Viewer3d();
    this.viewer.camera.position.set(-1.5, -1.5, 1.5);
    this.viewer.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.container = React.createRef();
  }
  async initRobotModel(urdf){
    this.robotModelViz = new Amphion.RobotModel();
    debugger
    const robotModel = await this.robotModelViz.loadFromParam();//(urdf)
    Amphion.RobotModel.onComplete(robotModel);
    return robotModel;
  }

  initPlanningScene(robotModel){
    this.planningSceneViz = new CustomPlanningScene(
      this.ros,
      '/move_group/monitored_planning_scene',
      robotModel,
      {
        onEnd: this.onExecuteMovementEnd,
      },
    );
    this.planningSceneViz.object.add(robotModel);
    this.viewer.addVisualization(this.planningSceneViz);
    this.planningSceneViz.subscribe();

  }
  async componentDidMount(){
    this.initRosConnection();
    this.initViz();
    const robotModel  = await this.initRobotModel();
    this.initPlanningScene(robotModel);
    this.rosManager.rosBridgeURL = "http://localhost:9090/";
    this.ros.connect(this.rosManager.rosBridgeURL );
    this.viewer.setContainer(this.container.current);
  }

  componentWillUnmount() {
    this.rosManager.destroy();
  }

  render() {
    return (
        <Layout>
          <Button> test</Button>
        </Layout>
    );
  }
}

export default App;
