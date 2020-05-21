const axios = require('axios')

module.exports=(server) =>{
  server.use((ctx,next)=>{
    if(ctx.path === '/auth'){
      const code = ctx.query.code
      if(!code){
        ctx.body = 'code not exist'
        return
      }
    } else {
      await next()
    }
  })
}