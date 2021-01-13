# ZoomOSC-QLab-Chat-Control
## Uses [Node.js](https://nodejs.org/) to convert ZoomOSC chat into OSC commands for [QLab](https://qlab.app/). Basically A Remote 'GO' Button for Stage Managers via Chat.

### Requires:

### [QLab](https://qlab.app/) (All License Types), [ZoomOSC](https://www.liminalet.com/zoomosc-downloads), [Node.js](https://nodejs.org/), & [node-osc](https://github.com/MylesBorins/node-osc).




Example Video:


<a href="https://www.youtube.com/watch?v=FAjRaYfRD_4" target="_blank"><img src="http://img.youtube.com/vi/FAjRaYfRD_4/0.jpg" 
alt="ZoomOSC-QLab-Chat-Control Example Video" width="300" height="180" border="10" /></a>
#
## Installation and Setup:

- Download, Install, and Open [QLab](https://qlab.app/)
- Download, Install, and Open [ZoomOSC](https://www.liminalet.com/zoomosc-downloads)
- Download and Install [Node.js](https://nodejs.org/)
- Clone or Download this repository
- Open in preferred source code editor (ex. [Visual Studio Code](https://code.visualstudio.com/download) or Terminal/Command Prompt)
  - If you use Visual Studio Code...
  - Go to "View > Command Palette..."
  -  Type "Git: Clone" [Enter]
  -  Paste the Github Clone HTTPS URL. This is the same as the URL just with ".git" added to the end (https://github.com/jshea2/ZoomOSC-Qlab-Chat-Control.git)
- Open code editor's Terminal
- Install node-osc: `npm install` (installs dependencies from 'package.json')
  
  
  
  or install seperately
  - `npm install node-osc`
  
  

  (Use `sudo` if on Mac)

 #
 
 ## Using ZoomOSC-QLab-Chat-Control:

 - Run node file in Terminal: `start npm`
    - or `node main.js`
 - Make sure the remote Zoom participant or "Stage Manager" who is controlling QLab is named **"SM"** in Zoom
  
## "SM" Chat Commands:

- `g`, `G`, or `;`: Triggers a GO OSC Command ("/go") to QLab
- `g2q [Cue Number]` or `G2q [Cue Number]`: Triggers a Go To Cue OSC Command ("/go/[Cue Number]") to Qlab 
    - (Ex. `g2q A4` will trigger Cue Number A4 in Qlab)
- `!`: Triggers a Panic OSC Command ("/panic") to QLab

## Notes: 

- The response messages back might be duplicated
- If you don't want to send any responses back, just comment out lines 82-88:
  ``` javascript
  //Send Update Requests Command, So Qlab Will Send OSC When Anything Happens in QLab 
    client.send('/updates', 1)

    //This is the same as above, but it does it every 59 seconds, because QLab times out after 1min apparently.
    setInterval(() => {
        client.send('/updates', 1)
    }, 59000);
    ```

#


Join the Discord server to chat: 

<a href="https://discord.gg/FJ79AKPgSk">
        <img src="https://img.shields.io/discord/308323056592486420?logo=discord"
            alt="chat on Discord"></a>
