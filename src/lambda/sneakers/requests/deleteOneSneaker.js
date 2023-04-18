const express = require('express');
const { deleteItem: deleteDynamoDB } = require('../../../utils/aws/dynamodb');
const { deleteItem: deleteS3 } = require('../../../utils/aws/s3');
const router = express.Router();

const { DYNAMODB_SNEAKERS_TABLE, S3_BUCKET_NAME } = process.env;

router.delete('/:brand/:model', async (req, res) => {
    const { brand, model } = req.params;

    const files = ['pic1', 'pic2', 'pic3', 'pic4'];
    for(const file of files) {
        const key = `${brand}/${model}/${file}`;
        await deleteS3(S3_BUCKET_NAME, key);
    }

    await deleteDynamoDB(DYNAMODB_SNEAKERS_TABLE, req.params);
    res.status(200).send(`Successfully deleted ${req.params.brand} ${req.params.model}`);
});
  
module.exports = router;