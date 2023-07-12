const { extractUserFromCookie, extractUserFromRequest, generateJWTPayload, encodeJWT, extractReturnToFromRequest } = require('./ssohelper');
const { REDIRECTURL, LOGINFAILEDURL } = require("./constants.js");
const { readToken, storeToken } = require('./tokenservice');

const register = (app) => {

    app.post('/login', (req, res) => {
        console.log(' username ', req.body);
        res.cookie('user_name', req.body.username);

        // Generate JWT object
        const jwtPayload = generateJWTPayload(req.body.username);
        // Encode JWT object into a token
        const token = encodeJWT(jwtPayload);
        storeToken(req.body.username, token);

        res.redirect('/home.html');
    });

    /*
    ajax call to display the token in browser 
    */
    app.get('/userinfo', (req, res) => {
        // Get currently logged in user
        const username = extractUser(req);
        const token = readToken(username);
        res.send(token);
    });

    // this is now renamed to ssohandler and changed to post 
    app.post('/ssohandler', (req, res) => {


        // Get currently logged in user
        const username = extractUserFromRequest(req);
        console.log(' Get currently logged in user ', username);

        // If user is not logged in, redirect to main login page
        if (username == null) {
            console.log(' user is not logged in, redirect to main login page ');
            res.redirect(`${LOGINFAILEDURL}`);
            return;
        }


        //I've solved the 'not logging in the second time' issue.
        //let token = readToken(username); 
        //removed if check 
        let token = null;

        //if( !token ) {
        // Generate JWT object
        const jwtPayload = generateJWTPayload(req.body.username);
        // Encode JWT object into a token
        token = encodeJWT(jwtPayload);
        //storeToken(req.body.username,token);
        //}

        /*
        URL request back to Sisense original return URL, including an encrypted token with encoded shared secret.
        */
        let redirectUrl = `${REDIRECTURL}${token}`;
        // Which URL the user was initially trying to open

        const returnTo = extractReturnToFromRequest(req);
        console.log(' returnTo ', returnTo);

        if (returnTo != null && returnTo != "null") {
            redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
        } else {
            // after login need to redirect to home page by default 
            redirectUrl = '/home.html';
        }

        //confusing 
        //let redirectUrl = `${returnTo}/?jwt=${token}`; 
        console.log(' redirectUrl ', redirectUrl);

        // testing iframe change - 1
        res.redirect(redirectUrl);
        // testing iframe change - 2
        /*res.json({
            status:"LOGIN_SUCCESS",
            redirectUrl:redirectUrl
        })*/
    });

    app.get('/ssohandler', (req, res) => {

        // Get currently logged in user
        const username = extractUserFromCookie(req);
        console.log(username);

        // If user is not logged in, redirect to main login page
        if (username == null) {
            console.log(' user is not logged in, redirect to main login page ');
            res.redirect(`${LOGINFAILEDURL}`);
            return;
        }



        // Generate JWT object
        const jwtPayload = generateJWTPayload(username);
        // Encode JWT object into a token
        let token = encodeJWT(jwtPayload);

        /*
        URL request back to Sisense original return URL, including an encrypted token with encoded shared secret.
        */
        let redirectUrl = `${REDIRECTURL}${token}`;
        const returnTo = req.query.return_to;

        console.log(' returnTo ', returnTo);

        if (returnTo != null && returnTo != "null") {
            redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
        } else {
            // after login need to redirect to home page by default 
            redirectUrl = '/home.html';
        }

        //confusing 
        //let redirectUrl = `${returnTo}/?jwt=${token}`; 
        console.log(' redirectUrl ', redirectUrl);

        // testing iframe change - 1
        res.redirect(redirectUrl);

    });

    /*app.get('/validateuser', (req, res) => {

        // Get currently logged in user
        const username = extractUser(req);
        console.log(' Get currently logged in user ',username);

        // If user is not logged in, redirect to main login page
        if(username == null)
        {      
            console.log(' user is not logged in, redirect to main login page ');      
            res.redirect(`${LOGINFAILEDURL}`);
            return;
        }

        const token = readToken(username);

        let redirectUrl = `${REDIRECTURL}${token}`;
        // Which URL the user was initially trying to open
        const returnTo = req.query["return_to"];
        console.log(' returnTo ',returnTo);  

        if (returnTo != null)
        {
            redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
        }

        console.log(' redirectUrl ',redirectUrl);

        res.redirect(redirectUrl);
    });*/

    /*app.get('/validateuser_old', (req, res) => {

        // Get currently logged in user
        const username = extractUser(req);
        console.log(' Get currently logged in user ',username);

         // If user is not logged in, redirect to main login page
        if(username == null)
        {      
            console.log(' user is not logged in, redirect to main login page ');      
            res.redirect(`${LOGINFAILEDURL}`);
            return;
        }

        // Generate JWT object
        const jwtPayload = generateJWTPayload(username);
        // Encode JWT object into a token
        const token = encodeJWT(jwtPayload);

        // get token of the currently logged in user 

        let redirectUrl = `${REDIRECTURL}${token}`;
        // Which URL the user was initially trying to open
        const returnTo = req.query["return_to"];
        console.log(' returnTo ',returnTo);  

        if (returnTo != null)
        {
            redirectUrl += `&return_to=${encodeURIComponent(returnTo)}`;
        }

        console.log(' redirectUrl ',redirectUrl);

        res.redirect(redirectUrl);
    });*/

}

module.exports = { register };