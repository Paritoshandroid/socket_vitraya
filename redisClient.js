const {createClient} = require('redis');
const { promisify } = require('util');
const Promise = require('bluebird');

const client = createClient();

client.connect()
client.on('error', err => console.log('Redis Server Error', err));

let setData = async(key,value)=>{
	await client.set(key, value)
	return;
}

exports.pushData = async(key,value)=>{
	let data = await client.get(key);

	if(data!=null && typeof(data)!=undefined)
	{
		data = data+","+value
	}
	else
		data = value
	await client.set(key,data);
	return;
}


const getRedisGET = async(key)=>{
  const value = await client.get(key);
  return value;
}

exports.getRedisGET = getRedisGET
exports.setData = setData
exports.getData = getRedisGET