import React from 'react';
import { Button } from 'antd';
import Layout from './containers/_layout'
import './App.css';
import CustomPlanningScene from './components/AmphionObjects/customPlanningScene';
import CustomDisplayTrajectory from './components/AmphionObjects/customDisplayTrajectory';
import Amphion from 'amphion';
import RosManager from './shared/ros';

class App extends React.Component {
  constructor(props) {    
    super(props);

  }
  initRosConnection(endpoint) {
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
        props.setExceptionState(null, 'Failed to connect to the ros websocket');
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
  initRobotModel(urdf){
    this.robotModelViz = new Amphion.RobotModel();
    this.robotModelViz.loadRobot(urdf, robotModel => {
      Amphion.RobotModel.onComplete(robotModel);
      this.initPlanningScene(robotModel)
    });
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
  componentDidMount(){
    
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
