// msalConfig.js
export const msalConfig = {
  auth: {
    clientId: "c2b4a4d1-98e5-4b83-99d3-1a869272d352",           
    authority: "https://login.microsoftonline.com/c6f27cf5-170b-4196-b07c-7a68034b767d", 
    redirectUri: "http://localhost:3000",      
  },
  cache: {
    cacheLocation: "localStorage",             
    storeAuthStateInCookie: false,             
  }
};


export const loginRequest = {
  scopes: ["User.Read"] 
};
