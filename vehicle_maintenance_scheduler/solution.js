console.log(process.env.ACCESS_TOKEN);
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
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
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


// ================= FETCH DEPOTS =================

const fetchDepots = async () => {

    try {

        const response = await axios.get(
            `${BASE_URL}/depots`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );

        await Log(
            "backend",
            "info",
            "api",
            "Fetched depots successfully"
        );

        return response.data.depots;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "api",
            "Failed to fetch depots"
        );

        throw error;
    }
};


// ================= FETCH VEHICLES =================

const fetchVehicles = async () => {

    try {

        const response = await axios.get(
            `${BASE_URL}/vehicles`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
                }
            }
        );

        await Log(
            "backend",
            "info",
            "api",
            "Fetched vehicles successfully"
        );

        return response.data.vehicles;

    } catch (error) {

        await Log(
            "backend",
            "error",
            "api",
            "Failed to fetch vehicles"
        );

        throw error;
    }
};


// ================= KNAPSACK SOLUTION =================

const solveKnapsack = (vehicles, capacity) => {

    const n = vehicles.length;

    const dp = Array.from(
        { length: n + 1 },
        () => Array(capacity + 1).fill(0)
    );


    // Build DP table
    for (let i = 1; i <= n; i++) {

        const duration = vehicles[i - 1].Duration;
        const impact = vehicles[i - 1].Impact;

        for (let w = 0; w <= capacity; w++) {

            if (duration <= w) {

                dp[i][w] = Math.max(
                    impact + dp[i - 1][w - duration],
                    dp[i - 1][w]
                );

            } else {

                dp[i][w] = dp[i - 1][w];
            }
        }
    }


    // Backtrack selected tasks
    let w = capacity;

    const selectedTasks = [];

    for (let i = n; i > 0; i--) {

        if (dp[i][w] !== dp[i - 1][w]) {

            selectedTasks.push(vehicles[i - 1]);

            w -= vehicles[i - 1].Duration;
        }
    }

    return {
        totalImpact: dp[n][capacity],
        selectedTasks
    };
};


// ================= MAIN FUNCTION =================

const main = async () => {

    try {

        await Log(
            "backend",
            "info",
            "handler",
            "Vehicle maintenance scheduler started"
        );


        // Fetch data
        const depots = await fetchDepots();

        const vehicles = await fetchVehicles();


        // Calculate total mechanic hours
        let totalMechanicHours = 0;

        depots.forEach(depot => {
            totalMechanicHours += depot.MechanicHours;
        });


        await Log(
            "backend",
            "info",
            "service",
            `Total mechanic hours: ${totalMechanicHours}`
        );


        // Solve optimization
        const result = solveKnapsack(
            vehicles,
            totalMechanicHours
        );


        // Calculate total duration
        let totalDuration = 0;

        result.selectedTasks.forEach(task => {
            totalDuration += task.Duration;
        });


        // Final Output
        const output = {
            totalMechanicHours,
            totalDurationUsed: totalDuration,
            totalImpact: result.totalImpact,
            selectedTasks: result.selectedTasks.map(task => ({
                TaskID: task.TaskID,
                Duration: task.Duration,
                Impact: task.Impact
            }))
        };


        await Log(
            "backend",
            "info",
            "service",
            "Optimization completed successfully"
        );


        console.log(
            JSON.stringify(output, null, 2)
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