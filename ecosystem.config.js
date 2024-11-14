module.exports = {
  apps: [
    {
      name: "SELL-SHOE",
      script: "./index.js",
      env: {
        NODE_ENV: "production",
        PORT: 10001,
      },
    },
  ],
};
