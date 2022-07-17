import {
  getConnection,
  listAllConnectionsForWorkspace,
  listConnectionsForWorkspace,
} from './generated/AirbyteApi';

import { Base } from './Base';
import {
  ConnectionCreate,
  ConnectionId,
  ConnectionRead,
  JobInfoRead,
  WorkspaceId,
  WorkspaceIdRequestBody,
} from './generated/AirbyteApi.schemas';
import { ConnectionModel } from './models/ConnectionModel';
import { WorkspaceModel } from './models/WorkspaceModel';
import { createConnection } from './generated/AirbyteApi';

export class Connection extends Base {
  constructor(workspace: WorkspaceModel) {
    super(workspace);
  }

  async getAllConnections(
    includeDeleted = false,
  ): Promise<Array<ConnectionModel>> {
    const workspaceIdRequestBody: WorkspaceIdRequestBody = {
      workspaceId: this.forWorkspace.get('workspaceId') as WorkspaceId,
    };

    const allConnections = await (includeDeleted
      ? listAllConnectionsForWorkspace(workspaceIdRequestBody)
      : listConnectionsForWorkspace(workspaceIdRequestBody));

    return Connection.createConnectionInstances(allConnections.connections);
  }

  static async createNewConnection(
    connectionCreate: ConnectionCreate,
  ): Promise<ConnectionModel> {
    const newConnection = await createConnection(connectionCreate);

    return ConnectionModel.createConnectionInstance(newConnection);
  }

  static async getConnection(
    connectionId: ConnectionId,
  ): Promise<ConnectionModel> {
    const connection = await getConnection({ connectionId });

    return ConnectionModel.createConnectionInstance(connection);
  }

  static createConnectionInstances(connections: Array<ConnectionRead>) {
    return connections.map((connection) =>
      ConnectionModel.createConnectionInstance(connection),
    );
  }

  static async triggerSync(connectionId: ConnectionId): Promise<JobInfoRead> {
    const connection = await ConnectionModel.createConnectionInstanceFromId(
      connectionId,
    );

    return await connection.trigger();
  }
}
