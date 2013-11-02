/*!
 * SolveMedia API
 * A Node.JS module that handles calls to SolveMedia.
 * Copyright(c) 2012-2013 Tomás Dias Almeida <tomas.almeida@gmail.com>
 * GPL Licensed
 */

/**
 * Module dependencies.
 */
var crypto = require('crypto'),
    http   = require('http');


//constants
var API_SERVER = 'verify.solvemedia.com';
var API_PATH   = '/papi/verify';
var API_PORT   = 80;
var API_METHOD = 'POST';

/**
 * Constructor
 *
 * @param {String} challengeKey
 * @param {String} verificationKey
 * @param {String} authenticationKey
 * @api public
 */
function SolveMedia(challengeKey, verificationKey, authenticationKey) {
    if ((challengeKey      === undefined) ||
        (verificationKey   === undefined) ||
        (authenticationKey === undefined)) {
        throw new Error('To use SolveMedia you must get an API key from http://www.solvemedia.com');
    }
    this.challengeKey      = challengeKey;
    this.verificationKey   = verificationKey;
    this.authenticationKey = authenticationKey;
};


SolveMedia.prototype.toHTML = function() {
    var htmlCode = "<script type='text/javascript'"                                                                   +
                   "     src='http://api.solvemedia.com/papi/challenge.script?k=" + this.challengeKey + "'>"          +
                   "</script>"                                                                                        +
                   "<noscript>"                                                                                       +
                   "    <iframe src='http://api.solvemedia.com/papi/challenge.noscript?k=" + this.challengeKey + "'"  +
                   "            height='300' width='500' frameborder='0'></iframe><br/>"                              +
                   "    <textarea name='adcopy_challenge' rows='3' cols='40'>"                                        +
                   "    </textarea>"                                                                                  +                                     
                   "    <input type='hidden' name='adcopy_response' value='manual_challenge'/>"                       + 
                   "</noscript>";                                                
    return htmlCode;
}

/**
 * Verify response if it is correct
 *
 * @param {String}   response   - user's response 
 * @param {String}   challenge  - challenge identifier
 * @param {String}   remoteIP   - user's IP
 * @param {Function} cbFromVerify
 */
SolveMedia.prototype.verify = function(response, challenge, remoteIP, cbFromVerify) {
    if ((response  === undefined) ||
        (challenge === undefined) ||
        (remoteIP  === undefined)) {
        throw new Error('Insufficient data provided to verify user response \n' +
                        'response  => ' + response  + '\n' +
                        'challenge => ' + challenge + '\n' +
                        'remoteIP  => ' + remoteIP  + '\n');
    } else {
        verifyUserResponse(response, challenge, remoteIP, this.verificationKey, this.authenticationKey, cbFromVerify);
    }    
}

/**
 * Execute a HTTP Request and recover data response
 *
 * @param {String}   response   - user's response 
 * @param {String}   challenge  - challenge identifier
 * @param {String}   remoteIP   - user's IP
 * @param {String}   privateKey - Verification Key
 * @param {String}   authKey    - Authentication Key
 * @param {Function} cbFromDoHttpPost
 */
function verifyUserResponse(response, challenge, remoteIP, privateKey, authKey, cbFromVerify) {
    var request = "privatekey=" + privateKey + "&" +
                  "challenge="  + challenge  + "&" +
                  "response="   + response   + "&" +
                  "remoteip="   + remoteIP;
    doHttpRequest(request, function(content) {
        validateSMResponse(content, challenge, authKey, cbFromVerify);
    });         
}

/**
 * Execute a HTTP Request and recover data response
 *
 * @param {String}   requestContent   - data to post to SolveMedia
 * @param {Function} cbFromDoHttpPost
 */
function doHttpRequest(requestContent, cbFromDoHttpPost) {
    var request = http.request({
                    host:   API_SERVER,
                    port:   API_PORT,
                    path:   API_PATH,
                    method: API_METHOD,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Content-Length': requestContent.length,                        
                    },
        }, function(response) {
            response.setEncoding('utf8');
            var content = '';
            response.on('data', function(chunk) {
                content += chunk;
            });
            response.on('end', function() {
                cbFromDoHttpPost(content);
            });
        });
        request.setTimeout(10000);
        request.write(requestContent);
        request.end();
}

/**
 * Calculate if SolveMedia response is legitimate
 *
 * @param {String}   content   - response from SolveMedia
 * @param {String}   challenge - challenge identifier
 * @param {String}   authKey   - private authentication key
 * @param {Function} cbFromValidateSMResponse
 */
function validateSMResponse(content, challenge, authKey, cbFromValidateSMResponse) {
    response = content.split('\n');
    isResponseValid = response[0];
    errorMessage    = response[1];
    sha1sumResponse = response[2];

    //validate response
    var sha1sum = crypto.createHash('sha1').update(isResponseValid + challenge + authKey).digest("hex");
    if (sha1sum == sha1sumResponse) {
        cbFromValidateSMResponse(isResponseValid == "true", errorMessage);
    }else{
        cbFromValidateSMResponse(false,"SolveMedia response is not valid (checksum error).")
    }
    
}

module.exports = SolveMedia;
