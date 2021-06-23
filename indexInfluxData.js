const {InfluxDB} = require('@influxdata/influxdb-client')

// You can generate a Token from the "Tokens Tab" in the UI
const token = 'VFxfAuVt1I_y9HUXTiptw394T5ip--nwklJ9sfiRm6FvZi2qnoJ2HA5mhYGhVugJOD5AgBmE7ekcg27vcubDUw=='
const org = 'eugenio@esg.eng.br'
const bucket = 'tsbt'

const client = new InfluxDB({url: 'https://us-central1-1.gcp.cloud2.influxdata.com', token: token})

const {Point} = require('@influxdata/influxdb-client')
const writeApi = client.getWriteApi(org, bucket)


const noble = require('@abandonware/noble');
/*
// write to lifepo4 WDT
const { exec } = require('child_process');
exec('sudo /usr/bin/snap run lifepo4 set watchdog_timer 40', (err, stdout, stderr) => {
  if (err) {
    //some err occurred
    console.error(err)
  } else {
   // the *entire* stdout and stderr (buffered)
   console.log(`stdout: ${stdout}`);
   console.log(`stderr: ${stderr}`);
  }
});
*/
noble.on('stateChange', function (state) {
    if (state === 'poweredOn') {
      noble.startScanning([],true);
    } else {
      noble.stopScanning();
      writeApi
      .close()       
      .then(() => {
          console.log('FINISHED')
      })
      .catch(e => {
          console.error(e)
          console.log('Finished ERROR')
      })
    }
  });

noble.on('discover', function (peripheral) {
  
    try{
      const manufacturerData = peripheral.advertisement ? peripheral.advertisement.manufacturerData : undefined;
      if (manufacturerData && manufacturerData.toString().search(/{/)>=0 && peripheral.advertisement.localName.search(/ts/i)>=0){
 //       lifepo4WDTset(); //refresh lifepo4 watchdog
                field= getData(manufacturerData.toString());
                writeApi.useDefaultTags({mac: peripheral.address, stringId:peripheral.id, bank: getBankName(peripheral.advertisement.localName), battNumber:getBattNumber(peripheral.advertisement.localName)})

                const point = new Point('tsbt')
                .floatField(Object.keys(field)[0], Object.values(field)[0])
                writeApi.writePoint(point)
 
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

