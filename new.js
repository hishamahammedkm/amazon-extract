// Import required AWS SDK clients and commands for Node.js
import { AnalyzeDocumentCommand } from "@aws-sdk/client-textract";
import { TextractClient } from "@aws-sdk/client-textract";
import fs from "fs";
import textractHelper from "aws-textract-helper";
// Set the AWS Region.
const REGION = "us-east-1";
// Create SNS service object.
const textractClient = new TextractClient({ region: REGION });

// Set params
const params = {
  Document: {
    Bytes: fs.readFileSync("./test2.png"),
  },
  FeatureTypes: ["TABLES", "QUERIES"],
  QueriesConfig: {
    Queries: [
      {
        Alias: "CompanyName",

        Text: "what is the company name",
      },
      {
        Alias: "gstNumber",
        Text: "what is the gst number",
      },
    ],
  },
};

const displayBlockInfo = async (response) => {
  let questions = [];
  let answers = [];
  let questionAndAnswers = {}
  try {
    response.Blocks.forEach((block) => {
      if (block.BlockType === "QUERY") {
        if ("Relationships" in block && block.Relationships !== undefined) {
          let answer = {
            question: block.Query.Alias,
            answerBolckId: block.Relationships[0].Ids[0],
          };
          questions.push(answer);
        }
      }
      if (block.BlockType === "QUERY_RESULT") {
        answers.push({
          id: block.Id,
          text: block.Text,
        });
      }

      //   console.log(`Block Type: ${block.BlockType}`);
      //   if ("Text" in block && block.Text !== undefined) {
      //     console.log(`Text: ${block.Text}`);
      //   } else {
      //   }
      //   if ("Confidence" in block && block.Confidence !== undefined) {
      //     console.log(`Confidence: ${block.Confidence}`);
      //   } else {
      //   }

    });
   
    questions.map((q) => {
      answers.map((ans) => {
        if (q.answerBolckId === ans.id) {
          questionAndAnswers[q.question] = ans.text;
        }
      });
    });
  } catch (err) {
    console.log("Error", err);
  }
  return questionAndAnswers;
};

const getSharonProductTotalPurchaseAmount = (a) => {
  let sharonItems = [];
  let sharonItemsTotalAmount = 0;
  const rows = Object.values(a[0]);
  rows.forEach((productData) => {
    let values = Object.values(productData);
    values.forEach((item) => {
      let position = item.search(/SHARON/i);
      if (position >= 0) {
        sharonItems.push(productData);
      }
    });
  });
  sharonItems.forEach((item) => {
    const values = Object.values(item);
    const numbers = values.map((item) => {
        const number = parseFloat(item)
      if (number) {
        return number;
      } else {
        return 0;
      }
    });

    //   item * quantity
    const produtTotal = Math.max(...numbers);
    sharonItemsTotalAmount += produtTotal;
  });
  return sharonItemsTotalAmount;
};

const analyze_document_text = async () => {
  try {
    const analyzeDoc = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(analyzeDoc);
    const questionAndAnswer = await displayBlockInfo(response);

    const tables = textractHelper.createTables(response);
    const totalPurchaseAmount = getSharonProductTotalPurchaseAmount(tables);
    const responseData = {
      totalPurchaseAmount,
      ...questionAndAnswer
    };
    return responseData;
  } catch (err) {
    console.log("Error", err);
  }
};

console.log("finalllll+++++", await analyze_document_text());
