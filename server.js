const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// Custom headers ONLY for media routes
const setMediaHeaders = (proxyReq) => {
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
    onProxyReq: setMediaHeaders,
  })
);

// Legacy direct streams
app.use(
  "/live",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    pathRewrite: { "^/live": "/live" },
    onProxyReq: setMediaHeaders,
  })
);

// API (do NOT attach headers here!)
app.use(
  "/player_api.php",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`WickedTV server running on port ${PORT}`);
});
