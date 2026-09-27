import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize,
} from "sequelize";

export class Session extends Model<
  InferAttributes<Session>,
  InferCreationAttributes<Session>
> {
  declare tokenHash: string;
  declare userId: string;
  declare expiresAt: Date;
}

export function initSessionModel(sequelize: Sequelize): void {
  Session.init(
    {
      tokenHash: { type: DataTypes.STRING(64), primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      tableName: "sessions",
      modelName: "Session",
      timestamps: false,
    },
  );
}
