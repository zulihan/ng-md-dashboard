import { Tt } from './_models/tt';


export class Renderer {

    timetable;
    selector;
    container;

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

    draw(selector) {
        this.container = selector;
        this.checkContainerPrecondition(this.container);
        this.emptyNode(this.container);
        this.appendTimetableAside(this.container);
        this.appendTimetableSection(this.container);
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

    // function r
    appendTimetableAside(container) {
        const asideNode = container.appendChild(document.createElement('aside'));
        const asideULNode = asideNode.appendChild(document.createElement('ul'));
        this.appendRowHeaders(asideULNode);
    }

    // function o
    appendRowHeaders(ulNode) {
        for (let k = 0; k < this.timetable.locations.length; k++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'row-heading';
            spanNode.textContent = this.timetable.locations[k];
        }
    }

    appendTimetableSection(container) {
        const t = container.appendChild(document.createElement('section'));
        const n = t.appendChild(document.createElement('time'));
        this.appendColumnHeaders(n);
        this.appendTimeRows(n);
    }

    appendColumnHeaders(node) {
        for (
            let
            t = node.appendChild(document.createElement('header')),
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


    // appendColumnHeaders(e) {
    //     for (
    //         let
    //         t = e.appendChild(document.createElement('header')),
    //         n = t.appendChild(document.createElement('ul')),
    //         r = !1,
    //         o = !1,
    //         a = this.timetable.scope.hourStart; !r;) {
    //         const i = n.appendChild(document.createElement('li'));
    //         const u = i.appendChild(document.createElement('span'));
    //         u.className = 'time-label';
    //         u.textContent = this.prettyFormatHour(a);
    //         if (a !== this.timetable.scope.hourEnd
    //             || this.timetable.scope.hourStart === this.timetable.scope.hourEnd
    //             && !o || (r = !0), 24 === ++a ) {
    //                 a = 0, o = !0;
    //         }
    //     }
    // }


    appendTimeRows(node) {
        const ulNode = node.appendChild(document.createElement('ul'));
        ulNode.className = 'room-timeline';
        for (let k = 0; k < this.timetable.locations.length; k++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            this.appendLocationEvents(this.timetable.locations[k], liNode);
        }
    }

    appendLocationEvents(location, node) {
        for (let k = 0; k < this.timetable.events.length; k++) {
            const event = this.timetable.events[k];
            if (event.location === location) {
                this.appendEvent(event, node);
            }
        }
    }

    appendEvent(event, node) {
        const n = event.url,
            r = n ? 'a' : 'span',
            o = node.appendChild(document.createElement(r)),
            a = o.appendChild(document.createElement('small'));
        o.title = event.name;
        if (n) {
            o.href = event.url;
        }
        o.className = 'time-entry';
        o.style.width = this.computeEventBlockWidth(event);
        o.style.left = this.computeEventBlockOffset(event);
        a.textContent = event.name;
    }

    // appendEvent(event, node) {
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

    //     eventNode.className = 'time-entry ';
    //     eventNode.style.width = this.computeEventBlockWidth(event);
    //     eventNode.style.left = this.computeEventBlockOffset(event);
    //     smallNode.textContent = event.name;
    // }

    computeEventBlockWidth(event) {
        const start = event.startDate;
        const end = event.endDate;
        const durationHours = this.computeDurationInHours(start, end);
        return durationHours / this.timetable.scopeDurationHours * 100 + '%';
    }


    computeDurationInHours(start, end) {
        return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
    }

    computeEventBlockOffset(event) {
        const eventStart = event.startDate;
        const eventStartHours = eventStart.getHours() + (eventStart.getMinutes() / 60);
        return (eventStartHours - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
    }

    // computeEventBlockOffset(event) {
    //     const eventStart = event.hourStart;
    //     const eventStartHours = eventStart.getHours() + (eventStart.getMinutes() / 60);
    //     // const hoursBeforeEvent = this.timetable.getDurationHours(scopeStartHours, eventStartHours);
    //     return (eventStartHours - this.timetable.scope.hourStart ) / this.timetable.scopeDurationHours * 100 + '%';
    // }

}
