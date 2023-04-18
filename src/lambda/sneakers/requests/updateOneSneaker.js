const express = require('express');
const parser = require('lambda-multipart-parser');
const router = express.Router();
const { updateItem: updateDynamoDB } = require('../../../utils/aws/dynamodb');
const { postItem: postS3 } = require('../../../utils/aws/s3');

const DYNAMODB_SNEAKERS_TABLE = 'sneakers';
const S3_BUCKET_NAME = 'sneakers-bucket';

router.put('/:brand/:model', async (req, res) => {
    try {
        const { files, ...body} = await parser.parse(req);
        const { brand, model } = req.params;
        updatedFiles = [];

        for(const file of files) {
            const key = `${brand}/${model}/${file.fieldname}`;
            const s3Body = file.content;
            const contentLength = file.content.length;
            const result = await postS3(
                S3_BUCKET_NAME, 
                key, 
                s3Body, 
                contentLength);
            updatedFiles.push(result.ETag);
        }

        const result = await updateDynamoDB(DYNAMODB_SNEAKERS_TABLE, req.params, body);
        res.status(200).send({ body: result, updatedFiles });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }});
  
module.exports = router;