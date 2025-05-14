const AWS = require('aws-sdk');
const ses = new AWS.SES({ endpoint: 'http://localhost:4566', region: 'us-east-1' });

module.exports.email = async (event) => {
  for (const record of event.Records) {
    const { email } = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
    await ses.sendEmail({
      Source: process.env.SES_EMAIL,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: 'LocalStack Email Test' },
        Body: { Text: { Data: 'This is a local test email!' } }
      }
    }).promise();
  }

  return { statusCode: 200 };
};
