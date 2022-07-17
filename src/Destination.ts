import {
  cloneDestination,
  createDestination,
  deleteDestination,
  executeDestinationCheckConnection,
  listDestinationsForWorkspace,
  searchDestinations,
} from './generated/AirbyteApi';

import { Base } from './Base';
import {
  CheckConnectionReadStatus,
  DestinationCloneConfiguration,
  DestinationCoreConfig,
  DestinationCreate,
  DestinationId,
  DestinationRead,
  DestinationSearch,
  WorkspaceId,
} from './generated/AirbyteApi.schemas';
import { DestinationModel } from './models/DestinationModel';
import { WorkspaceModel } from './models/WorkspaceModel';

export const DEFAULT_SLUG = 'default';

export class Destination extends Base {
  constructor(workspace: WorkspaceModel) {
    super(workspace);
  }

  async getAllDestinations(): Promise<Array<DestinationModel>> {
    const allDestinations = await listDestinationsForWorkspace({
      workspaceId: this.forWorkspace.get('workspaceId') as WorkspaceId,
    });

    return Destination.createDestinationInstances(allDestinations.destinations);
  }

  async searchDestinationByName(
    name: string,
  ): Promise<Array<DestinationModel>> {
    const searchList = await searchDestinations({
      name,
    });

    return Destination.createDestinationInstances(searchList.destinations);
  }

  async searchDestinations(
    searchParams: DestinationSearch,
  ): Promise<Array<DestinationModel>> {
    const searchList = await searchDestinations(searchParams);

    return Destination.createDestinationInstances(searchList.destinations);
  }

  async updateDestination(
    destinationId: DestinationId,
    updateObject: Partial<DestinationRead>,
  ): Promise<DestinationModel> {
    const destination = await DestinationModel.createDestinationInstanceFromId(
      destinationId,
    );
    await destination.update(updateObject);

    return destination;
  }

  //Utility
  static async createNewDestination(
    createDestinationData: DestinationCreate,
    checkIfConfigIsValid = true,
  ): Promise<DestinationModel> {
    if (checkIfConfigIsValid) {
      const valid = await executeDestinationCheckConnection(
        createDestinationData as DestinationCoreConfig,
      );

      if (valid.status === CheckConnectionReadStatus.failed) {
        throw new Error(valid.message);
      }
    }

    const newDestination = await createDestination(createDestinationData);
    return DestinationModel.createDestinationInstance(newDestination);
  }

  static async clone(
    destinationId: DestinationId,
    updateConfig: DestinationCloneConfiguration,
    checkIfConfigIsValid = true,
  ): Promise<DestinationModel> {
    if (checkIfConfigIsValid) {
      const oldDestination =
        await DestinationModel.createDestinationInstanceFromId(destinationId);
      const newConfiguration = (updateConfig.connectionConfiguration ||
        {}) as object;
      const valid = await executeDestinationCheckConnection({
        destinationDefinitionId: oldDestination.get('destinationDefinitionId'),
        connectionConfiguration: {
          ...oldDestination.getConnectionConfiguration(),
          ...newConfiguration,
        },
      } as DestinationCoreConfig);

      if (valid.status === CheckConnectionReadStatus.failed) {
        throw new Error(valid.message);
      }
    }

    const clonedDestination = await cloneDestination({
      destinationCloneId: destinationId,
      destinationConfiguration: updateConfig,
    });

    return DestinationModel.createDestinationInstance(clonedDestination);
  }

  static async deleteDestination(destinationId: string) {
    return await deleteDestination({ destinationId });
  }

  static createDestinationInstances(destinations: Array<DestinationRead>) {
    return destinations.map((destination) =>
      DestinationModel.createDestinationInstance(destination),
    );
  }
}
