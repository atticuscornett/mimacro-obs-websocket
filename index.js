const { default: OBSWebSocket } = require('obs-websocket-js');
const actions = require("./actions.json");
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
    return actions;
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
    if (actionID === "toggle-virtual-cam") {
        await obs.call("ToggleVirtualCam");
    }
    if (actionID === "start-virtual-cam") {
        await obs.call("StartVirtualCam");
    }
    if (actionID === "stop-virtual-cam") {
        await obs.call("StopVirtualCam");
    }
    if (actionID === "toggle-replay-buffer") {
        await obs.call("ToggleReplayBuffer");
    }
    if (actionID === "start-replay-buffer") {
        await obs.call("StartReplayBuffer");
    }
    if (actionID === "stop-replay-buffer") {
        await obs.call("StopReplayBuffer");
    }
    if (actionID === "save-replay-buffer") {
        await obs.call("SaveReplayBuffer");
    }
    if (actionID === "toggle-record-pause") {
        await obs.call("ToggleRecordPause");
    }
    if (actionID === "pause-recording") {
        await obs.call("PauseRecord");
    }
    if (actionID === "resume-recording") {
        await obs.call("ResumeRecord");
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