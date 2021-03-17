//ZoomOSC-QLab-Chat-Control
//by Joe Shea

const { Client, Server } = require('node-osc');

//OSC Server (Into Node.js) Config
const oscServerIp = "127.0.0.1";
const oscPortIn = 3333;
//OSC Client (To Qlab) Config
const oscClientIp = "127.0.0.1";
const oscPortOut = 53000;
//ZoomOSC Server (From ZoomOSC) Config
const zoomOSCServerIp = "127.0.0.1";
const zoomOSCPortIn = 1234;
//ZoomOSC Client (To ZoomOSC) Config
const zoomOSCClientIp = "127.0.0.1";
const zoomOSCPortOut = 9090;
//QLab OSC Response Server (From Qlab) Config
const qlabOscServerIp = "127.0.0.1";
const qlabOscPortIn = 53001;

//Connect to OSC
const client = new Client(oscClientIp, oscPortOut);
const clientZoom = new Client(zoomOSCClientIp, zoomOSCPortOut);
var server = new Server(oscPortIn, oscServerIp);
var serverZoom = new Server(zoomOSCPortIn, zoomOSCServerIp);
var serverQlab = new Server(qlabOscPortIn, qlabOscServerIp)

//ZoomOSC Server (IN)
server.on('listening', () => {
  console.log("\n\n" + 'Listening to Incoming OSC on...\n IP: ' + oscServerIp + '\n Port: ' + oscPortIn);
  console.log("\n\n" + 'Listening to QLab OSC Server on...\n IP: ' + qlabOscServerIp + '\n Port: ' + qlabOscPortIn);
  console.log('\nSending OSC back to QLab on...\n IP: ' + oscClientIp + '\n Port: ' + oscPortOut);
  console.log("\n\n" + 'Listening to ZoomOSC Server on...\n IP: ' + zoomOSCServerIp + '\n Port: ' + zoomOSCPortIn);
  console.log('\nSending OSC back to ZoomOSC on...\n IP: ' + zoomOSCClientIp + '\n Port: ' + zoomOSCPortOut + '\n\n---------------------------------------\n\n');
})

clientZoom.send("/zoom/subscribe", 2)

//Qlab Response to ZoomOSC "SM" Playhead Cue via Chat
serverQlab.on('message', (msg) => {
     //console.log(msg)
     let parse
     let currentCue
     
    if(msg[0].includes('playbackPosition')){
        client.send('/cue/playhead/number')
        client.send('/runningCues/shallow')
    }

    if(msg[0].includes('/runningCues/shallow')){
        let runningCue = JSON.parse(msg[1])

        if (runningCue.data[0] !== undefined){
            if (!runningCue.data[2]){
            clientZoom.send('/zoom/userName/chat', 'SM', `** CUE "${runningCue.data[1].number}" Triggered! **`)
            //clientZoom.send('/zoom/chat', 'SM', `-                                       -`)
        console.log(`Qlab Cue "${runningCue.data[1].number}" was Triggered`)
            } else {
                clientZoom.send('/zoom/userName/chat', 'SM', `** CUE "${runningCue.data[2].number}" Triggered! **`)
            //clientZoom.send('/zoom/chat', 'SM', `-                                       -`)
        console.log(`Qlab Cue "${runningCue.data[2].number}" was Triggered`)
            }
        //console.log(runningCue.data)
        }
        
    }

    if(msg[0].includes('/number') && msg[0].includes('/reply')){
        parse = JSON.parse(msg[1])
        currentCue = parse.data
        //clientZoom.send('/zoom/chat', 'SM', `-- standing by cue: "${currentCue}" --`)
        setTimeout(() => {
            clientZoom.send('/zoom/userName/chat', 'SM', `-- standing by cue: "${currentCue}" --`)
            console.log(`\n'${currentCue}' - Qlab Cue Stading By\n`)
        }, 400); 
        
        //console.log(currentCue)
    }


})

//Send Update Requests Command, So Qlab Will Send OSC When Anything Happens in QLab 
client.send('/updates', 1)

//This is the same as above, but it does it every 59 seconds, because QLab times out after 1min apparently.
setInterval(() => {
    client.send('/updates', 1)
}, 59000);

//Turns OFF and ON Sources Depending On Participants Zoom Status
serverZoom.on('message', (msg) => {

    console.log(msg.toString())
    
    if (msg[0] === "/zoomosc/user/chat" && msg[2] === "SM" && msg[5] === ";" || msg[5] === "G" || msg[5] === "g"){
        console.log("\nSM Triggered a 'GO' Command to Qlab\n")
        client.send(`/go`, (err) => {  //Takes OBS Scene Name and Sends it Out as OSC String (Along with Prefix and Suffix)
            if (err) console.error(err);
          });
    } 
    
    else if(msg[0] === "/zoomosc/user/chat" && msg[2] === "SM" && msg[5] === "!"){
        console.log("\nSM has Triggered a 'PANIC' to Qlab\n")
        clientZoom.send("/zoom/chat", "SM", "-- PANIC in QLab was Triggered --")
        client.send(`/panic`, (err) => {  //Takes OBS Scene Name and Sends it Out as OSC String (Along with Prefix and Suffix)
            if (err) console.error(err);
          });
    }

    else if(msg[0] === "/zoomosc/user/chat" && msg[2] === "SM"){
        if(msg[5].includes("G2q") || msg[5].includes("g2q")){
        var g2qMessage = msg[5].substring(4)
        console.log(`\nSM Triggered Qlab Cue: '${g2qMessage}'\n`)
        client.send(`/go/${g2qMessage}`);
        }
    } 
})
