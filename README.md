# mimacro OBS Websocket
## Control OBS Studio using [mimacro](https://github.com/atticuscornett/mimacro)

This plugin allows you to easily control OBS Studio using mimacro.
It connects to OBS Studio using the [OBS Websocket](https://github.com/obsproject/obs-websocket) (built into OBS Studio since version 28.)

### Setup

1. Install the OBS Websocket plugin (if on OBS Studio 27 or earlier.)
2. Install the mimacro plugin.
3. Make sure that OBS Websocket is enabled in OBS Studio (Tools > Websocket Server Settings).
4. Confirm that the mimacro plugin settings match the settings in OBS Studio.
    - For most setups, the default settings should work.
    - Websocket IP should be `localhost` if OBS Studio is running on the same machine as mimacro.
    - Websocket port is typically `4455`.
    - Websocket password is typically empty. (Note: Password is not encrypted by mimacro at this time. Assume other programs can read it. Exercise caution.)
    - Websocket secure should be kept as `false` for most setups.
5. Actions under the `OBS Websocket` category should now function in mimacro.

If you have any issues with setup, please open an issue!

### Features

mimacro OBS Websocket supports most of the commonly used features of OBS Studio, including:

- Start/Stop recordings and streams
- Switch scenes
- Mute/Unmute inputs
- Set volume of inputs
- Control virtual camera
- Control replay buffer
- Control transitions
- More!

If there are any features you would like to see added, please open an issue!