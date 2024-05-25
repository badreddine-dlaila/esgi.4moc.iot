var mqtt = require('mqtt')
var restClient = require('unirest')
var sunCalc = require('suncalc');

const clientId = 'BDL_8e898d9d-181f-4228-8785-d3d8254b4d8b'
const topicPrefix = 'esgi/moc4/<pseudo>'
const tempTopic = `${topicPrefix}/weather/temperature`
const pressureTopic = `${topicPrefix}/weather/pressure`
const humidityTopic = `${topicPrefix}/weather/humidity`
const light1Topic = `${topicPrefix}/light1`
const window1CurrentPositionTopic = `${topicPrefix}/window1/position/current`
const window1TargetPositionTopic = `${topicPrefix}/window1/position/target`
const window1StatePositionTopic = `${topicPrefix}/window1/position/state`


const appId = 'open-weather-map-api-key'
const lat = 48.890046
const lon = 2.381375

var client = mqtt.connect('mqtt://<IP-@>', {
    port: 1883,
    username: '',
    password: '',
    clientId: clientId,
    will: {
        topic: `${topicPrefix}/state`,
        payload: `${clientId} disconnected [${new Date().toLocaleString()}}`,
        qos: 2,
        retain: true
    }
})

client.on('connect', function () {
    client.subscribe('esgi/moc4/#')
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

function getWeatherData(interval) {
    setInterval(async () => {
        Weather
        var endpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}&units=metric&lang=EN`
        restClient
            .get(endpoint)
            .then(function (result) {
                var response = JSON.parse(result.raw_body)
                console.log(response.main)
                client.publish(tempTopic, `${response.main.temp}`, { retain: true, qos: 1 })
                client.publish(pressureTopic, `${response.main.pressure}`, { retain: true, qos: 1 })
                client.publish(humidityTopic, `${response.main.humidity}`, { retain: true, qos: 1 })

            })

        // sun events
        var times = sunCalc.getTimes(new Date(), lat, lon);
        console.log(times)

        if (new Date() <= times.night) {
            // Lights
            client.publish(light1Topic, 'true', { qos: 1 })
            console.log("light1Topic --> true")

            // Windows
            client.publish(window1TargetPositionTopic, '0', { qos: 1 })
            console.log("window1TargetPositionTopic --> 0")

            client.publish(window1StatePositionTopic, 'DECREASING', { qos: 1 })
            console.log("window1StatePositionTopic --> DECREASING")

            await sleep(4000)
            client.publish(window1CurrentPositionTopic, '50', { qos: 1 })
            console.log("window1CurrentPositionTopic --> 50")

            await sleep(4000)
            client.publish(window1CurrentPositionTopic, '0', { qos: 1 })
            console.log("window1CurrentPositionTopic --> 0")

            await sleep(4000)
            client.publish(window1StatePositionTopic, 'STOPPED', { qos: 1 })
            console.log("window1StatePositionTopic --> STOPPED")



        }
        else {
            // Lights
            client.publish(light1Topic, 'false', { qos: 1 })
            console.log("light1Topic --> false")

            // Windows
            client.publish(window1TargetPositionTopic, '100', { qos: 1 })
            console.log("window1TargetPositionTopic --> 100")

            client.publish(window1StatePositionTopic, 'INCREASING', { qos: 1 })
            console.log("window1StatePositionTopic --> INCREASING")

            await sleep(4000)
            client.publish(window1CurrentPositionTopic, '50', { qos: 1 })
            console.log("window1CurrentPositionTopic --> 50")

            await sleep(4000)
            client.publish(window1CurrentPositionTopic, '100', { qos: 1 })
            console.log("window1CurrentPositionTopic --> 100")

            await sleep(4000)
            client.publish(window1StatePositionTopic, 'STOPPED', { qos: 1 })
            console.log("window1StatePositionTopic --> STOPPED")
        }


    }, interval);
}

async function sleep(msec) {
    return new Promise(resolve => setTimeout(resolve, msec));
}
