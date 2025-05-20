const fs = require("fs");

/** @param { import('express').Express } app */
module.exports = app => {
    const isProduction = process.env.NODE_ENV === "production";
    const optionsPath = isProduction ? '/data/options.json' : './options-mock.json';

    // Check if options file exists
    if (!fs.existsSync(optionsPath)) {
        if (isProduction) {
            throw new Error(`Configuration file not found: ${optionsPath}. Please ensure the file exists and contains valid configuration.`);
        } else {
            throw new Error(`Development configuration file not found: ${optionsPath}. Please copy options-mock-example.json to options-mock.json and update with your configuration.`);
        }
    }

    try {
        const rawOptions = fs.readFileSync(optionsPath, 'utf8');
        const optionsFromFile = JSON.parse(rawOptions);

        // Validate required fields
        const requiredFields = ['email', 'password', 'mqtt_host', 'mqtt_user', 'mqtt_password', 'instalation', 'update_interval', 'temp_token'];
        const missingFields = requiredFields.filter(field => !(field in optionsFromFile));
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`);
        }

        return {
            email: optionsFromFile.email,
            password: optionsFromFile.password,
            mqtt_host: optionsFromFile.mqtt_host,
            mqtt_user: optionsFromFile.mqtt_user,
            mqtt_password: optionsFromFile.mqtt_password,
            instalation: optionsFromFile.instalation,
            update_interval: optionsFromFile.update_interval,
            temp_token: optionsFromFile.temp_token,
            server_only: false
        };
    } catch (error) {
        if (error.message.includes('Missing required configuration')) {
            throw error;
        }
        throw new Error(`Failed to load configuration file: ${error.message}`);
    }
};