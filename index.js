const Influx = require('influx');

const noble = require('@abandonware/noble');


const influx = new Influx.InfluxDB({
  host: 'localhost',
  database: 'bms',
  schema: [
    {
      measurement: 'tsbt',
      fields: {
        rssi: Influx.FieldType.INTEGER,
        T: Influx.FieldType.FLOAT,
        I: Influx.FieldType.FLOAT,
        V: Influx.FieldType.INTEGER,
        txPower: Influx.FieldType.INTEGER,
        measurementSequenceNumber: Influx.FieldType.INTEGER,
        mac: Influx.FieldType.STRING, 
        bank: Influx.FieldType.STRING, 
        battNumber: Influx.FieldType.STRING
      },
      tags: [
        'mac',
        'stringId',
        'bank',
        'batt'
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

noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
      noble.startScanning([],true);
    } else {
      noble.stopScanning();
    }
  });

  noble.on('discover', function (peripheral) {
  
    try{
      const manufacturerData = peripheral.advertisement ? peripheral.advertisement.manufacturerData : undefined;
      if (manufacturerData && manufacturerData.toString().search(/{/)>=0 && peripheral.advertisement.localName.search(/ts/i)>=0){
       /*
        console.log(peripheral.advertisement.localName);
        console.log(manufacturerData);
        console.log(manufacturerData.toString());
        console.log(manufacturerData.toString().search(/{/));
        */
        influx.writePoints([
            {
              measurement: 'tsbt',
              tags: { mac: peripheral.address, stringId:peripheral.id, bank: getBankName(peripheral.advertisement.localName), battNumber:getBattNumber(peripheral.advertisement.localName) },
              fields: getData(manufacturerData),
            }
          ]).catch(err => {
            console.error(`Error saving data to InfluxDB! ${err.stack}`)
          });  

    }
    }  catch (err){
        //console.log(err);
    }
  
  
    }
  
    )  

function getBankName(input){
  bg=input.search(/ts/i);
  end=bg+4;
  return input.slice(bg,end);

    }

function getBattNumber(input){
      bg=input.search(/ts/i)+5;
      end=bg+5;
      return input.slice(bg,end).trim();
    
        }
 function getData(input){
     bg=input.search(/{/);
     end=input.search(/}/)+1;
     return JSON.parse(input.slice(bg,end).trim());

 }   

