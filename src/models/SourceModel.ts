import {
  checkConnectionToSource,
  checkConnectionToSourceForUpdate,
  deleteSource,
  discoverSchemaForSource,
  getSource,
  updateSource,
} from '../generated/AirbyteApi';
import {
  CheckConnectionRead,
  SourceConfiguration,
  SourceDiscoverSchemaRead,
  SourceId,
  SourceRead,
  SourceUpdate,
} from '../generated/AirbyteApi.schemas';

export class SourceModel {
  meta: SourceRead;

  constructor(source: SourceRead) {
    this.meta = source;
  }

  get(key: keyof SourceRead) {
    const metaKey: keyof SourceRead = key;

    return this.meta[metaKey];
  }

  async getLatest() {
    const newValues = await getSource({
      sourceId: this.meta.sourceId,
    });
    this.meta = newValues;
  }

  async save() {
    const sourceUpdate = this.meta as SourceUpdate;
    await updateSource(sourceUpdate);
  }

  async update(updateBody: Partial<SourceRead>) {
    this.meta = { ...this.meta, ...updateBody };
    this.save();
  }

  async hasValidConfig(): Promise<CheckConnectionRead> {
    return await checkConnectionToSource({
      sourceId: this.meta.sourceId,
    });
  }

  async validateNewConfig(
    newConfig: Partial<SourceConfiguration> = {},
    name?: string,
  ) {
    const configToUpdate = {
      ...this.getConnectionConfiguration(),
      ...newConfig,
    };
    const nameToUpdate = name ? name : this.meta.name;

    return await checkConnectionToSourceForUpdate({
      sourceId: this.meta.sourceId,
      name: nameToUpdate,
      connectionConfiguration: configToUpdate,
    });
  }

  async discoverSchema(): Promise<SourceDiscoverSchemaRead> {
    return await discoverSchemaForSource({
      sourceId: this.meta.sourceId,
    });
  }

  async delete() {
    return await deleteSource({
      sourceId: this.meta.sourceId,
    });
  }

  // Static methods
  static async createSourceInstanceFromId(
    sourceId: SourceId,
  ): Promise<SourceModel> {
    const source = await getSource({ sourceId });

    return new SourceModel(source);
  }

  static createSourceInstance(source: SourceRead): SourceModel {
    return new SourceModel(source);
  }

  // Utility functions
  toJSON(): SourceRead {
    return this.meta;
  }

  getConnectionConfiguration(): Map<string, unknown> {
    return (this.meta.connectionConfiguration as Map<string, unknown>) || {};
  }
}
