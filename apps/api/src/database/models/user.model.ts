import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from "sequelize";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare passwordHash: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export function initUserModel(sequelize: Sequelize): void {
  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      email: {
        type: DataTypes.STRING(254),
        allowNull: false,
        unique: true,
        set(value: string) {
          this.setDataValue("email", value.trim().toLowerCase());
        },
      },
      passwordHash: { type: DataTypes.STRING, allowNull: false },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    { sequelize, tableName: "users", modelName: "User" },
  );
}
