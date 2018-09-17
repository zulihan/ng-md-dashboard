import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy  } from '@angular/core';

@Pipe({
  name: 'countdown2'
})
export class CountdownPipe implements PipeTransform, OnDestroy {
  changeDetectorRef;
  ngZone;
  timer;
  times = {
    year: 31557600,
    month: 2629746,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
};

  /**
   * @param {?} changeDetectorRef
   * @param {?} ngZone
   */
  constructor(changeDetectorRef: ChangeDetectorRef, ngZone: NgZone) {
    this.changeDetectorRef = changeDetectorRef;
    this.ngZone = ngZone;
}
transform(value) {
  this.removeTimer();
  const /** @type {?} */ d = new Date(value);
  const /** @type {?} */ now = new Date();
  let /** @type {?} */ seconds = Math.round(Math.abs(( now.getTime() - d.getTime()) / 1000));
  console.log('D time' , d.getTime());
  const /** @type {?} */ timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) * 1000;

  this.timer = this.ngZone.runOutsideAngular(() => {
      if (typeof window !== 'undefined') {
          return window.setTimeout(() => {
              this.ngZone.run(() => this.changeDetectorRef.markForCheck());
          }, timeToUpdate);
      }
      return null;
  });
  const /** @type {?} */ minutes = Math.round(Math.abs(seconds / 60));
  const /** @type {?} */ hours = Math.round(Math.abs(minutes / 60));
  const /** @type {?} */ days = Math.round(Math.abs(hours / 24));
  const /** @type {?} */ months = Math.round(Math.abs(days / 30.416));
  const /** @type {?} */ years = Math.round(Math.abs(days / 365));
  if (Number.isNaN(seconds)) {
      return '';
  }
  let time_string = '';
        let plural = '';
        for (const key in this.times) {
            if (Math.floor(seconds / this.times[key]) > 0) {
                if (Math.floor(seconds / this.times[key]) > 1 ) {
                    plural = 's';
                } else {
                    plural = '';
                }
                time_string += Math.floor(seconds / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
                seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);
            }
        }
        return time_string;

}

      /**
     * @return {?}
     */
    ngOnDestroy() {
      this.removeTimer();
  }
  /**
   * @return {?}
   */
  removeTimer() {
      if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
      }
  }
  /**
   * @param {?} seconds
   * @return {?}
   */
  getSecondsUntilUpdate(seconds: any): any {
    const /** @type {?} */ min = 60;
    const /** @type {?} */ hr = min * 60;
    const /** @type {?} */ day = hr * 24;
      if (seconds < min) {
          // less than 1 min, update every 2 secs
          return 2;
      } else if (seconds < hr) {
          // less than an hour, update every 30 secs
          return 30;
      } else if (seconds < day) {
          // less then a day, update every 5 mins
          return 300;
      } else {
          // update every hour
          return 3600;
      }
  }
}


