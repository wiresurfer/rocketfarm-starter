import React from 'react';

const defaultNotifOptions = {
  title: 'Awesomeness',
  message: 'Awesome default text!',
  type: 'warning',
  insert: 'top',
  container: 'top-right',
  animationIn: ['animated', 'fadeIn'],
  animationOut: ['animated', 'fadeOut'],
  dismiss: { duration: 2000 },
  dismissable: { click: true },
};

export const NOTIF_MSG_TYPES = {
  DANGER: 'danger',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
};

export const notifRef = React.createRef();

export const Notif = options => {
  notifRef.current.addNotification({ ...defaultNotifOptions, ...options });
};
