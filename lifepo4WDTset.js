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

//sudo lifepo4 set watchdog_timer 40

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
lifepo4WDTset();