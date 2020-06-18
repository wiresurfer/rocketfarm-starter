import ROSLIB from 'roslib';
import { Notif, NOTIF_MSG_TYPES } from './notification';

class RosManager {
  constructor(args) {
    this.rosBridgeURL = args.rosBridgeURL;
    this.ros = new ROSLIB.Ros();
    this.onConnection = args.onConnection;
    this.onError = args.onError;
    this.onClose = args.onClose;
    this.onFinalReconnectFail = args.onFinalReconnectFail;
    this.iterations = 0;
    this.currentState = 'Connecting';
    this.maximumBackOff = 64000;
    this.initialBackOff = 2000;

    this.reconnectTimeoutId = null;
    this.rosConnectionListener = null;
    this.rosErrorListener = null;
    this.rosCloseListener = null;

    this.establishHooks();
  }

  establishHooks = () => {
    this.rosConnectionListener = () => {
      this.currentState = 'Connected';
      if (this.iterations > 0) {
        Notif({
          title: 'ROS connection established',
          message: ' ',
          type: NOTIF_MSG_TYPES.SUCCESS,
        });
      }
      this.iterations = 0;
      if (this.onConnection) {
        this.onConnection();
      }
    };
    this.rosErrorListener = () => {
      if (this.currentState === 'Connected' || this.currentState === 'Connecting') {
        this.reconnect();
        this.currentState = 'Error';
      }
      if (this.onError) {
        this.onError();
      }
    };
    this.rosCloseListener = () => {
      if (this.currentState === 'Connected' || this.currentState === 'Connecting') {
        this.reconnect();
        this.currentState = 'Disconnected';
      }
      if (this.onClose) {
        this.onClose();
      }
    };

    this.ros.on('connection', this.rosConnectionListener);
    this.ros.on('error', this.rosErrorListener);
    this.ros.on('close', this.rosCloseListener);
  };

  reconnect = () => {
    const timeout = 2 ** this.iterations * this.initialBackOff;
    if (timeout > this.maximumBackOff) {
      Notif({
        title: 'Failed to connect to ros!',
        message: ' ',
        type: NOTIF_MSG_TYPES.DANGER,
      });
      if (this.onFinalReconnectFail) {
        this.onFinalReconnectFail();
      }
      return;
    }
    Notif({
      title: 'Failed to connect to ros!',
      message: `Retrying in ${Math.floor(timeout / 1000)} seconds...`,
      type: NOTIF_MSG_TYPES.DANGER,
    });
    this.reconnectTimeoutId = setTimeout(() => {
      this.currentState = 'Connecting';
      this.ros.connect(this.rosBridgeURL);
      this.iterations += 1;
    }, timeout);
  };

  destroy() {
    clearTimeout(this.reconnectTimeoutId);
    this.ros.off('connection', this.rosConnectionListener);
    this.ros.off('error', this.rosErrorListener);
    this.ros.off('close', this.rosCloseListener);
    this.ros.close();
  }
}

export default RosManager;
