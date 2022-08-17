import {
  TextractClient,
  StartDocumentAnalysisCommand,
  GetDocumentAnalysisCommand,
  AnalyzeDocumentCommand
} from "@aws-sdk/client-textract";
import fs from "fs";

const REGION = "us-east-1";
const config = { region: REGION };
const client = new TextractClient(config);

const input = {
  Document: {
    Bytes:fs.readFileSync('./invoice.jpeg')
  },
  FeatureTypes: ["TABLES","FORMS"],
};
const command = new AnalyzeDocumentCommand(input);

const response = await client.send(command);
console.log(response);
// if (responseFromFirst.$metadata.httpStatusCode === 200) {
//     console.log('inside');
//   const input = {
//     JobId :'931347250725d85bfa43996cdf7832b9a0cf389d1994795db757c63a34f3a815'

//   }
//   const command = new GetDocumentAnalysisCommand(input);
//   const response = await client.send(command);
//   console.log("GetDocumentAnalysisCommand---response");
//   console.log(response);

// }

