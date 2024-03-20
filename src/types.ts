import { UUID } from "crypto";
import { ColumnType, Generated, JSONColumnType, Selectable } from "kysely";

export interface FrameFields {
  body: string;
  title: string;
  description: string;
  checkoutUrl: string;
  denied: string;
  gate: {
    contract: string;
    network: number;
  };
}

export interface FrameTable {
  id: Generated<UUID>;

  author: string;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, never>;

  frame: JSONColumnType<FrameFields>;
}

export type Frame = Selectable<FrameTable>;
