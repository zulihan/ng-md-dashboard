import { Tt } from './_models/tt';


export class Renderer {

    timetable;
    selector;
    container;

    p = this.timetable;
    E = this.t(this.p.scope.hourStart, this.p.scope.hourEnd);


    constructor(tt) {
        if (!(this.isOfTypeITimetable(tt))) {
            throw new Error('Initialize renderer using a Timetable');
         }
         this.timetable = tt;
    }

    isOfTypeITimetable(object: any): object is Tt {
        return (<Tt>object) !== null;
    }


    draw(selector) {
        this.container = selector;
        this.n(selector);
        this.r(selector);
        this.a(selector);
        // syncscroll.reset();
    }


    // prettyFormatHour
    c(e) {
        const t = 10 > e ? '0' : '';
        return t + e + ':00';
    }

    t(e, t) {
        return t > e ? t - e : 24 + t - e;
    }
    n(e) {
        if (null === e) {
            throw new Error('Timetable container not found');
        }

    }
    r(e) {
        const t = e.appendChild(document.createElement('aside'))
          , n = t.appendChild(document.createElement('ul'));
        this.o(n);
    }
    o(e) {
        for (let t = 0; t < this.p.locations.length; t++) {
            const n = e.appendChild(document.createElement('li'))
              , r = n.appendChild(document.createElement('span'));
            r.className = 'row-heading',
            r.textContent = this.p.locations[t];
        }
    }
    a(e) {
        const t = e.appendChild(document.createElement('section'))
          , n = t.appendChild(document.createElement('time'));
          this.u(n),
          this.l(n);
    }
    u(e) {
        for (
            let t = e.appendChild(document.createElement('header')),
            n = t.appendChild(document.createElement('ul')),
            r = !1, o = !1, a = this.p.scope.hourStart; !r; ) {
            const i = n.appendChild(document.createElement('li')),
            u = i.appendChild(document.createElement('span'));
            u.className = 'time-label',
            u.textContent = this.c(a);
            if (a !== this.p.scope.hourEnd || this.p.scope.hourStart === this.p.scope.hourEnd && !o || (r = !0),
            24 === ++a) {
                a = 0,
                o = !0 ;
            }
        }
    }
    l(e) {
        const t = e.appendChild(document.createElement('ul'));
        t.className = 'room-timeline';
        for (let n = 0; n < this.p.locations.length; n++) {
            const r = t.appendChild(document.createElement('li'));
            this.s(this.p.locations[n], r);
        }
    }
    s(e, t) {
        for (let n = 0; n < this.p.events.length; n++) {
            const r = this.p.events[n];
            if (r.location === e) {
                this.d(r, t);
            }
        }
    }

    d(event, node) {
            const hasOptions = event.options !== undefined;
            let hasURL, hasAdditionalClass, hasDataAttributes, hasClickHandler = false;

            if (hasOptions) {
                hasURL = event.options.url !== undefined;
                hasAdditionalClass = event.options.class !== undefined;
                hasDataAttributes = event.options.data !== undefined;
                hasClickHandler = event.options.onClick !== undefined;
            }

            const elementType = hasURL ? 'a' : 'span';
            const eventNode = node.appendChild(document.createElement(elementType));
            const smallNode = eventNode.appendChild(document.createElement('small'));
            eventNode.title = event.name;

            if (hasURL) {
                eventNode.href = event.options.url;
            }

            if (hasDataAttributes) {
                for (const key in event.options.data) {
                    if (event.options.data.hasOwnProperty(key)) {
                        eventNode.setAttribute('data-' + key, event.options.data[key]);
                    }
                }
            }

            if (hasClickHandler) {
                eventNode.addEventListener('click', function (e) {
                    event.options.onClick(event, this.timetable, e);
                });
            }

            eventNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
            eventNode.style.width = this.h(event);
            eventNode.style.left = this.f(event);
            smallNode.textContent = event.name;
        }


    // (event, node) {
    //     const hasOptions = event.options !== undefined;
    //     let hasURL, hasAdditionalClass, hasDataAttributes, hasClickHandler = false;

    //     if (hasOptions) {
    //         hasURL = event.options.url !== undefined;
    //         hasAdditionalClass = event.options.class !== undefined;
    //         hasDataAttributes = event.options.data !== undefined;
    //         hasClickHandler = event.options.onClick !== undefined;
    //     }

    //     const elementType = hasURL ? 'a' : 'span';
    //     const eventNode = node.appendChild(document.createElement(elementType));
    //     const smallNode = eventNode.appendChild(document.createElement('small'));
    //     eventNode.title = event.name;

    //     if (hasURL) {
    //         eventNode.href = event.options.url;
    //     }

    //     if (hasDataAttributes) {
    //         for (const key in event.options.data) {
    //             if (event.options.data.hasOwnProperty(key)) {
    //                 eventNode.setAttribute('data-' + key, event.options.data[key]);
    //             }
    //         }
    //     }

    //     if (hasClickHandler) {
    //         eventNode.addEventListener('click', function (e) {
    //             event.options.onClick(event, this.timetable, e);
    //         });
    //     }

    //     eventNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
    //     eventNode.style.width = this.h(event);
    //     eventNode.style.left = this.f(event);
    //     smallNode.textContent = event.name;
    // }



    h(e) {
        const t = e.startDate
          , n = e.endDate
          , r = this.m(t, n);
        return r / this.E * 100 + '%';
    }
    m(e, t) {
        return (t.getTime() - e.getTime()) / 1e3 / 60 / 60;
    }

    f(e) {
        const t = e.startDate
          , n = t.getHours() + t.getMinutes() / 60;
        return (n - this.p.scope.hourStart) / this.E * 100 + '%';
    }

}

