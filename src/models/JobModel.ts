import { cancelJob, getJobDebugInfo } from '../generated/AirbyteApi';
import {
  JobId,
  JobDebugInfoRead,
  JobInfoRead,
} from '../generated/AirbyteApi.schemas';

export class JobModel {
  meta: JobDebugInfoRead;

  constructor(jobRead: JobDebugInfoRead) {
    this.meta = jobRead;
  }

  async cancel(): Promise<JobInfoRead> {
    return await cancelJob({ id: this.meta.job.id });
  }

  // static methods
  static async createJobInstanceFromId(jobId: JobId): Promise<JobModel> {
    const job = await getJobDebugInfo({ id: jobId });

    return new JobModel(job as JobDebugInfoRead);
  }

  static createJobInstance(job: JobDebugInfoRead): JobModel {
    return new JobModel(job);
  }
}
