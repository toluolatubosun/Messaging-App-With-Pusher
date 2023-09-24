const config = {
    APP_NAME: "demo",
    role: {
        ADMIN: ["admin"],
        USER: ["user", "admin"]
    },
    JWT_SECRET: process.env.JWT_SECRET || "demo-secret",
    PUSHER: {
        APP_ID: process.env.PUSHER_APP_ID || "APP_ID",
        APP_KEY: process.env.PUSHER_APP_KEY || "APP_KEY",
        APP_SECRET: process.env.PUSHER_APP_SECRET || "APP_SECRET",
        APP_CLUSTER: process.env.PUSHER_APP_CLUSTER || "APP_CLUSTER",
    }
};

module.exports = config;
