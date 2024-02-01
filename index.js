const { default: OBSWebSocket } = require('obs-websocket-js');
let obs = new OBSWebSocket();
let connected = false;

async function onEnable(plugin) {
    console.log("OBS Studio Shortcuts enabled.");

    registerSetting(plugin, "obs-ip", "OBS Websocket IP", "OBS Websocket IP Address - usually 'localhost'",
        "string", "localhost");
    registerSetting(plugin, "obs-port", "OBS Websocket Port", "OBS Websocket Port - usually '4455'",
        "number", 4444);
    registerSetting(plugin, "obs-password", "OBS Websocket Password", "OBS Websocket Password - leave blank if not set",
        "string", "");
    registerSetting(plugin, "obs-secure", "OBS Websocket Secure", "OBS Websocket Secure - usually 'false'",
        "boolean", false);

    try{
        await obs.connect("ws://localhost:4444");
        connected = true;
    }
    catch (e) {
        connected = false
    }


}

function onDisable(){
    console.log("OBS Studio Shortcuts disabled.");
}

module.exports = {onEnable}