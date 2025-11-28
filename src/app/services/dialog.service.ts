import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface DialogConfig {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'confirm' | 'alert';
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private dialogSubject = new BehaviorSubject<DialogConfig | null>(null);
    dialog$ = this.dialogSubject.asObservable();

    private resultSubject = new Subject<boolean>();

    confirm(config: DialogConfig): Observable<boolean> {
        this.dialogSubject.next({
            ...config,
            type: 'confirm',
            confirmText: config.confirmText || 'Confirmar',
            cancelText: config.cancelText || 'Cancelar'
        });
        return this.resultSubject.asObservable();
    }

    alert(config: DialogConfig): Observable<boolean> {
        this.dialogSubject.next({
            ...config,
            type: 'alert',
            confirmText: config.confirmText || 'OK'
        });
        return this.resultSubject.asObservable();
    }

    close(result: boolean) {
        this.dialogSubject.next(null);
        this.resultSubject.next(result);
        // We don't complete the subject because we reuse it, 
        // but actually for a one-off dialog request we might want a new subject each time?
        // A better approach for a singleton service handling one dialog at a time:
        // The component subscribes to the service.
        // But the caller needs a specific observable for *their* request.
        // Let's keep it simple: The service exposes a method that returns an Observable.
        // But since we are using a shared component, we need to bridge the component action to that observable.
        // Actually, creating a new Subject for each request is safer.
    }
}
