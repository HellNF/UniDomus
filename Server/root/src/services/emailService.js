const mailgun = require("mailgun-js");
require('dotenv').config()
const DOMAIN = "sandbox424a23048d794460b17dcd91029a4a73.mailgun.org";
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN});
const data = {
	from: "Mailgun Sandbox <postmaster@sandbox424a23048d794460b17dcd91029a4a73.mailgun.org>",
	to: "nicolofadiga@gmail.com",
	subject: "Hello",
	text: "Testing some Mailgun awesomness!"
};
mg.messages().send(data, function (error, body) {
	console.log(body);
});

// You can see a record of this email in your logs: https://app.mailgun.com/app/logs.

// You can send up to 300 emails/day from this sandbox server.
// Next, you should add your own domain so you can send 10000 emails/month for free.
