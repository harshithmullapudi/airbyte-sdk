import { WorkspaceModel } from './models/WorkspaceModel';

export class Base {
  forWorkspace: WorkspaceModel;

  constructor(workspace: WorkspaceModel) {
    this.forWorkspace = workspace;
  }
}
