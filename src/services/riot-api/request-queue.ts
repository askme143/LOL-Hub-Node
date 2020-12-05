import axios, { AxiosError } from 'axios';

interface Request {
  url: string;
  promise: Promise<any>;
  complete: (data: any) => any;
}

class RequestQueue {
  private requestHeader: any;

  private maxRequestSec: number = 0; // Max request per second
  private maxRequestMin: number = 0;

  private reqQueue: Request[] = [];
  private taskQueue: Request[] = [];
  private taskQueueMin: Request[] = [];

  private working: boolean = false;

  constructor(apiKey: string, maxRequestSec: number, maxRequestMin?: number) {
    this.requestHeader = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Riot-Token': apiKey,
      },
      timeout: 600000,
    };

    this.maxRequestSec = maxRequestSec;

    if (maxRequestMin === undefined) {
      this.maxRequestMin = 60 * maxRequestSec;
    } else {
      this.maxRequestMin = maxRequestMin;
    }
  }

  push(url: string) {
    let request = { url } as Request;

    request.promise = new Promise((resolve, reject) => {
      request.complete = (data: any) => {
        resolve(data);
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
        this.taskQueue.length === this.maxRequestSec ||
        this.taskQueueMin.length === this.maxRequestMin
      ) {
        break;
      }
      const request = this.reqQueue.shift();
      if (request === undefined) continue;

      this.taskQueue.push(request);
      this.taskQueueMin.push(request);

      this.work(request);
    }

    this.working = false;
  }

  private async work(request: Request) {
    try {
      const response = await axios.get(request.url, this.requestHeader);
      request.complete(response.data);
    } finally {
      setTimeout(() => {
        const idx = this.taskQueue.indexOf(request);
        if (idx > -1) this.taskQueue.splice(idx, 1);
        this.startWorking();
      }, 1000);

      setTimeout(() => {
        const idx = this.taskQueueMin.indexOf(request);
        if (idx > -1) this.taskQueueMin.splice(idx, 1);
        this.startWorking();
      }, 60000);
    }
  }
}

export default RequestQueue;
