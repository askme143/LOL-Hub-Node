import axios, { AxiosError } from 'axios';

interface Request {
  url: string;
  callback: (_data: any) => any;
}

class RequestQueue {
  private apiKey: string = '';
  private requestHeader = {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
      'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Riot-Token': this.apiKey,
    },
  };

  private maxRequest: number = 0; // Max request per second

  private reqQueue: Request[] = [];
  private taskQueue: Request[] = [];

  private working: boolean = false;

  constructor(apiKey: string, maxRequest: number) {
    this.apiKey = apiKey;
    this.maxRequest = maxRequest;
  }

  push(url: string, callback: (_data: any) => any) {
    this.reqQueue.push({ url, callback });
    this.startWorking();
  }

  private startWorking() {
    if (this.working) {
      return;
    } else {
      this.working = true;
      this.distributeTask();
    }
  }

  private async distributeTask() {
    while (this.reqQueue.length > 0) {
      if (this.taskQueue.length == this.maxRequest) {
        break;
      }
      const request = this.reqQueue.shift();
      if (request === undefined) continue;

      this.taskQueue.push(request);

      this.work(request);
    }

    this.working = false;
  }

  private async work(request: Request) {
    const url = request.url;

    const response = await axios
      .get(url, this.requestHeader)
      .catch((error: AxiosError) => {
        if (error.response && error.response.status == 404) {
          return null;
        } else {
          throw error;
        }
      });

    if (response === null) {
      request.callback(null);

      const idx = this.taskQueue.indexOf(request);
      if (idx > -1) this.taskQueue.splice(idx, 1);
    } else {
      request.callback(response.data);

      setTimeout(() => {
        const idx = this.taskQueue.indexOf(request);
        if (idx > -1) this.taskQueue.splice(idx, 1);
        this.startWorking();
      }, 1000);
    }
  }
}

export default RequestQueue;