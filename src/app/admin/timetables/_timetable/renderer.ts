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

    appendTimetableAside(container) {
        const asideNode = container.appendChild(document.createElement('aside'));
        const asideULNode = asideNode.appendChild(document.createElement('ul'));
        this.appendRowHeaders(asideULNode);
    }

    appendRowHeaders(ulNode) {
        for (let t = 0; t < this.timetable.artists.length; t++) {
            const liNode = ulNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'row-heading';
            spanNode.textContent = this.timetable.artists[t];
        }
    }

    appendTimetableSection(container) {
        const sectionNode = container.appendChild(document.createElement('section'));
        const timeNode = sectionNode.appendChild(document.createElement('time'));
        this.appendColumnHeaders(timeNode), this.appendTimeRows(timeNode);
    }

    appendColumnHeaders(node) {
        for (
            let
            headerNode = node.appendChild(document.createElement('header')),
            headerULNode = headerNode.appendChild(document.createElement('ul')),
            r = !1,
            o = !1,
            a = this.timetable.scope.hourStart; !r;) {
            const liNode = headerULNode.appendChild(document.createElement('li'));
            const spanNode = liNode.appendChild(document.createElement('span'));
            spanNode.className = 'time-label';
            spanNode.textContent = this.prettyFormatHour(a);
            if (a !== this.timetable.scope.hourEnd
                || this.timetable.scope.hourStart === this.timetable.scope.hourEnd
                && !o || (r = !0), 24 === ++a ) {
                    a = 0, o = !0;
            }
        }
    }

    appendDivTimeNow(node) {
        const
            divtn = node.appendChild(document.createElement('div'));
            divtn.className = 'timenow';
            divtn.id = 'time';
            divtn.style.left = this.timeNow > this.timetable.scope.hourStart ?
                (this.timeNow - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%' :
                ((this.timeNow + 24) - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';


        setInterval(() => {
            const dateNow = new Date();
            const timeN = +(dateNow.getHours() + (dateNow.getMinutes() / 60)).toFixed(2);
            this.timeNow = timeN;
            divtn.style.left = (this.timeNow - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
          }, 60000);
    }


    appendTimeRows(node) {
        const ulNode = node.appendChild(document.createElement('ul'));
        ulNode.className = 'room-timeline';
        ulNode.id = 'rtl';
        this.appendDivTimeNow(ulNode);
        for (let n = 0; n < this.timetable.artists.length; n++) {
            const r = ulNode.appendChild(document.createElement('li'));
            this.appendLocationEvents(this.timetable.artists[n], r);
        }
    }

    // s(e, t) {
    //     for (let n = 0; n < this.timetable.events.length; n++) {
    //         const r = this.timetable.events[n];
    //         if (r.artist === e)  {
    //             this.d(r, t);
    //         }
    //     }
    // }

    appendLocationEvents(artist, node) {
        for (let n = 0; n < this.timetable.events.length; n++) {
            const event = this.timetable.events[n];
            if (event.artist === artist)  {
                this.appendEvent(event, node);
            }
        }
    }

    appendEvent(event, node) {
        const hasOptions = event.options !== undefined;
        let
            hasUrl = false,
            hasAdditionalClass = false,
            hasDataAttributes = false,
            hasClickHandler = false;

        if (hasOptions) {
            hasUrl = event.options.url !== undefined;
            hasAdditionalClass = event.options.class !== undefined;
            hasDataAttributes = event.options.data !== undefined;
            hasClickHandler = event.options.onClick !== undefined;
        }

        // const url = event.options.url;
        // console.log('n = e.options from renderer:', url);
        const elementType = hasUrl !== undefined ? 'a' :  'span';
        const eventNode = node.appendChild(document.createElement(elementType));
        const smallNode = eventNode.appendChild(document.createElement('small'));
        eventNode.title = event.name;
        console.log(node);
        const optionClass = event.options.class;
        // const matTooltip = 'matTooltip';
        // matTooltip.value = event.description;
        // eventNode.setAttribute('mat-tooltip', event.description);
        // eventNode.setAttribute(matTooltip, event.description);


        if (hasUrl) {
            eventNode.href = event.options.url;
        }
        if (optionClass) {
            eventNode.className = 'time-entry tool-tip ' + optionClass;
        } else {
            eventNode.className = 'time-entry';
        }
        // if (hasDataAttributes) {
        //     event.options.data.array.forEach(key => {
        //         eventNode.setAttribute('data-' + key, event.options.data[key]);
        //     });
        // }
        if (hasClickHandler) {
            eventNode.addEventListener('click', (e) => {
              event.options.onClick(event, this.timetable, e);
            });
        }

        eventNode.style.width = this.computeEventBlockWidth(event);
        eventNode.style.left = this.computeEventBlockOffset(event);
        eventNode.textContent = event.name;
        const div = 'div';
        const toolTip = document.createElement(div);
        toolTip.className = 'tooltiptext';
        // toolTip.textContent = event.description;
        node.appendChild(toolTip);
        const eventNodeLeftToNumber = +eventNode.style.left.slice(0, -1);
        const eventNodewidthToNumber = +eventNode.style.width.slice(0, -1);
        toolTip.style.left = (eventNodeLeftToNumber + eventNodewidthToNumber).toString() + '%';
        console.log('toolTip.style.left', eventNodeLeftToNumber);
        const p = 'p';
        const paragraph = document.createElement(p);
        paragraph.textContent = event.description;
        toolTip.appendChild(paragraph);
    }

    // d(e, t) {
    //     const n = e.options.url;
    //     console.log('n = e.options from renderer:', n);
    //     const optionClass = e.options.class;
    //     let r = '';
    //     n !== undefined ? r = 'a' : r = 'span';
    //     const o = t.appendChild(document.createElement(r));
    //     const a = o.appendChild(document.createElement('small'));
    //     o.title = e.name;
    //     if (n) {
    //         o.href = e.options.url;
    //     }
    //     if (optionClass) {
    //         o.className = 'time-entry ' + optionClass;
    //     } else {
    //         o.className = 'time-entry';
    //     }
    //     o.style.width = this.h(e);
    //     o.style.left = this.f(e);
    //     a.textContent = e.name;
    // }

    // h(e)
    computeEventBlockWidth(event) {
        const
        start = event.startDate,
        end = event.endDate,
        durationHours = this.computeDurationInHours(start, end);
        return durationHours / this.timetable.scopeDurationHours * 100 + '%';
    }


    computeDurationInHours(start, end) {
        return (end.getTime() - start.getTime()) / 1e3 / 60 / 60;
    }

    computeEventBlockOffset(event) {
        const
            eventStart = event.startDate,
            eventStartHours = eventStart.getHours() + (eventStart.getMinutes() / 60),
            eventStartDay = eventStart.getDate();
        if (eventStartHours < this.timetable.scope.hourStart) {
            return ((eventStartHours + 24) - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
        }
        return (eventStartHours - this.timetable.scope.hourStart) / this.timetable.scopeDurationHours * 100 + '%';
    }

}

// return endHour > startHour  ? endHour - startHour : 24 + endHour - startHour;
