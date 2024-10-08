const sendList = require("../../sendList.json");
const fs = require('fs');

function getPing(time) {
    return sendList.filter(ping => ping.time === String(time));
}

function setPing(id, channelID, roleID, time, path) {
    let ping = {
        id: id,
        channelID: channelID,
        roleID: roleID,
        time: time
    };

    if (sendList.some(ping => ping.channelID === channelID)) {
        sendList.splice(sendList.findIndex(ping => ping.channelID === channelID), 1);
    }
    sendList.push(ping);


    console.log(sendList);

    console.log("Ping:");
    console.log(ping);

    fs.writeFileSync(path, JSON.stringify(sendList, null, 4));
}

function removePing(channelID, path) {
    sendList.splice(sendList.findIndex(ping => ping.channelID === channelID), 1);

    fs.writeFileSync(path, JSON.stringify(sendList, null, 4));
}

function listPings(serverID, client) {
    return sendList.filter(async ping => await client.channels.fetch(ping.channelID) === serverID);
}


function existPing(channelID) {
    return sendList.some(ping => ping.channelID === channelID);
}

module.exports = { getPing, setPing, removePing, existPing, listPings };
