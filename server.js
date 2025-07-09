const express = require("express");
const request = require("request");
const cors = require("cors");
const app = express();

app.use(cors());

// Route ALL paths including /live and /hls
app.use("/*", (req, res) => {
  // Forward to full origin path
  const upstreamUrl = `http://playwithme.pw${req.originalUrl}`;

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "Referer": "http://playwithme.pw/",
    "Origin": "http://playwithme.pw",
    "Host": "playwithme.pw",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
  };

  request({ url: upstreamUrl, headers })
    .on("response", (response) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      if (response.headers["content-type"]) {
        res.setHeader("Content-Type", response.headers["content-type"]);
      }
    })
    .on("error", (err) => {
      console.error("Proxy error:", err);
      res.status(502).send("Proxy fetch failed");
    })
    .pipe(res);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
