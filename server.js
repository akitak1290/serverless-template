const AWS = require('aws-sdk');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1'
});

app.post('/write', async (req, res) => {
  const { email } = req.body;
  const userId = uuidv4();

  await dynamo.put({
    TableName: 'local-users',
    Item: { userId, email }
  }).promise();

  res.json({ message: 'User written', userId });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
