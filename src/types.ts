import {
  GraphClient,
  IntegrationExecutionContext,
  PersisterClient,
} from "@jupiterone/jupiter-managed-integration-sdk";

import AirwatchClient from "./airwatch/AirwatchClient";
import { AirWatchAccount } from "./airwatch/types";

export interface AirwatchExecutionContext extends IntegrationExecutionContext {
  graph: GraphClient;
  persister: PersisterClient;
  provider: AirwatchClient;
  account: AirWatchAccount;
}
