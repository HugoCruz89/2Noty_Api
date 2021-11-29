var admin = require("firebase-admin");
var serviceAccount = require("./../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const SendSingleNotification = async (title,body,token,imageUrl) => {
  //   var topics = "weather";
  //   const topicName = "industry-tech";
  const message = {
    notification: {
      title,
      body,
    },
    android: {
      notification: {
        click_action:"OPEN_ACTIVITY_1",
        icon: "splash_icon",
        color: "#7e55c3",
        sound: "default",
        //channelId: "Noticias_id",
        imageUrl:
          "https://e1.pngegg.com/pngimages/618/911/png-clipart-handwritten-doodles-and-abr-black-sun.png",
      },
      priority: "high",
    },
    apns: {
      payload: {
        aps: {
          contentAvailable: true,
          "mutable-content": 1,
          
        },
      },
      headers: {
        "apns-priority": "5",
        "apns-topic": "com.alerty", // your app bundle identifier
      },
    },
    token: token,
    data: {
      route: "Agenda",
      item1: "item1",
      item2: "item2",
    },
  };

  const respuesta = await admin
    .messaging()
    .send(message)
    .then((response) => {
     
      return {
        ok: true,
        msg: response,
      };
    })
    .catch((error) => {
    
      return {
        ok: false,
        msg: error,
      };
    });
  return respuesta;
};
const SendMultiNotifications = async (title,body,arrayToken,imageUrl) => {
    //   var topics = "weather";
    //   const topicName = "industry-tech";
   
    const message = {
      notification: {
        title,
        body,
      },
      android: {
        notification: {
          // clickAction: "test",
           icon: "splash_icon",
           color: "#EA5048",
          // sound: "default",
          channelId: "Noticias_id",
         imageUrl:imageUrl,
        },
        priority: "high",
      },
      apns: {
        payload: {
          aps: {
            contentAvailable: true,

          },
        },
        headers: {
          "apns-push-type": "background",
          "apns-priority": "10",
          "apns-topic": "com.alerty", // your app bundle identifier
        },
      },
      tokens: arrayToken,
      data: {
        route: "Agenda",
        color: "#EA5048",
        imageUrl:imageUrl,
      },
    };
  
    const respuesta = await admin
      .messaging()
      .sendMulticast(message)
      .then((response) => {
        console.log("successfuly sent message:", response);
        return {
          ok: true,
          msg: response,
        };
      })
      .catch((error) => {
        console.log("error sending message:", error);
        return {
          ok: false,
          msg: error,
        };
      });
    return respuesta;
  };
module.exports = {
  SendSingleNotification,
  SendMultiNotifications
};
