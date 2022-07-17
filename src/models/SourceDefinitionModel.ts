import {
  deleteSourceDefinition,
  getSourceDefinition,
} from '../generated/AirbyteApi';
import {
  SourceDefinitionId,
  SourceDefinitionRead,
} from '../generated/AirbyteApi.schemas';

export class SourceDefinitionModel {
  meta: SourceDefinitionRead;

  constructor(sourceDefinition: SourceDefinitionRead) {
    this.meta = sourceDefinition;
  }

  async delete() {
    await deleteSourceDefinition({
      sourceDefinitionId: this.meta.sourceDefinitionId,
    });
  }

  static async createSourceDefinitionInstanceFromId(
    sourceDefinitionId: SourceDefinitionId,
  ): Promise<SourceDefinitionModel> {
    const sourceDefinition = await getSourceDefinition({ sourceDefinitionId });

    return new SourceDefinitionModel(sourceDefinition);
  }

  static createSourceDefinitionInstance(
    sourceDefinition: SourceDefinitionRead,
  ): SourceDefinitionModel {
    return new SourceDefinitionModel(sourceDefinition);
  }
}
