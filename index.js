const express = require('express');
const webpush = require('web-push');
const mongoose = require("mongoose");
const publicVapidKey = 'BASe2SJZYtSngkV-76-3ijZuERWQRgxQC8ZYyQKdIaKc641THMvb6d7mriLkVBV8p9G4WLion0_PyfMwBQiwoek';//process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = 'zARWQ_LtcSZfSjZLkUMkqHLrFuaE9cP_xv3eGR-pXFs';//process.env.PRIVATE_VAPID_KEY;
const DesktopToken = require('./desktop_tokens.js').default;

// Replace with your email
webpush.setVapidDetails('mailto:val@karpov.io', publicVapidKey, privateVapidKey);

const app = express();

app.use(require('body-parser').json());
mongoose.connect("mongodb://nucleus.southindia.cloudapp.azure.com:27017/nucleus", { user: "admin", pass: "admin123" });
app.post('/notify', (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({ title: subscription.title, body:"hi"  });
  console.log("here");
  console.log(subscription);
  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
  res.status(201).json({status:200,msg:'Success'});
});


app.post('/save-subcriptions', (req,res) => {
  console.log("here11");
  var subscription = req.body;
  var updateData = {
    endpoint:subscription.endpoint,
    p256dh:subscription.keys.p256dh,
    auth:subscription.keys.auth
  };
  console.log(updateData);

  DesktopToken.find(updateData)
    .then((data) => {
      if (data.length > 0) {
        console.log(data);        
        DesktopToken.update({_id:data._id},updateData);
      } else {
        console.log("no data");
        DesktopToken.create(updateData).then((data)=> {
          console.log("created");
          console.log(data);
        });
      }
    });
});


app.get('/desktopTokens', (req,res) => {
  DesktopToken.find().then((data)=>{
    res.json(data);
    res.status(200);
  })
});

app.use(require('express-static')('./'));

app.listen(3000);
