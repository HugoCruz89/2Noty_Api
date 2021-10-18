var admin = require("firebase-admin");
var serviceAccount = require("./../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const sendNotification = async (req, res = response) => {
  const { body } = req.body;
  var topics = "weather";
  var registrationToken =
    "fl6gmAptTiqlUxJBRNIPtb:APA91bE9QME6xhXv2QRboapP6_vhDsdJxijnbKMKOB-vIBtbzFUv0ifgUvgPgbz54fMzjP4UmclQkx4OY81wABMDYwtf2X6AG0MDMkB6pQZbrWWYa4IuRF8wUL7yM5Z-f_NJTbXkRLOf";

  const topicName = "industry-tech";

  const message = {
    notification: {
      title: "`$FooCorp` up 1.43% on the day",
      body: "FooCorp gained 11.80 points to close at 835.67, up 1.43% on the day.",
    },
    android: {
      notification: {
        clickAction: "test",
        icon: "splash_icon",
        color: "#7e55c3",
        sound: "default",
        channelId: "Noticias_id",
        imageUrl:
          "https://e1.pngegg.com/pngimages/618/911/png-clipart-handwritten-doodles-and-abr-black-sun.png",
      },

      priority: "high",
    },
    token: registrationToken,
    data: {
      type: "order",
    },
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("successfuly sent message:", response);
    })
    .catch((error) => {
      console.log("error sending message:", error);
    });

  res.status(200).json({
    ok: true,
    msg: "test",
  });
};
module.exports = {
  sendNotification,
};
