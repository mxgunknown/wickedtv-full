const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

// Proxy full HLS access: .m3u8, .ts, and key segments
app.use(
  "/hls",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    pathRewrite: {
      "^/hls": "/hls", // leave as is
    },
  })
);

// Proxy legacy direct stream paths (for fallback)
app.use(
  "/live",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
    pathRewrite: {
      "^/live": "/live",
    },
  })
);

// Proxy API
app.use(
  "/player_api.php",
  createProxyMiddleware({
    target: "http://playwithme.pw",
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`WickedTV server is running on port ${PORT}`);
});
