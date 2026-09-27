import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from "sequelize";

export class Asset extends Model<
  InferAttributes<Asset>,
  InferCreationAttributes<Asset>
> {
  declare key: string;
  declare contentType: string;
  declare data: Buffer;
  declare etag: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initAssetModel(sequelize: Sequelize): void {
  Asset.init(
    {
      key: { type: DataTypes.STRING(255), primaryKey: true },
      contentType: { type: DataTypes.STRING(100), allowNull: false },
      data: { type: DataTypes.BLOB("long"), allowNull: false },
      etag: { type: DataTypes.STRING(66), allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "assets", modelName: "Asset" },
  );
}
