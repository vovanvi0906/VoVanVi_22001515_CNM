const { ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const db = require("../config/dynamodb");

const TABLE_NAME = "Products";

class ProductModel {
  static async getAll() {
    const params = {
      TableName: TABLE_NAME
    };
    const result = await db.send(new ScanCommand(params));
    return result.Items || [];
  }

  static async getById(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    const result = await db.send(new GetCommand(params));
    return result.Item;
  }

  static async create(product) {
    const params = {
      TableName: TABLE_NAME,
      Item: product
    };
    await db.send(new PutCommand(params));
    return product;
  }

  static async update(id, product) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: "SET #name = :name, price = :price, unit_in_stock = :unit_in_stock, url_image = :url_image",
      ExpressionAttributeNames: {
        "#name": "name"
      },
      ExpressionAttributeValues: {
        ":name": product.name,
        ":price": product.price,
        ":unit_in_stock": product.unit_in_stock,
        ":url_image": product.url_image
      },
      ReturnValues: "ALL_NEW"
    };

    const result = await db.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async delete(id) {
    const params = {
      TableName: TABLE_NAME,
      Key: { id }
    };
    await db.send(new DeleteCommand(params));
  }
}

module.exports = ProductModel;