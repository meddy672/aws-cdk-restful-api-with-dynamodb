import * as AWSXRay from 'aws-xray-sdk';
import * as AWSSSDK from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda';

const AWS = AWSXRay.captureAWS(AWSSSDK);
const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.DYNAMODB_TABLE || 'undefined';

const params = {
    TableName: table
};

async function scanItems() {
    try {
        const data = await docClient.scan(params).promise();
        return data;
    } catch (err) {
        return err
    }
}

export const handler = async (event:APIGatewayProxyEvent) => {
    try {
        console.log(event);
        const data = await scanItems();
        return {
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        }
    } catch (err) {
        return { error: err };
    }
}