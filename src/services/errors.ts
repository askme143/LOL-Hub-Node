export type SummonerErrorCase =
  | 'NoSuchSummoner'
  | 'AlreadyExists'
  | 'WithdrawnSummoner';

export class SummonerError extends Error {
  errorCase: SummonerErrorCase;
  constructor(errorCase: SummonerErrorCase) {
    super(errorCase);
    this.errorCase = errorCase;
  }
}
