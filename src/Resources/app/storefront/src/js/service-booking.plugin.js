import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

import moment from 'moment';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import momentPlugin from '@fullcalendar/moment';
import deLocale from '@fullcalendar/core/locales/de';
import $ from 'jquery';

// Set the locales for moment
moment.locale('de');

const formatDate = (date) => {
    return moment(date).format('lll');
}

export default class ServiceBookingPlugin extends Plugin {
    static options = {
        calendarSettings: {
            plugins: [dayGridPlugin, listPlugin, bootstrapPlugin, momentPlugin],
            locale: deLocale,
            themeSystem: 'bootstrap',
            startTime: '8:00',
            endTime: '18:00',
            eventLimit: true, // for all non-TimeGrid views
            defaultView: 'listMonth',
            header: {
                left: 'dayGridMonth',
                center: 'title',
                right: 'today prev,next listMonth',
                buttonIcons: {
                },
            },
            views: {
                dayGrid: {
                    eventLimit: 3, // adjust to 3 only for timeGridWeek/timeGridDay
                },
            },
        },

        buyButtonSelector: '.btn-buy',
        valueFieldSelector: '.service-booking__value',
        displayPlaceholderSelector: '.service-booking__placeholder'
    }

    init() {
        // Get the configuration from the DOM element
        this.config = DomAccess.getDataAttribute(this.el, 'service-booking-options');
        this.buyButton = DomAccess.querySelector(document, this.options.buyButtonSelector);
        this.valueField = DomAccess.querySelector(document, this.options.valueFieldSelector);
        this.selectedDateDisplay = DomAccess.querySelector(document, this.options.displayPlaceholderSelector);

        const config = {
            ...this.options.calendarSettings,
            ...{
                eventRender: this.eventRender.bind(this),
                events: this.initialzeEvents.bind(this),
                validRange: this.validRange,
                eventClick: this.onEventClick.bind(this)
            },
        }

        this.calendar = new Calendar(this.el, config);
        this.calendar.render();

        this.updateBuyButton();
    }

    initialzeEvents(info, successCallback) {
        const events = this.config.dates.map((date) => {
            return {
                id: date.id,
                title: (this.firstCharUppercase(this.config.type)),
                start: moment(date.start).format(),
                end: moment(date.end).format(),
                description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor',
                classNames: [`fc-${this.config.type}`],
            };
        });

        successCallback(events);
    }

    popoverContent(info) {
        return `
              <ul class="event-details">
                  <li>Start: ${formatDate(info.event.start)}</li>
                  <li>End: ${formatDate(info.event.end)}</li>
              </ul>
              <p class="description">${info.event.extendedProps.description}</p>
          `;
    }

    validRange(nowDate) {
        return {
            start: nowDate,
        };
    }

    eventRender(info) {
        $(info.el).popover({
            title: info.event.title,
            trigger: 'hover',
            placement: 'top',
            html: true,
            content: this.popoverContent(info),
        });
    }

    firstCharUppercase(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    updateBuyButton() {
        const value = this.valueField.value;
        const isEnabled = value && value.length;

        if (!isEnabled) {
            this.buyButton.setAttribute('disabled', 'disabled');
            return true;
        }

        this.buyButton.removeAttribute('disabled');

        return true;
    }

    updatePlaceholder(event) {
        const el = this.selectedDateDisplay;
        if (el.classList.contains('non--selected')) {
            el.classList.remove('non--selected');
        }

        el.innerHTML = `
            ${formatDate(event.start)} Uhr - ${formatDate(event.end)} Uhr
        `;

        return true;
    }

    updateValue(value = '') {
        this.valueField.value = value;
        return true;
    }

    onEventClick(info) {
        const selectedEvent = info.event;
        this.updateValue(selectedEvent.id);
        this.updateBuyButton();
        this.updatePlaceholder(selectedEvent)
    }
}
