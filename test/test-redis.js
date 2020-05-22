const Redis = require('ioredis');
async function test() {
  const ioredis = new Redis(6379, '192.168.99.100');
  ioredis.set('key', 'value');
  const keys = await ioredis.keys('*');

  console.log(keys);
}
test();
