function getRedisSessionId(sid) {
  return `ssid:${sid}`;
}

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  } //接收redis的client对象

  //获取Redis中存储的session数据
  async get(sid) {
    // console.log('get session', sid);
    const id = getRedisSessionId(sid);
    const data = await this.client.get(id);
    if (!data) {
      return null;
    }
    try {
      const result = JSON.parse(data);
      return result;
    } catch (err) {
      console.error(err);
    }
  }
  //存储session到redis, id, session值, 到期时间
  async set(sid, sess, ttl) {
    // console.log('set session', sid);
    const id = getRedisSessionId(sid);
    if (typeof ttl === 'number') {
      ttl = Math.ceil(ttl / 1000); //转换成秒
    }
    try {
      const sessStr = JSON.stringify(sess);
      if (ttl) {
        await this.client.setex(id, ttl, sessStr);
      } else {
        await this.client.set(id, sessStr);
      }
    } catch (err) {
      console.error(err);
    }
  }
  //销毁id
  async destroy(sid) {
    // console.log('delete session', sid);
    const id = getRedisSessionId(sid);
    await this.client.del(id);
  }
}

module.exports = RedisSessionStore;
