#!/usr/bin/with-contenv bashio
set -e

if ! bashio::services.available "mqtt"; then
    bashio::log.error "No internal MQTT service not found"
else
    bashio::log.info "MQTT service found, fetching credentials ..."
    MQTT_HOST=$(bashio::services mqtt "host")
    MQTT_PORT=$(bashio::services mqtt "port")
    MQTT_USER=$(bashio::services mqtt "username")
    MQTT_PASSWORD=$(bashio::services mqtt "password")
    
    # Export the variables so they're available to the Node.js application
    export MQTT_HOST="$MQTT_HOST:$MQTT_PORT"
    export MQTT_USER
    export MQTT_PASSWORD
fi

APP_PORT=40002 APP_DEBUG=true APP_PREFIX=/enel APP_LOG_LEVEL=debug APP_JWT_SECRET=$(uuidgen) NODE_ENV=production node app/index.js