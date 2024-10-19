const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const qs = require("qs");

const config = {
  channelAccessToken: "ViP8cMhCXpPD8uvNm7A1ZAoo9lxG1p6OyRPreJGwnntxM2eMnuoUAxi1MU/aPb51cR1Wn9mHFT9etPDzzip2+VAKJYUPeUimJFi2MLGjm0sXEV3Fiv/AHKa+qLC0kLheQkFnQK5TzZ0pVjvlKJ+DJgdB04t89/1O/w1cDnyilFU=", // add your channel access token
  channelSecret: "9cbcb8006d2f2766321ddddf98ab32d7", // add your channel secret
};

const APPS_SCRIPT_URL = "https://script.google.com/d/19gDH7l4xCMz_G4TRaPDaVr8-beI6rmJQ06U-VTydHv3DKKO9Fhxbq-ka/edit?usp=sharing"; // add your google app script url

const app = express();

app.get("/api", (req, res) => res.send("รายงาน คลังสินค้าบิวตี้คลับ"));

app.post("/api/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

const client = new line.Client(config);
async function handleEvent(event) {
  console.log("event", event);
  if (event.type !== "message" || event.message.type !== "text") {
    return Promise.resolve(null);
  }

  try {
    const data = await axios.post(
      APPS_SCRIPT_URL,
      qs.stringify({
        text: event.message.text,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log(data.data);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: data.data.message,
    });
  } catch (err) {
    console.error(err);

    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "กรุณาลองใหม่อีกครั้ง",
    });
  }
}

module.exports = app;
