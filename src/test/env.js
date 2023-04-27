const prefix = 'RSS_'
const parseEnv = () => {
  
  const result = Object.entries(process.env)
    .map(([key, val]) => `${prefix}${key}=${val}`)
    .join(', ')
  console.log(result)

};

parseEnv();


//USER_ID=12345 USER_NAME=foo node app.js