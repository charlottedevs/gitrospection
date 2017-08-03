const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('');
  console.log('stdout:', stdout.split('\n').length);
  console.log('stderr:', stderr);
}
lsExample();
