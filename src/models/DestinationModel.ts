import {
  checkConnectionToDestination,
  checkConnectionToDestinationForUpdate,
  deleteDestination,
  getDestination,
  updateDestination,
} from '../generated/AirbyteApi';
import {
  CheckConnectionRead,
  DestinationConfiguration,
  DestinationId,
  DestinationRead,
  DestinationUpdate,
} from '../generated/AirbyteApi.schemas';

export class DestinationModel {
  meta: DestinationRead;

  constructor(destination: DestinationRead) {
    this.meta = destination;
  }

  get(key: keyof DestinationRead) {
    const metaKey: keyof DestinationRead = key;

    return this.meta[metaKey];
  }

  async getLatest() {
    const newValues = await getDestination({
      destinationId: this.meta.destinationId,
    });
    this.meta = newValues;
  }

  async save() {
    const destinationUpdate = this.meta as DestinationUpdate;
    await updateDestination(destinationUpdate);
  }

  async update(updateBody: Partial<DestinationRead>) {
    this.meta = { ...this.meta, ...updateBody };
    this.save();
  }

  async hasValidConfig(): Promise<CheckConnectionRead> {
    return await checkConnectionToDestination({
      destinationId: this.meta.destinationId,
    });
  }

  async validateNewConfig(
    newConfig: Partial<DestinationConfiguration> = {},
    name?: string,
  ) {
    const configToUpdate = {
      ...this.getConnectionConfiguration(),
      ...newConfig,
    };
    const nameToUpdate = name ? name : this.meta.name;

    return await checkConnectionToDestinationForUpdate({
      destinationId: this.meta.destinationId,
      name: nameToUpdate,
      connectionConfiguration: configToUpdate,
    });
  }

  async delete() {
    return await deleteDestination({
      destinationId: this.meta.destinationId,
    });
  }

  // Static methods
  static async createDestinationInstanceFromId(
    destinationId: DestinationId,
  ): Promise<DestinationModel> {
    const destination = await getDestination({ destinationId });

    return new DestinationModel(destination);
  }

  static createDestinationInstance(
    destination: DestinationRead,
  ): DestinationModel {
    return new DestinationModel(destination);
  }

  // Utility functions
  toJSON(): DestinationRead {
    return this.meta;
  }

  getConnectionConfiguration(): Map<string, unknown> {
    return (this.meta.connectionConfiguration as Map<string, unknown>) || {};
  }
}
