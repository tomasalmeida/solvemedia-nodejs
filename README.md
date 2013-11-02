solvemedia-nodejs
=========

An independent node.js module that handles calling Solve Media captchas. This module is not related to Solve Media Company and it is just a help to people who want to use Solve Media products in node.js solutions.

## How to use (see also https://github.com/tomasalmeida/solvemedia-nodejs/tree/master/examples)

Create a new instance of solvemedia, setting your three keys

```js
  var Solvemedia = require('solvemedia');
  var sm = new Solvemedia('Challenge Key','Verification Key','Authentication Hash Key');

  // First: display the captcha
  var html = sm.toHTML();
	// Display a formular
	
	.
	.
	.
	
  //Second Step: validate a response
	sm.verify(req.body.adcopy_response,     // User's response
	          req.body.adcopy_challenge,    // Challenge id
	          req.connection.remoteAddress, // User's IP
	          function(isValid,errorMessage){
        if (isValid) {
            // YES, user is not a robot :-)
            ...
        } else {
            // Oooops! User wrongly answered... 
            // handle this case (reshow the form, show a message...)
            // errorMessage contains an error Message like "wrong answer"
        }
    });
	
	
```

## License

GNU GENERAL PUBLIC LICENSE (http://www.gnu.org/licenses/gpl-3.0.txt)
