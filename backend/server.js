const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const axios = require("axios");

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route

const defaultHeaders = (cookie) => ({
  cookie,
  applicationId: "ECMW",
  applicationUserId: "ECMW",
  enterpriseMessageId: "ECMW341497997",
  messageDateTimeStamp: new Date().toISOString(),
  consumerId: "webApp",
  messageId: "341497997",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
});

const SESSION_PUT_DATA = {
  userAttributes: { profileId: "12309302400", currentShoppingPath: "BYOD" },
};

app.get("/sprint_checker", async (req, res) => {
  const sprintImei = req.query.imei;
  const url =
    "https://www.sprint.com/en/shop/bring-your-phone-to-sprint.html?flow=BYOD";
  //

  const sessionUrl = "https://www.sprint.com/api/digital/usr/session";

  try {
    // GETTING INTIAL COOKIES
    const resp = await axios.get(url);
    const cookies = resp.headers["set-cookie"];
    let cookie = formCookieString(cookies);

    // GETTING SESSION COOKIES

    const sessionResp = await axios.get(sessionUrl, {
      headers: defaultHeaders(cookie),
    });

    const sessionCookies = sessionResp.headers["set-cookie"];
    let newCookie = formCookieString(sessionCookies);

    // GETTING EXTRA SESSION COOKIES

    const otherSessionResponse = await axios.put(sessionUrl, SESSION_PUT_DATA, {
      headers: defaultHeaders(cookies),
    });

    const otherSessionCookies = formCookieString(
      otherSessionResponse.headers["set-cookie"]
    );

    // GETTING DEVICE INFO

    const responseSprint = await axios.get(
      `https://www.sprint.com/api/digital/byod/v2/foreign-device/${sprintImei}?numberOfSims=1&brandCode=SPR`,
      {
        headers: defaultHeaders(`${newCookie}${cookie}${otherSessionCookies}`),
      }
    );

    console.log("responseSprint: ", responseSprint.data);

    // CREATING RESPONSE OBJECT

    const sprintInfo = {
      model: responseSprint.data.byodDetails.serialNo,
      ...responseSprint.data.byodDetails,
    };

    res.send(sprintInfo);
  } catch (e) {
    const { response } = e;
    const { status } = response;

    // IF STATUS 422 SOMETHING IS WRONG WITH IMEI
    if (status === 422) {
      console.log("error: ", e.response.data);

      console.log("Erorr processing request: ", e.response.data);
      const errorResponse = {
        ...e.response.data.information,
        ...e.response.data.errors[0],
      };
      res.send(errorResponse);
      return;
    }

    // ELSE SOMETHING IS WRONG WITH THE RESPONSE
    console.log("respnose: ", response);
    res.send(false);
  }
});

function formCookieString(cookies) {
  let cookie = "";

  for (let i = 0; i < cookies.length; i++) {
    const item = cookies[i];
    const split = item.split(";")[0];
    cookie += `${split}; `;
  }

  return cookie;
}