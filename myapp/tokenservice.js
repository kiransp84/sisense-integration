let tokenStore = new Map();

const storeToken = (username,token) => {
    //if( !readToken(username) ) {
        console.log(' storing token for user ',username);
        tokenStore.set(username,token);
        return;
    //}
    //console.log(' token exists for user ',username);        
}

const readToken = (username ) => {
    return tokenStore.get(username);
}


module.exports = {storeToken,readToken};