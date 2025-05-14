const fs = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'ap-southeast-2' });

const ses = new AWS.SES();

const recipient = '<verified recipient email>';

function wrapBase64(str) {
  return str.match(/.{1,76}/g).join('\r\n');
}

const image = wrapBase64(fs.readFileSync('./image.jpg').toString('base64'));


// Use CRLF line endings
const rawEmail = [
  `From: ${sender}`,
  `To: ${recipient}`,
  `Subject: Embedded Image Test`,
  `MIME-Version: 1.0`,
  `Content-Type: multipart/related; boundary="BOUNDARY"`,
  ``,
  `--BOUNDARY`,
  `Content-Type: text/html; charset="UTF-8"`,
  `Content-Transfer-Encoding: 7bit`,
  ``,
  `<!DOCTYPE html>`,
  `<html>`,
  `<body>`,
  `<h1>Embedded Image Test</h1>`,
  `<p>Below is an embedded image:</p>`,
  `<img src="cid:image_cid" alt="Embedded" />`,
  `</body>`,
  `</html>`,
  ``,
  `--BOUNDARY`,
  `Content-Type: image/jpeg`,
  `Content-Transfer-Encoding: base64`,
  `Content-ID: <image_cid>`,
  `Content-Disposition: inline; filename="image.jpg"`,
  ``,
  image,
  ``,
  `--BOUNDARY--`
].join('\r\n');

async function send() {
  try {
    const res = await ses.sendRawEmail({
      Source: sender,
      Destinations: [recipient],
      RawMessage: {
        Data: Buffer.from(rawEmail)
      }
    }).promise();

    console.log('✅ Email sent:', res.MessageId);
  } catch (e) {
    console.error('❌ Failed to send email:', e.message);
  }
}

send(); 
