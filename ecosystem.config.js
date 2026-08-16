module.exports = {
    apps: [
        {
            name: "thanhbt-be",
            cwd: "/home/hieulq/thanhbt-profile/myprofile/backend",
            script: "npm",
            args: "start",
            env: {
                NODE_ENV: "production",
                PORT: 3091
            }
        },
        {
            name: "thanhbt-fe",
            cwd: "/home/hieulq/thanhbt-profile/myprofile/frontend",
            script: "npm",
            args: "start -- -p 5180",
            env: {
                NODE_ENV: "production"
            }
        }
    ]
};