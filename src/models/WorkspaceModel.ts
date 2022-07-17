import {
  getWorkspace,
  updateWorkspace,
  updateWorkspaceName,
} from '../generated/AirbyteApi';
import {
  WorkspaceId,
  WorkspaceRead,
  WorkspaceUpdate,
} from '../generated/AirbyteApi.schemas';

export class WorkspaceModel {
  meta: WorkspaceRead;

  constructor(workspace: WorkspaceRead) {
    this.meta = workspace;
  }

  async save() {
    const workspaceUpdate = this.meta as WorkspaceUpdate;
    await updateWorkspace(workspaceUpdate);
  }

  async update(updateBody: Partial<WorkspaceRead>) {
    this.meta = { ...this.meta, ...updateBody };
    this.save();
  }

  async updateName(name: string): Promise<WorkspaceRead> {
    return await updateWorkspaceName({
      workspaceId: this.meta.workspaceId,
      name,
    });
  }

  async getLatest() {
    const newValues = await getWorkspace({
      workspaceId: this.meta.workspaceId,
    });
    this.meta = newValues;
  }

  get(key: keyof WorkspaceRead) {
    const metaKey: keyof WorkspaceRead = key;

    return this.meta[metaKey];
  }

  // Static functions
  static async createWorkspaceInstanceFromId(
    workspaceId: WorkspaceId,
  ): Promise<WorkspaceModel> {
    const workspace = await getWorkspace({ workspaceId });
    return new WorkspaceModel(workspace);
  }

  static createWorkspaceInstance(workspace: WorkspaceRead): WorkspaceModel {
    return new WorkspaceModel(workspace);
  }

  // Utility functions
  toJSON(): WorkspaceRead {
    return this.meta;
  }
}
