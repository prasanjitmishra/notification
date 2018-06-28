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
mongoose.connect("mongodb://ds135757.mlab.com:35757/develop19", { user: "jackman", pass: "jackman" });

/**
 * This is to notify a single user
 */
app.post('/notify', (req, res) => {
  const subscription = req.body;
  const payload = JSON.stringify({ title: subscription.title, body: subscription.body });
  console.log("here");
  console.log(subscription);
  webpush.sendNotification(subscription, payload).catch(error => {
    console.error(error.stack);
  });
  res.status(201).json({status:200,msg:'Success'});
});

/**
 * This route is to save the subscribed users
 */
app.post('/save-subcriptions', (req,res) => {
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

/**
 * This is to check the subscribed users
 */
app.get('/desktopTokens', (req,res) => {
  DesktopToken.find().then((data)=>{
    res.json(data);
    res.status(200);
  })
});

/**
 * This is to notify all the users
 */
app.post('/notify-all', (req,res) => {
  DesktopToken.find().then((data)=>{
    data.forEach((value) => {
      subscription = {};
      subscription.endpoint = value.endpoint;
      subscription.expirationTime = null;
      subscription.keys = {};
      subscription.keys.p256dh = value.p256dh;
      subscription.keys.auth = value.auth;
      
      var payload = JSON.stringify({ title: req.body.title, body: req.body.body });
      webpush.sendNotification(subscription, payload).catch(error => {
        console.error(error.stack);
      });
    });
    res.status(200).json({status:200,msg:'Success'});
  })
});

app.use(require('express-static')('./'));

app.listen(3000);
