require('dotenv').config({ path: 'src/utils/aws/credentials.env' });
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const postItem = async (TableName, Item) => {
    const params = {
      TableName,
      Item
    };
    await dynamoDB.put(params).promise();
};

const getItem = async (TableName, Key) => {
    const params = {
      TableName,
      Key
    };
    const result = await dynamoDB.get(params).promise();
    return result.Item;
};

const getItemByPk = async (TableName, pkName, pkValue) => {
  const params = {
    TableName,
    KeyConditionExpression: `${pkName} = :${pkName}`,
    ExpressionAttributeValues: {
      [`:${pkName}`]: pkValue
    }
  };
  const result = await dynamoDB.query(params).promise();
  return result.Items;
};

const deleteItem = async (TableName, Key) => {
  const params = {
    TableName,
    Key
  };
  await dynamoDB.delete(params).promise();
};

module.exports = {
  getItem,
  getItemByPk,
  postItem,
  deleteItem,
}