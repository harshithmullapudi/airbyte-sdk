import {
  cloneSource,
  createSource,
  deleteSource,
  executeSourceCheckConnection,
  getSource,
  listSourcesForWorkspace,
  searchSources,
} from './generated/AirbyteApi';

import { Base } from './Base';
import {
  CheckConnectionReadStatus,
  SourceCloneConfiguration,
  SourceCoreConfig,
  SourceCreate,
  SourceId,
  SourceRead,
  SourceSearch,
  WorkspaceId,
} from './generated/AirbyteApi.schemas';
import { SourceModel } from './models/SourceModel';
import { WorkspaceModel } from './models/WorkspaceModel';

export const DEFAULT_SLUG = 'default';

export class Source extends Base {
  constructor(workspace: WorkspaceModel) {
    super(workspace);
  }

  async getAllSources(): Promise<Array<SourceModel>> {
    const allSources = await listSourcesForWorkspace({
      workspaceId: this.forWorkspace.get('workspaceId') as WorkspaceId,
    });

    return Source.createSourceInstances(allSources.sources);
  }

  async getSource(sourceId: SourceId): Promise<SourceModel> {
    const sourceRead = await getSource({
      sourceId,
    });

    return SourceModel.createSourceInstance(sourceRead);
  }

  async searchSourceByName(name: string): Promise<Array<SourceModel>> {
    const searchList = await searchSources({
      name,
    });

    return Source.createSourceInstances(searchList.sources);
  }

  async searchSources(searchParams: SourceSearch): Promise<Array<SourceModel>> {
    const searchList = await searchSources(searchParams);

    return Source.createSourceInstances(searchList.sources);
  }

  async updateSource(
    sourceId: SourceId,
    updateObject: Partial<SourceRead>,
  ): Promise<SourceModel> {
    const source = await SourceModel.createSourceInstanceFromId(sourceId);
    await source.update(updateObject);

    return source;
  }

  //Utility
  static async createNewSource(
    createSourceData: SourceCreate,
    checkIfConfigIsValid = true,
  ): Promise<SourceModel> {
    if (checkIfConfigIsValid) {
      const valid = await executeSourceCheckConnection(
        createSourceData as SourceCoreConfig,
      );

      if (valid.status === CheckConnectionReadStatus.failed) {
        throw new Error(valid.message);
      }
    }

    const newSource = await createSource(createSourceData);
    return SourceModel.createSourceInstance(newSource);
  }

  static async clone(
    sourceId: SourceId,
    updateConfig: SourceCloneConfiguration,
    checkIfConfigIsValid = true,
  ): Promise<SourceModel> {
    if (checkIfConfigIsValid) {
      const oldSource = await SourceModel.createSourceInstanceFromId(sourceId);
      const newConfiguration = (updateConfig.connectionConfiguration ||
        {}) as Map<string, unknown>;
      const valid = await executeSourceCheckConnection({
        sourceDefinitionId: oldSource.get('sourceDefinitionId'),
        connectionConfiguration: {
          ...oldSource.getConnectionConfiguration(),
          ...newConfiguration,
        },
      } as SourceCoreConfig);

      if (valid.status === CheckConnectionReadStatus.failed) {
        throw new Error(valid.message);
      }
    }

    const clonedSource = await cloneSource({
      sourceCloneId: sourceId,
      sourceConfiguration: updateConfig,
    });

    return SourceModel.createSourceInstance(clonedSource);
  }

  static async deleteSource(sourceId: string) {
    return await deleteSource({ sourceId });
  }

  static createSourceInstances(sources: Array<SourceRead>) {
    return sources.map((source) => SourceModel.createSourceInstance(source));
  }
}
