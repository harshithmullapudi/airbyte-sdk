import { getJobDebugInfo, listJobsFor } from './generated/AirbyteApi';
import {
  JobDebugInfoRead,
  JobListRequestBody,
  JobRead,
} from './generated/AirbyteApi.schemas';
import { ConnectionModel } from './models/ConnectionModel';
import { JobModel } from './models/JobModel';

export class Job {
  connection: ConnectionModel;

  constructor(connection: ConnectionModel) {
    this.connection = connection;
  }

  async getAllJobs(jobListRequestBody: JobListRequestBody) {
    const allJobs = await listJobsFor(jobListRequestBody);
    const getDebugJobs = await Promise.all(
      allJobs.jobs.map(
        async (job) => await getJobDebugInfo({ id: (job.job as JobRead).id }),
      ),
    );

    return Job.createJobInstances(getDebugJobs);
  }

  static createJobInstances(jobs: Array<JobDebugInfoRead>) {
    return jobs.map((job) => JobModel.createJobInstance(job));
  }
}
