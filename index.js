const Influx = require('influx');

const noble = require('@abandonware/noble');


const util = require('util');
const execP = util.promisify(require('child_process').exec);
async function lifepo4WDTset() {
  try {
      const { stdout, stderr } = await execP('sudo /usr/bin/snap run lifepo4 set watchdog_timer 300');
      console.log('stdout:', stdout);
      console.log('stderr:', stderr);
  }catch (err){
     console.error(err);
  };
};



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
        V: Influx.FieldType.FLOAT,

        Bkn: Influx.FieldType.INTEGER,
        Vb: Influx.FieldType.FLOAT,
        Vbmin: Influx.FieldType.FLOAT,
        Ibal:  Influx.FieldType.FLOAT,
        isBal:  Influx.FieldType.FLOAT,
        Vmax: Influx.FieldType.FLOAT,
        Vmin: Influx.FieldType.FLOAT,
        Tmax: Influx.FieldType.FLOAT,
        Tmin: Influx.FieldType.FLOAT,
        VinMax: Influx.FieldType.FLOAT,
        VinMin: Influx.FieldType.FLOAT,
        Ibmax: Influx.FieldType.FLOAT,

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
        'battNumber'
      ]
    }
  ]
});


influx.getDatabaseNames().then(names => {
    //console.log(names);
    if (!names.includes('bms')) {
      return influx.createDatabase('bms')
    }
  }).catch(err => {
    console.log('Error creating Influx database! '+ err);
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
        console.log( peripheral.address);
        console.log(peripheral.id);
        console.log(getBankName(peripheral.advertisement.localName));
        console.log(getBattNumber(peripheral.advertisement.localName));
        console.log(getData(manufacturerData.toString()));
 
        console.log(manufacturerData);
        console.log(manufacturerData.toString());
        console.log(manufacturerData.toString().search(/{/));
        */
        lifepo4WDTset(); //refresh lifepo4 watchdog
        influx.writePoints([
            {
              measurement: 'tsbt',
              tags: { mac: peripheral.address, stringId:peripheral.id, bank: getBankName(peripheral.advertisement.localName), battNumber:getBattNumber(peripheral.advertisement.localName) },
              fields: getData(manufacturerData.toString()),
            }
          ]).catch(err => {
            //console.error(`Error saving data to InfluxDB! ${err.stack}`)
          });  

    }
    }  catch (err){
        console.log(err);
    }
  
  
    }
  
    )  

function getBankName(input){
  try{
    bg=input.search(/ts/i);
    end=bg+4;
    return input.slice(bg,end);
  }catch(err){
    //console.log('getBankNme '+ err);
    return err
  }


    }

function getBattNumber(input){

  try{
    bg=input.search(/ts/i)+5;
    end=bg+5;
    return input.slice(bg,end).trim();
  }catch(err){
    //console.log('getBattNumber '+err);
    return err
  }

    
        }
 function getData(input){

  try{
    bg=input.search(/{/);
      end=input.search(/}/)+1;
      return JSON.parse(input.slice(bg,end).trim());
 
  }catch(err){
    //console.log('getData ' +err);
    return err
  }  
 }   

