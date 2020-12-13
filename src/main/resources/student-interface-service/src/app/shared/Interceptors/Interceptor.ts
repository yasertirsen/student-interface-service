import {Injectable} from "@angular/core";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import {Observable, Observer} from "rxjs";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private readonly requests: Array<HttpRequest<any>> = [];

  constructor() {
  }

  removeRequest(req: HttpRequest<any>): void {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    //this.store.dispatch(LoaderAction({isLoading: this.requests.length > 0}));
    //do it with subjects or event emitter
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);
    //this.store.dispatch(LoaderAction({isLoading: true}));


    return new Observable((observer: Observer<HttpResponse<any>>) => {
      const subscription = next.handle(req)
        .subscribe((event: HttpResponse<any>) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        }, (err: HttpErrorResponse) => {
          this.removeRequest(req);
          observer.error(err);
        }, () => {
          this.removeRequest(req);
          observer.complete();
        });

      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });

  }
}
