import axios, { AxiosError } from 'axios';

interface Request {
  url: string;
  promise: Promise<any> | null;
  complete: ((data: any) => any) | null;
  reject: ((reason: any) => any) | null;
}

class RequestQueue {
  private apiKey: string;
  private requestHeader: any;

  private maxRequest: number = 0; // Max request per second
  private maxRequestMinute: number = 0;

  private reqQueue: Request[] = [];
  private taskQueue: Request[] = [];
  private taskQueueMinute: Request[] = [];

  private working: boolean = false;

  constructor(apiKey: string, maxRequest: number, maxRequestMinute?: number) {
    this.apiKey = apiKey;
    this.maxRequest = maxRequest;
    this.requestHeader = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': this.apiKey,
      },
      timeout: 600000,
    };

    if (maxRequestMinute === undefined) {
      this.maxRequestMinute = 60 * maxRequest;
    } else {
      this.maxRequestMinute = maxRequestMinute;
    }
  }

  push(url: string) {
    let request: Request = {
      url: url,
      promise: null,
      complete: null,
      reject: null,
    };

    request.promise = new Promise((resolve, reject) => {
      request.complete = (data: any) => {
        resolve(data);
      };

      request.reject = (reason: any) => {
        reject(reason);
      };
    });

    this.reqQueue.push(request);
    this.startWorking();

    return request.promise;
  }

  private startWorking() {
    if (!this.working) {
      this.working = true;
      this.distributeTask();
    }
  }

  private async distributeTask() {
    while (this.reqQueue.length > 0) {
      if (
        this.taskQueue.length === this.maxRequest ||
        this.taskQueueMinute.length === this.maxRequestMinute
      ) {
        break;
      }
      const request = this.reqQueue.shift();
      if (request === undefined) continue;

      this.taskQueue.push(request);
      this.taskQueueMinute.push(request);

      this.work(request);
    }

    this.working = false;
  }

  private async work(request: Request) {
    if (request.complete === null || request.reject === null) return;

    try {
      const response = await axios.get(request.url, this.requestHeader);
      request.complete(response.data);
    } catch (error) {
      if (error.resoponse !== null && error.response.status === 404) {
        console.log(request.url);
        request.complete(null);
      } else {
        request.reject(error);
      }
    } finally {
      setTimeout(() => {
        const idx = this.taskQueue.indexOf(request);
        if (idx > -1) this.taskQueue.splice(idx, 1);
        this.startWorking();
      }, 1000);

      setTimeout(() => {
        const idx = this.taskQueueMinute.indexOf(request);
        if (idx > -1) this.taskQueueMinute.splice(idx, 1);
        this.startWorking();
      }, 60000);
    }
  }
}

export default RequestQueue;
