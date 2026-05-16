require("dotenv").config();

const axios = require("axios");

const BASE_URL = "http://4.224.186.213/evaluation-service";


// ================= LOG FUNCTION =================

const Log = async (stack, level, packageName, message) => {

    try {

        await axios.post(
            `${BASE_URL}/logs`,
            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN.trim()}`,
                    "Content-Type": "application/json"
                }
            }
        );

    } catch (error) {

        console.log(
            "Logging Error:",
            error.response?.data || error.message
        );
    }
};


// ================= FETCH NOTIFICATIONS =================

const fetchNotifications = async () => {

    try {

        const response = await axios.get(
            `${BASE_URL}/notifications`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN.trim()}`
                }
            }
        );

        await Log(
            "backend",
            "info",
            "api",
            "Notifications fetched successfully"
        );

        return response.data.notifications;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "api",
            "Failed to fetch notifications"
        );

        throw error;
    }
};


// ================= PRIORITY MAP =================

const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1
};


// ================= SORT FUNCTION =================

const getTopNotifications = (notifications, topN = 10) => {

    notifications.sort((a, b) => {

        // Priority comparison
        const priorityDifference =
            priorityMap[b.Type] - priorityMap[a.Type];

        if (priorityDifference !== 0) {
            return priorityDifference;
        }

        // Latest notification first
        return new Date(b.Timestamp) - new Date(a.Timestamp);
    });

    return notifications.slice(0, topN);
};


// ================= MAIN FUNCTION =================

const main = async () => {

    try {

        await Log(
            "backend",
            "info",
            "handler",
            "Priority inbox started"
        );

        const notifications = await fetchNotifications();

        await Log(
            "backend",
            "info",
            "service",
            `Fetched ${notifications.length} notifications`
        );

        const topNotifications =
            getTopNotifications(notifications, 10);

        await Log(
            "backend",
            "info",
            "service",
            "Top notifications generated successfully"
        );

        console.log(
            JSON.stringify(topNotifications, null, 2)
        );

    } catch (error) {

        await Log(
            "backend",
            "fatal",
            "handler",
            error.message
        );

        console.log(
            error.response?.data || error.message
        );
    }
};


// ================= RUN =================

main();