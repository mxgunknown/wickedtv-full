const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// Shared headers for all proxy routes
const setProxyHeaders = (proxyReq) => {
  proxyReq.setHeader("Host", "playwithme.pw");
  proxyReq.setHeader("User-Agent", "Mozilla/5.0");
  proxyReq.setHeader("Referer", "http://playwithme.pw/");
};

// Proxy full HLS: m3u8 + ts + encryption keys
app.use(
  "/hls",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    pathRewrite: { "^/hls": "/hls" },
    onProxyReq: setProxyHeaders,
  })
);

// Legacy direct streams
app.use(
  "/live",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    pathRewrite: { "^/live": "/live" },
    onProxyReq: setProxyHeaders,
  })
);

// Player API
app.use(
  "/player_api.php",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    onProxyReq: setProxyHeaders,
  })
);

app.listen(PORT, () => {
  console.log(`WickedTV server is running on port ${PORT}`);
});
