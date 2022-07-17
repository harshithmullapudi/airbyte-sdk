import {
  createSourceDefinition,
  deleteCustomSourceDefinition,
  deleteSourceDefinition,
  listLatestSourceDefinitions,
  listSourceDefinitions,
  listSourceDefinitionsForWorkspace,
} from './generated/AirbyteApi';

import { Base } from './Base';
import {
  SourceDefinitionCreate,
  SourceDefinitionId,
  SourceDefinitionRead,
  WorkspaceId,
} from './generated/AirbyteApi.schemas';
import { SourceDefinitionModel } from './models/SourceDefinitionModel';
import { SourceModel } from './models/SourceModel';
import { WorkspaceModel } from './models/WorkspaceModel';
import { Source } from './Source';

export class SourceDefinition extends Base {
  constructor(workspace: WorkspaceModel) {
    super(workspace);
  }

  async getAllSourceDefinitions(): Promise<Array<SourceDefinitionModel>> {
    const allSourceDefinitions = await listSourceDefinitionsForWorkspace({
      workspaceId: this.forWorkspace.get('workspaceId') as WorkspaceId,
    });

    return SourceDefinition.createSourceDefinitionInstances(
      allSourceDefinitions.sourceDefinitions,
    );
  }

  async getAllSourceDefinitionsForAirbyte() {
    const allSourceDefinitions = await listSourceDefinitions();

    return SourceDefinition.createSourceDefinitionInstances(
      allSourceDefinitions.sourceDefinitions,
    );
  }

  async getLatestSourceDefinitions() {
    const allSourceDefinitions = await listLatestSourceDefinitions();

    return SourceDefinition.createSourceDefinitionInstances(
      allSourceDefinitions.sourceDefinitions,
    );
  }

  async getSourcesForDefinition(
    sourceDefinitionId: SourceDefinitionId,
  ): Promise<Array<SourceModel>> {
    const source = new Source(this.forWorkspace);

    return await source.searchSources({
      sourceDefinitionId,
    });
  }

  async createSourceDefinition(
    sourceDefinitionCreate: SourceDefinitionCreate,
  ): Promise<SourceDefinitionModel> {
    const newSourceDefinition = await createSourceDefinition(
      sourceDefinitionCreate,
    );

    return SourceDefinitionModel.createSourceDefinitionInstance(
      newSourceDefinition,
    );
  }

  // Static functions
  static async deleteSourceDefinition(
    sourceDefinitionId: SourceDefinitionId,
  ): Promise<void> {
    return await deleteSourceDefinition({ sourceDefinitionId });
  }

  static async deleteSourceDefinitionInWorkspace(
    sourceDefinitionId: SourceDefinitionId,
    workspaceId: WorkspaceId,
  ): Promise<void> {
    return await deleteCustomSourceDefinition({
      sourceDefinitionId,
      workspaceId,
    });
  }

  static createSourceDefinitionInstances(
    sourceDefinitions: Array<SourceDefinitionRead>,
  ) {
    return sourceDefinitions.map((sourceDefinition) =>
      SourceDefinitionModel.createSourceDefinitionInstance(sourceDefinition),
    );
  }
}
