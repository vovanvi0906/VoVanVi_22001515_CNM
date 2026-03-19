const { DynamoDBClient, CreateTableCommand, ListTablesCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey"
  }
});

async function createTable() {
  try {
    const existing = await client.send(new ListTablesCommand({}));
    if (existing.TableNames.includes("Products")) {
      console.log("Table Products đã tồn tại.");
      return;
    }

    const params = {
      TableName: "Products",
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "S" }
      ],
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }
      ],
      BillingMode: "PAY_PER_REQUEST"
    };

    await client.send(new CreateTableCommand(params));
    console.log("Tạo bảng Products thành công.");
  } catch (error) {
    console.error("Lỗi tạo bảng:", error);
  }
}

createTable();