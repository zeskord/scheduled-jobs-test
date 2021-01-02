var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'ScheduledJobsTest',
  description: 'Слушает запросы от регламентных заданий сервера 1С, сообщает, если долго нет запросов.',
  script: 'index.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();