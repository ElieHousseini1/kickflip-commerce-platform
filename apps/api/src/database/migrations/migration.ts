import type { QueryInterface, Transaction } from "sequelize";

export interface Migration {
  id: string;
  up: (
    queryInterface: QueryInterface,
    transaction: Transaction,
  ) => Promise<void>;
  down: (
    queryInterface: QueryInterface,
    transaction: Transaction,
  ) => Promise<void>;
}
