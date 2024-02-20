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

// List of OBS Websocket Actions
// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#requests
function onGetActions() {
    return [
        {
            "displayName": "Start Recording",
            "id": "start-recording",
            "ui": []
        },
        {
            "displayName": "Stop Recording",
            "id": "stop-recording",
            "ui": []
        },
        {
          "displayName": "Toggle Recording",
            "id": "toggle-recording",
            "ui": []
        },
        {
            "displayName": "Start Streaming",
            "id": "start-streaming",
            "ui": []
        },
        {
            "displayName": "Stop Streaming",
            "id": "stop-streaming",
            "ui": []
        },
        {
            "displayName": "Toggle Streaming",
            "id": "toggle-streaming",
            "ui": []
        },
        {
            "displayName": "Set Current Scene",
            "id": "switch-scene",
            "ui": [
                {
                    "label": "Scene",
                    "id": "scene",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Set Preview Scene",
            "id": "switch-preview-scene",
            "ui": [
                {
                    "label": "Scene",
                    "id": "scene",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Set Scene Collection",
            "id": "switch-scene-collection",
            "ui": [
                {
                    "label": "Scene Collection",
                    "id": "scene-collection",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Set Profile",
            "id": "switch-profile",
            "ui": [
                {
                    "label": "Profile",
                    "id": "profile",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Mute Input",
            "id": "mute-input",
            "ui": [
                {
                    "label": "Input",
                    "id": "input",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Unmute Input",
            "id": "unmute-input",
            "ui": [
                {
                    "label": "Input",
                    "id": "input",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Toggle Input Mute",
            "id": "toggle-input-mute",
            "ui": [
                {
                    "label": "Input",
                    "id": "input",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Set Input Volume",
            "id": "set-input-volume",
            "ui": [
                {
                    "label": "Input",
                    "id": "input",
                    "type": "string"
                },
                {
                    "label": "Volume (db) ",
                    "id": "volume",
                    "type": "number"
                }
            ]
        },
        {
            "displayName": "Set Current Scene Transition",
            "id": "set-current-scene-transition",
            "ui": [
                {
                    "label": "Transition",
                    "id": "transition",
                    "type": "string"
                }
            ]
        },
        {
            "displayName": "Set Current Scene Transition Duration",
            "id": "set-current-scene-transition-duration",
            "ui": [
                {
                    "label": "Duration (ms)",
                    "id": "duration",
                    "type": "number"
                }
            ]
        }
    ]
}

async function onAction(actionID, settings) {
    if (!connected) {
        return;
    }
    if (actionID === "start-recording") {
        await obs.call("StartRecord");
    }
    if (actionID === "stop-recording") {
        await obs.call("StopRecord");
    }
    if (actionID === "toggle-recording") {
        await obs.call("ToggleRecord");
    }
    if (actionID === "start-streaming") {
        await obs.call("StartStream");
    }
    if (actionID === "stop-streaming") {
        await obs.call("StopStream");
    }
    if (actionID === "toggle-streaming") {
        await obs.call("ToggleStream");
    }
    if (actionID === "switch-scene") {
        await obs.call('SetCurrentProgramScene', {sceneName: settings["scene"]});
    }
    if (actionID === "switch-preview-scene") {
        await obs.call('SetCurrentPreviewScene', {sceneName: settings["scene"]});
    }
    if (actionID === "switch-scene-collection") {
        await obs.call("SetCurrentSceneCollection", {sceneCollectionName: settings["scene-collection"]});
    }
    if (actionID === "switch-profile") {
        await obs.call("SetCurrentProfile", {profileName: settings["profile"]});
    }
    if (actionID === "mute-input") {
        await obs.call("SetInputMute", {inputName: settings["input"], inputMuted: true});
    }
    if (actionID === "unmute-input") {
        await obs.call("SetInputMute", {inputName: settings["input"], inputMuted: false});
    }
    if (actionID === "toggle-input-mute") {
        await obs.call("ToggleInputMute", {inputName: settings["input"]});
    }
    if (actionID === "set-input-volume") {
        await obs.call("SetInputVolume", {inputName: settings["input"], inputVolumeDb: settings["volume"]})
    }
    if (actionID === "set-current-scene-transition") {
        await obs.call("SetCurrentSceneTransition", {transitionName: settings["transition"]});
    }
    if (actionID === "set-current-scene-transition-duration") {
        await obs.call("SetCurrentSceneTransitionDuration", {transitionDuration: settings["duration"]});
    }

    console.log(actionID)
    console.log(settings)
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

module.exports = {onEnable, onDisable, onSettingUpdate, onGetActions, onAction};