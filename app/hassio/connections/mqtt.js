const mqtt = require("mqtt")

/** @param { import('express').Express} app */
module.exports = app => {
    let logger = app.middlewares.log.logger;
    let options = app.hassio.config.options;
    
    // Parse host and port from mqtt_host
    const [host, port] = (options.mqtt_host || '').split(':');
    
    let mqttClient = mqtt.connect({
        host: host || 'localhost',
        port: parseInt(port || '1883', 10),
        username: options.mqtt_user,
        password: options.mqtt_password,
        resubscribe: true,
        keepalive: 10,
        clean: false,
        clientId: 'mqttjs_enel_' + Math.random().toString(16).substring(2, 8),
        reconnectPeriod: 1000 * 1
    })

    mqttClient.on("error", (error) => {
        logger.error("[MQTT] error", error)
    })

    mqttClient.on("connect", () => {
        logger.info("[MQTT] Connected successfully")
    })

    return mqttClient
}