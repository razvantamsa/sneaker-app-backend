require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

if (!process.env.AWS_EXECUTION_ENV) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });
}

const lambda = new AWS.Lambda();

async function invokeAsyncFunction(FunctionName, payload) {
    try {
      const params = {
        FunctionName,
        InvocationType: 'Event', // Invoke asynchronously
        Payload: JSON.stringify(payload),
      };
  
      return lambda.invoke(params).promise(); // Invoke the function asynchronously
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
}

module.exports = {
    invokeAsyncFunction
}