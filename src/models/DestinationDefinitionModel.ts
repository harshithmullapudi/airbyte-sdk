import {
  deleteDestinationDefinition,
  getDestinationDefinition,
} from '../generated/AirbyteApi';
import {
  DestinationDefinitionId,
  DestinationDefinitionRead,
} from '../generated/AirbyteApi.schemas';

export class DestinationDefinitionModel {
  meta: DestinationDefinitionRead;

  constructor(destinationDefinition: DestinationDefinitionRead) {
    this.meta = destinationDefinition;
  }

  async delete() {
    await deleteDestinationDefinition({
      destinationDefinitionId: this.meta.destinationDefinitionId,
    });
  }

  static async createDestinationDefinitionInstanceFromId(
    destinationDefinitionId: DestinationDefinitionId,
  ): Promise<DestinationDefinitionModel> {
    const destinationDefinition = await getDestinationDefinition({
      destinationDefinitionId,
    });

    return new DestinationDefinitionModel(destinationDefinition);
  }

  static createDestinationDefinitionInstance(
    destinationDefinition: DestinationDefinitionRead,
  ): DestinationDefinitionModel {
    return new DestinationDefinitionModel(destinationDefinition);
  }
}
