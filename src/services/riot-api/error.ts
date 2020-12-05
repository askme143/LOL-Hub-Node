import { AxiosError, AxiosResponse } from 'axios';
import config from '../../config/riot-config';

export type RiotAPIErrorCase = 'InternalErr' | 'ExternalErr' | 'UnknownErr';

export class RiotAPIError extends Error {
  errorCase: RiotAPIErrorCase;
  constructor(errorCase: RiotAPIErrorCase) {
    super(errorCase);
    this.errorCase = errorCase;
  }
}

export function handleRiotAPIError(error: Error) {
  const axiosError = error as AxiosError;

  const internalError = new RiotAPIError('InternalErr');

  if (axiosError.isAxiosError) {
    if (axiosError.response !== undefined) {
      /* Received a Riot API response */
      handleStatusCode(axiosError.response);
      return null;
    } else if (axiosError.request !== null) {
      /* Didn't receive a Riot API response */
      console.log(axiosError.request);
    } else {
      /* Error while requesting */
      console.log(axiosError.message);
    }
  } else {
    /* Other errors */
    console.log(error);
  }

  throw internalError;
}

function handleStatusCode(response: AxiosResponse<any>) {
  const internalError = new RiotAPIError('InternalErr');
  const externalErr = new RiotAPIError('ExternalErr');
  const unknownErr = new RiotAPIError('UnknownErr');

  /* Erroneous cases (internal error) */
  switch (response.status) {
    /* Not erroneous cases */
    case 404: // Not found
      return null;

    /* Internal factor */
    case 400:
      console.log('Riot API: Bad request' + `\n> ${response.config.url}`);
      throw internalError;
    case 401:
      console.log('Riot API: Unauthorized' + '\n> Check request header');
      throw internalError;
    case 403:
      console.log('Riot API: Forbidden' + `\n>  ${config.apiKey}`);
      throw internalError;
    case 405:
      console.log(
        'Riot API: Method not allowed' + `\n> ${response.config.url}`
      );
      throw internalError;
    case 415:
      console.log(
        'Riot API: Unsupported media type' + `\n>  ${response.headers}`
      );
      throw internalError;
    case 429:
      console.log(
        'Riot API: Rate limit exceeded' +
          `\n> limitSec: ${config.maxRequestSec}` +
          `\n> limitMin: ${config.maxRequestMin}`
      );
      throw internalError;

    /* External factor */
    case 500:
      console.log('Riot API: Internal server error');
      throw externalErr;
    case 502:
      console.log('Riot API: Bad gateway');
      throw externalErr;
    case 503:
      console.log('Riot API: Service unavailable');
      throw externalErr;
    case 504:
      console.log('Riot API: Gateway timeout');
      throw externalErr;

    /* Unknown factor*/
    default:
      throw unknownErr;
  }
}
