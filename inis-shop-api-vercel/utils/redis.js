import redis from 'redis'

const client = redis.createClient({
    port      : 13344,               
    host      : 'redis-13344.c9.us-east-1-2.ec2.cloud.redislabs.com',     
    password  : process.env.RedisPassword,    
})

export default client