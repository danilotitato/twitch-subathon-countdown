if (streamlabs_token !== "") {
    socket = io(`https://sockets.streamlabs.com?token=${streamlabs_token}`, {transports: ['websocket']});

    socket.on("connect", () => {
        logMessage("Streamlabs", "Socket Connected");
    });

    socket.on("event", (event) => {
        logObject("Streamlabs", event);
        let factor_t1_local = (happy_hour_active ? factor_t1 : 1) * (random_hour_active ? randomInRangeNoRounding(...range_t1): 1);
        let factor_t2_local = (happy_hour_active ? factor_t2  : 1) * (random_hour_active ? randomInRangeNoRounding(...range_t2): 1);
        let factor_t3_local = (happy_hour_active ? factor_t3 : 1) * (random_hour_active ? randomInRangeNoRounding(...range_t3): 1);
        let factor_bits_local = (happy_hour_active ? factor_bits : 1) * (random_hour_active ? randomInRangeNoRounding(...range_bits): 1);
        let factor_donations_local = (happy_hour_active ? factor_donations : 1) * (random_hour_active ? randomInRangeNoRounding(...range_donations): 1);

        if (event.type == "subscription" && !event.message[0].gifter) {
            if (!countdownEnded && subEnable) {
                if (event.message[0].sub_plan == "1000") {
                    addTime(endingTime, seconds_added_per_sub_tier1 * factor_t1_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_sub_tier1 * factor_t1_local} Seconds Because ${event.message[0].name} Subscribed With Tier 1`);
                }
                else if (event.message[0].sub_plan == "2000") {
                    addTime(endingTime, seconds_added_per_sub_tier2 * factor_t2_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_sub_tier2 * factor_t2_local} Seconds Because ${event.message[0].name} Subscribed With Tier 2`);
                }
                else if (event.message[0].sub_plan == "3000") {
                    addTime(endingTime, seconds_added_per_sub_tier3 * factor_t3_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_sub_tier3 * factor_t3_local} Seconds Because ${event.message[0].name} Subscribed With Tier 3`);
                }
                else {
                    addTime(endingTime, seconds_added_per_sub_prime * factor_t1_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_sub_prime * factor_t1_local} Seconds Because ${event.message[0].name} Subscribed With Prime`);
                }
                if (!users.includes(event.message[0].name)) {
                    users.push(event.message[0].name);
                }
            }
        }

        else if (event.type == "resub" && !event.message[0].gifter) {
            if (!countdownEnded && subEnable) {
                if (event.message[0].sub_plan == "1000") {
                    addTime(endingTime, seconds_added_per_resub_tier1 * factor_t1_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_resub_tier1 * factor_t1_local} Seconds Because ${event.message[0].name} ReSubscribed With Tier 1`);
                }
                else if (event.message[0].sub_plan == "2000") {
                    addTime(endingTime, seconds_added_per_resub_tier2 * factor_t2_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_resub_tier2 * factor_t2_local} Seconds Because ${event.message[0].name} ReSubscribed With Tier 2`);
                }
                else if (event.message[0].sub_plan == "3000") {
                    addTime(endingTime, seconds_added_per_resub_tier3 * factor_t3_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_resub_tier3 * factor_t3_local} Seconds Because ${event.message[0].name} ReSubscribed With Tier 3`);
                }
                else {
                    addTime(endingTime, seconds_added_per_resub_prime * factor_t1_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_resub_prime * factor_t1_local} Seconds Because ${event.message[0].name} ReSubscribed With Prime`);
                }
                if (!users.includes(event.message[0].name)) {
                    users.push(event.message[0].name);
                }
            }
        }

        else if (event.message[0].gifter) {
            if (!countdownEnded && subEnable) {
                if (event.message[0].sub_plan == "1000") {
                    addTime(endingTime, seconds_added_per_giftsub_tier1 * factor_t1_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_giftsub_tier1 * factor_t1_local} Seconds Because ${event.message[0].gifter} Gifted A Tier 1 Sub`);
                }
                else if (event.message[0].sub_plan == "2000") {
                    addTime(endingTime, seconds_added_per_giftsub_tier2 * factor_t2_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_giftsub_tier2 * factor_t2_local} Seconds Because ${event.message[0].gifter} Gifted A Tier 2 Sub`);
                }
                else if (event.message[0].sub_plan == "3000") {
                    addTime(endingTime, seconds_added_per_giftsub_tier3 * factor_t3_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_giftsub_tier3 * factor_t3_local} Seconds Because ${event.message[0].gifter} Gifted A Tier 3 Sub`);
                }
                if (!users.includes(event.message[0].name)) {
                    users.push(event.message[0].name);
                }
            }
        }

        else if (event.type == "donation") {
            if (!countdownEnded && donationEnable) {
                let dono = parseInt(event.message[0].amount);
                let currency = event.message[0].currency;
                if (dono >= min_donation_amount) {
                    let times = Math.floor(dono/min_donation_amount);
                    addTime(endingTime, seconds_added_per_donation * times * factor_donations_local);
                    logMessage("Streamlabs", `Added ${seconds_added_per_donation * times} Seconds Because ${event.message[0].name} Donated ${dono} ${currency}`);
                    if (!users.includes(event.message[0].name)) {
                        users.push(event.message[0].name);
                    }
                }
            }
        }

        else if (event.type == "bits") {
            if (!countdownEnded && donationEnable) {
                let bits = parseInt(event.message[0].amount);
                if (bits >= min_amount_of_bits) {
                    let times = Math.floor(bits/min_amount_of_bits);
                    addTime(endingTime, seconds_added_per_bits * times);
                    logMessage("Streamlabs", `Added ${seconds_added_per_bits * times * factor_bits_local} Seconds Because ${event.message[0].name} Donated ${bits} Bits`);
                    if (!users.includes(event.message[0].name)) {
                        users.push(event.message[0].name);
                    }
                }
            }
        }
    });

    socket.on("disconnect", () => {
        logMessage("Streamlabs", "Socket Disconnected");
        socket.connect();
    });
}