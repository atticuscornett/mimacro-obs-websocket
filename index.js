const { default: OBSWebSocket } = require('obs-websocket-js');
let obs = new OBSWebSocket();
let connected = false;
let connectInterval;
let plugin;

async function onEnable(pluginObj) {
    console.log("OBS Studio Shortcuts enabled.");
    plugin = pluginObj;

    registerSetting(plugin, "obs-ip", "OBS Websocket IP", "OBS Websocket IP Address - usually 'localhost'",
        "string", "localhost");
    registerSetting(plugin, "obs-port", "OBS Websocket Port", "OBS Websocket Port - usually '4455'",
        "number", 4444);
    registerSetting(plugin, "obs-password", "OBS Websocket Password", "OBS Websocket Password - leave blank if not set",
        "string", "");
    registerSetting(plugin, "obs-secure", "OBS Websocket Secure", "OBS Websocket Secure - usually 'false'",
        "boolean", false);

    connectInterval = setInterval(async () => {
        if (!connected) {
            console.log("Attempting to connect to OBS...");
            await connectToOBS();
        }
    }, 10000);
}

async function connectToOBS() {
    try{
        if (!connected) {
            let obsURL = (getSetting(plugin, "obs-secure").value ? "wss://" : "ws://") +
                getSetting(plugin, "obs-ip").value + ":" + getSetting(plugin, "obs-port").value;
            let obsPassword = getSetting(plugin, "obs-password").value;
            console.log("Connecting to OBS at " + obsURL + " with password " + obsPassword + "...");
            if (obsPassword === "") {
                await obs.connect(obsURL);
            } else {
                await obs.connect(obsURL, obsPassword);
            }
            connected = true;
            console.log("Connected to OBS.");
        }
    }
    catch (error) {
        connected = false;
    }
    return connected;
}

async function onSettingUpdate() {
    console.log("OBS Websocket settings updated.");
    connected = false;
    try {
        await obs.disconnect()
    } catch (error) {

    }
    await connectToOBS();
}

function onDisable(){
    console.log("OBS Studio Shortcuts disabled.");
    clearInterval(connectInterval);
}

module.exports = {onEnable, onDisable, onSettingUpdate}