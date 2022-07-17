import {
  createDestinationDefinition,
  deleteCustomDestinationDefinition,
  deleteDestinationDefinition,
  listLatestDestinationDefinitions,
  listDestinationDefinitions,
  listDestinationDefinitionsForWorkspace,
} from './generated/AirbyteApi';

import {
  DestinationDefinitionCreate,
  DestinationDefinitionId,
  DestinationDefinitionRead,
  WorkspaceId,
} from './generated/AirbyteApi.schemas';
import { DestinationDefinitionModel } from './models/DestinationDefinitionModel';
import { DestinationModel } from './models/DestinationModel';
import { WorkspaceModel } from './models/WorkspaceModel';
import { Destination } from './Destination';
import { Base } from './Base';

export class DestinationDefinition extends Base {
  constructor(workspace: WorkspaceModel) {
    super(workspace);
  }

  async getAllDestinationDefinitions(): Promise<
    Array<DestinationDefinitionModel>
  > {
    const allDestinationDefinitions =
      await listDestinationDefinitionsForWorkspace({
        workspaceId: this.forWorkspace.get('workspaceId') as WorkspaceId,
      });

    return DestinationDefinition.createDestinationDefinitionInstances(
      allDestinationDefinitions.destinationDefinitions,
    );
  }

  async getAllDestinationDefinitionsForAirbyte() {
    const allDestinationDefinitions = await listDestinationDefinitions();

    return DestinationDefinition.createDestinationDefinitionInstances(
      allDestinationDefinitions.destinationDefinitions,
    );
  }

  async getLatestDestinationDefinitions() {
    const allDestinationDefinitions = await listLatestDestinationDefinitions();

    return DestinationDefinition.createDestinationDefinitionInstances(
      allDestinationDefinitions.destinationDefinitions,
    );
  }

  async getDestinationsForDefinition(
    destinationDefinitionId: DestinationDefinitionId,
  ): Promise<Array<DestinationModel>> {
    const destination = new Destination(this.forWorkspace);

    return await destination.searchDestinations({
      destinationDefinitionId,
    });
  }

  async createDestinationDefinition(
    destinationDefinitionCreate: DestinationDefinitionCreate,
  ): Promise<DestinationDefinitionModel> {
    const newDestinationDefinition = await createDestinationDefinition(
      destinationDefinitionCreate,
    );

    return DestinationDefinitionModel.createDestinationDefinitionInstance(
      newDestinationDefinition,
    );
  }

  // Static functions
  static async deleteDestinationDefinition(
    destinationDefinitionId: DestinationDefinitionId,
  ): Promise<void> {
    return await deleteDestinationDefinition({ destinationDefinitionId });
  }

  static async deleteDestinationDefinitionInWorkspace(
    destinationDefinitionId: DestinationDefinitionId,
    workspaceId: WorkspaceId,
  ): Promise<void> {
    return await deleteCustomDestinationDefinition({
      destinationDefinitionId,
      workspaceId,
    });
  }

  static createDestinationDefinitionInstances(
    destinationDefinitions: Array<DestinationDefinitionRead>,
  ) {
    return destinationDefinitions.map((destinationDefinition) =>
      DestinationDefinitionModel.createDestinationDefinitionInstance(
        destinationDefinition,
      ),
    );
  }
}
