const cron = require('cron');
const https = require('https');


const backendUrl= "https://atharv1599-gmail-com-cuvette-final.onrender.com"

const job = new cron.CronJob('*/14 * * * *',function (){
// */14 12,22 * * * ; */14 * * * *
  console.log('Restarting server');

https.get(backendUrl,(res)=>{

  if(res.statusCode == 200){
    console.log("Server Restarted");
  }else{
    console.error("Failed to restart");
  }
})
.on('error',(err)=>{
  console.log("Error during restart",err.message);
})
})

export default job;