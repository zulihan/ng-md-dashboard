import { Tt } from './_models/tt';


export class Renderer {

    timetable;
    selector;
    container;
    dateNow = new Date();
    timeNow = +(this.dateNow.getHours() + (this.dateNow.getMinutes() / 60)).toFixed(2);

    constructor(tt) {
        if (!(this.isOfTypeITimetable(tt))) {
            throw new Error('Initialize renderer using a Timetable');
         }
         this.timetable = tt;
    }

    isOfTypeITimetable(object: any): object is Tt {
        return (<Tt>object) !== null;
    }

    prettyFormatHour(e) {
        const t = 10 > e ? '0' : '';
        return t + e + ':00';
    }

    scrollToTimeNow() {
        const elmnt = document.getElementById('rtl');
        elmnt.scrollIntoView();
    }

    draw(selector) {
        this.container = selector;
        this.checkContainerPrecondition(this.container);
        this.emptyNode(this.container);
        this.r(this.container);
        this.a(this.container);
        // syncscroll.reset();
    }

    emptyNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    checkContainerPrecondition(container) {
        if (container === null) {
            throw new Error('Timetable container not found');
        }
    }

    r(e) {
        const t = e.appendChild(document.createElement('aside'));
        const n = t.appendChild(document.createElement('ul'));
        this.o(n);
    }

    o(e) {
        for (let t = 0; t < this.timetable.artists.length; t++) {
            const n = e.appendChild(document.createElement('li'));
            const r = n.appendChild(document.createElement('span'));
            r.className = 'row-heading';
            r.textContent = this.timetable.artists[t];
        }
    }

    a(e) {
        const t = e.appendChild(document.createElement('section'));
        const n = t.appendChild(document.createElement('time'));
        this.u(n), this.l(n);
    }

    u(e) {
        for (
            let
            t = e.appendChild(document.createElement('header')),
            n = t.appendChild(document.createElement('ul')),
            r = !1,
            o = !1,
            a = this.timetable.scope.hourStart; !r;) {
            const i = n.appendChild(document.createElement('li'));
            const u = i.appendChild(document.createElement('span'));
            u.className = 'time-label';
            u.textContent = this.prettyFormatHour(a);
            if (a !== this.timetable.scope.hourEnd
                || this.timetable.scope.hourStart === this.timetable.scope.hourEnd
                && !o || (r = !0), 24 === ++a ) {
                    a = 0, o = !0;
            }
        }
    }

    appendDivTimeNow(node) {
        const divtn = node.appendChild(document.createElement('div'));
        divtn.className = 'timenow';
        divtn.id = 'time';
        divtn.style.left = (this.timeNow - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
        setInterval(() => {
            const dateNow = new Date();
            const timeN = +(dateNow.getHours() + (dateNow.getMinutes() / 60)).toFixed(2);
            this.timeNow = timeN;
            divtn.style.left = (this.timeNow - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
          }, 60000);
    }


    l(e) {
        const t = e.appendChild(document.createElement('ul'));
        t.className = 'room-timeline';
        t.id = 'rtl';
        this.appendDivTimeNow(t);
        for (let n = 0; n < this.timetable.artists.length; n++) {
            const r = t.appendChild(document.createElement('li'));
            this.s(this.timetable.artists[n], r);
        }
    }

    s(e, t) {
        for (let n = 0; n < this.timetable.events.length; n++) {
            const r = this.timetable.events[n];
            if (r.artist === e)  {
                this.d(r, t);
            }
        }
    }

    d(e, t) {
        const n = e.options.url;
        console.log('n = e.options from renderer:', n);
        const optionClass = e.options.class;
        let r = '';
        n !== undefined ? r = 'a' : r = 'span';
        const o = t.appendChild(document.createElement(r));
        const a = o.appendChild(document.createElement('small'));
        o.title = e.name;
        if (n) {
            o.href = e.options.url;
        }
        if (optionClass) {
            o.className = 'time-entry ' + optionClass;
        } else {
            o.className = 'time-entry';
        }
        o.style.width = this.h(e);
        o.style.left = this.f(e);
        a.textContent = e.name;
    }

    h(e) {
        const
            t = e.startDate,
            n = e.endDate,
            r = this.m(t, n);
        return r / this.timetable.scopeDurationHours * 100 + '%';
    }


    m(e, t) {
        return (t.getTime() - e.getTime()) / 1e3 / 60 / 60;
    }

    f(e) {
        const
            t = e.startDate,
            n = t.getHours() + (t.getMinutes() / 60);
        return (n - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
    }

}
