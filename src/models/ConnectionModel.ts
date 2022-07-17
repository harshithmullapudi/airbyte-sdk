import {
  getConnection,
  getState,
  getStateType,
  resetConnection,
  syncConnection,
  updateConnection,
} from '../generated/AirbyteApi';
import {
  ConnectionId,
  ConnectionRead,
  ConnectionStateType,
  ConnectionUpdate,
  JobInfoRead,
} from '../generated/AirbyteApi.schemas';

export class ConnectionModel {
  meta: ConnectionRead;

  constructor(connection: ConnectionRead) {
    this.meta = connection;
  }

  get(key: keyof ConnectionRead) {
    const metaKey: keyof ConnectionRead = key;

    return this.meta[metaKey];
  }

  getSyncCatalog() {
    return this.meta.syncCatalog;
  }

  async state() {
    return await getState({
      connectionId: this.meta.connectionId,
    });
  }

  async save() {
    const connectionUpdate = this.meta as ConnectionUpdate;
    await updateConnection(connectionUpdate);
  }

  async update(updateBody: Partial<ConnectionRead>) {
    this.meta = { ...this.meta, ...updateBody };
    this.save();
  }

  async stateType(): Promise<ConnectionStateType> {
    return await getStateType({
      connectionId: this.meta.connectionId,
    });
  }

  async trigger(): Promise<JobInfoRead> {
    return await syncConnection({
      connectionId: this.meta.connectionId,
    });
  }

  async reset(): Promise<JobInfoRead> {
    return await resetConnection({ connectionId: this.meta.connectionId });
  }

  // static methods
  static async createConnectionInstanceFromId(
    connectionId: ConnectionId,
  ): Promise<ConnectionModel> {
    const connection = await getConnection({ connectionId });

    return new ConnectionModel(connection);
  }

  static createConnectionInstance(connection: ConnectionRead): ConnectionModel {
    return new ConnectionModel(connection);
  }
}
