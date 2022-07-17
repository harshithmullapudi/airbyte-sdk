import { listWorkspaces } from './generated/AirbyteApi';
import { WorkspaceId, WorkspaceRead } from './generated/AirbyteApi.schemas';

import { WorkspaceModel } from './models/WorkspaceModel';

export class Workspace {
  async getDefaultWorkspace(): Promise<WorkspaceModel> {
    const allWorkspaces = await this.getAllWorkspaces();

    return Workspace.findDefaultWorkspaces(allWorkspaces);
  }

  async getAllWorkspaces(): Promise<Array<WorkspaceModel>> {
    const response = await listWorkspaces();
    return response.workspaces.map((workspace) =>
      WorkspaceModel.createWorkspaceInstance(workspace),
    );
  }

  async updateWorkspace(
    workspaceId: WorkspaceId,
    updateObject: Partial<WorkspaceRead>,
  ): Promise<WorkspaceModel> {
    const workspace = await WorkspaceModel.createWorkspaceInstanceFromId(
      workspaceId,
    );
    await workspace.update(updateObject);

    return workspace;
  }

  static findDefaultWorkspaces(
    workspaces: Array<WorkspaceModel>,
  ): WorkspaceModel {
    return workspaces[0];
  }
}
