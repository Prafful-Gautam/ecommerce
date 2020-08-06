import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {
  state$: Observable<T>;
  private _state$: BehaviorSubject<T>;

  protected constructor(initalize: T){
    this._state$ = new BehaviorSubject<T>(initalize);
    this.state$ = this._state$.asObservable();
  }

  get state(){
    return this._state$.getValue();
  }

  protected setState(nextState: T): void {
    console.log('--------------------');
    console.log('previous state', this.state);
    this._state$.next(nextState);
    console.log('current state', this.state);
  }
}
