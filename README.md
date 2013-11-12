solvemedia-nodejs
=========

An independent node.js module that handles calling Solve Media captchas. This module is not related to Solve Media Company and it is just a help to people who want to use Solve Media products in node.js solutions.

## How to use 
(see http://github.com/tomasalmeida/solvemedia-nodejs/tree/master/examples)

### Display the captcha

```js
  var Solvemedia = require('solvemedia');
  
  //Create a new instance of solvemedia, setting your three keys
  var sm = new Solvemedia('Challenge Key','Verification Key','Authentication Hash Key');

  // First: display the captcha
  var html = sm.toHTML();
  // Display a form

```

### Customizations
SolveMedia API offers some customization to your captcha (language and color)

```js
  var Solvemedia = require('solvemedia');

  //Create a new instance of solvemedia, setting your three keys
  var sm = new Solvemedia('Challenge Key','Verification Key','Authentication Hash Key');

  // First: display the captcha
  var html0 = sm.toHTML();                           // no customization
  var html1 = sm.toHTML(sm.LANG.FR, sm.THEME.BLACK); // text in French and captcha in black
  var html2 = sm.toHTML(sm.LANG.PT);                 // text in Portuguese (no color customized)
  var html3 = sm.toHTML(sm.THEME.RED);               // Captcha in RED (no text customized)
  // Display a form
```

The complete list of customization is:

```js
<your instance>.LANG.EN
<your instance>.LANG.DE
<your instance>.LANG.FR
<your instance>.LANG.ES
<your instance>.LANG.IT
<your instance>.LANG.YI
<your instance>.LANG.JA
<your instance>.LANG.CA
<your instance>.LANG.PL
<your instance>.LANG.HU
<your instance>.LANG.SV
<your instance>.LANG.NO
<your instance>.LANG.PT
<your instance>.LANG.NL
<your instance>.LANG.TR

<your instance>.THEME.BLACK
<your instance>.THEME.WHITE
<your instance>.THEME.PURPLE
<your instance>.THEME.RED
```

### Validate user response

```js
  var Solvemedia = require('solvemedia');
  
  //Create a new instance of solvemedia, setting your three keys
  var sm = new Solvemedia('Challenge Key','Verification Key','Authentication Hash Key');

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
            ...
        }
    });
	
	
```

## License

Apache v2 License
