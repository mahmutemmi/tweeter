Tweet something or get last tweet for a user without using twitter api


After cloning run 
npm install and node index.js inside src folder


Server will start listening on port 3000 by default. There are two endpoints, both accept http post requests.


1. http://localhost:3000/tweet

Provide twitter credentials and tweet anything.


accepts post body:

{

  "username": String, -- twitter username to log into
  
  "password": String, -- twitter password to be used
  
  "tweet": String,    -- tweet text
  
  "key": "UgmktpU6WFNA4jCk" -- using simple api key authentication
  
}


returns 

{

  "success": bool,             -- true/false
  
  "text": "tweet successful"   
  
}


2. http://localhost:3000/get-last-tweet
Get public last tweet from a twitter user


accepts post body:

{

  "username": String, -- twitter username to get the last tweet from
  
  "key": "UgmktpU6WFNA4jCk" -- using simple api key authentication
  
}
