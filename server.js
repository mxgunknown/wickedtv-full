const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// Proxy everything (API, media, HLS, etc.) to playwithme.pw
app.use(
  "/",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    ws: true,
    followRedirects: true,
    onProxyReq: (proxyReq) => {
      proxyReq.setHeader("Referer", "http://playwithme.pw/");
      proxyReq.setHeader("Origin", "http://playwithme.pw");
      proxyReq.setHeader(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
      );
    },
  })
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`WickedTV Proxy listening on port ${port}`);
});
