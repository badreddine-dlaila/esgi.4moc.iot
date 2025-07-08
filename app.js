var mqtt = require('mqtt')

var topicPrefix = 'esgi/moc4/<NAME>'
var client = mqtt.connect('mqtt://<IP-@>', {
    port: 1883,
    username: '',
    password: '',
    clientId: '',
    will: {
        topic: `${topicPrefix}/state`,
        payload: `${clientId} disconnected [${new Date().toLocaleString()}}`,
        qos: 2,
        retain: true
    }
})

client.on('connect', function () {
    client.subscribe(`${topicPrefix}/#`, function (err) {
        if (!err) {
            client.publish(`${topicPrefix}/test-nodejs`, 'Hello mqtt')
        }
    })

    getWeatherData(20000)
})

client.on('message', function (topic, message) {
    // message is Buffer
    // console.log(`${topic.toString()} --> ${message.toString()}`)
    // client.end()
})
