export const environment = {
  production: false,
  UrlFrontend:"http://localhost:4200",
  //UrlApi: "http://localhost:5286",
  UrlApi: "https://localhost:44388/api",
  BEUrl: "https://localhost:44388",
  signalingServerUrl: 'https://localhost:44388/hubs',

  iceServers: [
    {urls: 'stun:stun.1.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'}
  ]
};