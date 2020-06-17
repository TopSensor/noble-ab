const Influx = require('influx');
const ruuvi = require('node-ruuvitag');

const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'bms',
  schema: [
    {
      measurement: 'tsbt',
      fields: {
        dataFormat: Influx.FieldType.INTEGER,
        rssi: Influx.FieldType.INTEGER,
        temperature: Influx.FieldType.FLOAT,
        humidity: Influx.FieldType.FLOAT,
        pressure: Influx.FieldType.INTEGER,
        accelerationX: Influx.FieldType.INTEGER,
        accelerationY: Influx.FieldType.INTEGER,
        accelerationZ: Influx.FieldType.INTEGER,
        battery: Influx.FieldType.INTEGER,
        txPower: Influx.FieldType.INTEGER,
        movementCounter: Influx.FieldType.INTEGER,
        measurementSequenceNumber: Influx.FieldType.INTEGER
        

      },
      tags: [
        'mac',
        'stringId'
      ]
    }
  ]
});


influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('bms')) {
      return influx.createDatabase('bms');
    }
  })
  .catch(err => {
    console.error('Error creating Influx database!');
  });


ruuvi.on('found', tag => {
  console.log('Found RuuviTag, id: ' + tag.id);
  tag.on('updated', data => {
    console.log('Got data from RuuviTag ' + tag.id + ':\n' +
      JSON.stringify(data, null, '\t'));
    influx.writePoints([
      {
        measurement: 'tsbt',
        tags: { mac: data.mac, stringId: 'banco1' },
        fields: data,
      }
    ]).catch(err => {
      console.error(`Error saving data to InfluxDB! ${err.stack}`)
    });
        
  });
});
