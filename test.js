import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
} from "@aws-sdk/client-textract";
import fs from "fs";

const REGION = "us-east-1";
const config = { region: REGION };
const client = new TextractClient(config);

const input = {
  DocumentLocation: {
    S3Object: {
      Bucket: "invoice-images",
      Name: "invoice.jpeg",
    },
  },
  FeatureTypes: ["TABLES"],
};
const command = new StartDocumentAnalysisCommand(input);

const response = await client.send(command);
console.log("StartDocumentAnalysisCommand---response");

console.log(response);
if (response.$metadata.httpStatusCode === 200) {
  const input = {
    JobId :response.JobId

  }
  const command = new GetDocumentAnalysisCommand(input);
  const response = await client.send(command);
  console.log("GetDocumentAnalysisCommand---response");
  console.log(response);

}

