import { AxiosRequestHeaders } from 'axios';
import { Axios } from './orval/override';

export { Workspace } from './Workspace';
export { Source } from './Source';
export { Destination } from './Destination';
export { Connection } from './Connection';
export { Job } from './Job';

export * from './generated/AirbyteApi.schemas';

export * from './models';

/**
 * Set Airbyte host for all the clients
 *
 * @param host the number to calculate the root of.
 */
export function setAirbyteHost(host: string) {
  Axios.defaults.baseURL = host;
}

/**
 * Set Default headers to help authentication
 *
 * @param headers the number to calculate the root of.
 */
export function setAuthenticationHeaders(headers: AxiosRequestHeaders) {
  Axios.defaults.headers.common = headers;
}
