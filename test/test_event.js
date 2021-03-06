'use strict';

const assert = require('assert');
const moment = require('moment-timezone');
const ICalCalendar = require('../src/calendar');
const ICalEvent = require('../src/event');

describe('ical-generator Event', function () {
    describe('constructor()', function () {
        it('shoud set _data', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.ok(event._data.id, 'data.id set');
            assert.ok(event._data.stamp, 'data.stamp set');
        });

        it('shoud set _attributes', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.ok(event._attributes.length > 0);
        });

        it('shouldn\'t work without calendar reference', function () {
            assert.throws(function () {
                new ICalEvent({summary: 'Testevent'});
            }, /`calendar`/);
        });

        it('shoud load json export', function () {
            const event = new ICalEvent('{"foo":"bar"}', new ICalCalendar());
            assert.equal(event._data.foo, 'bar');
        });
    });

    describe('id()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(event, event.id(1048));
        });

        it('getter should return value', function () {
            const event = new ICalEvent(null, new ICalCalendar()).id(512);
            assert.equal(event.id(), 512);

            event.id('xyz');
            assert.equal(event.id(), 'xyz');
        });
    });

    describe('uid()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(event, event.uid(1048));
        });

        it('getter should return value', function () {
            const event = new ICalEvent(null, new ICalCalendar()).uid(512);
            assert.equal(event.uid(), 512);

            event.id('xyz');
            assert.equal(event.uid(), 'xyz');
        });
    });

    describe('sequence()', function () {
        it('setter should return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(event, event.sequence(1));
        });

        it('getter should return value', function () {
            const event = new ICalEvent(null, new ICalCalendar()).sequence(1048);
            assert.equal(event.sequence(), 1048);
        });

        it('setter should throw error when sequence is not valid', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.sequence('hello');
            }, /`sequence`/);
        });

        it('setter should work with 0', function () {
            const event = new ICalEvent(null, new ICalCalendar()).sequence(12);
            assert.equal(event.sequence(), 12);

            event.sequence(0);
            assert.equal(event.sequence(), 0);
        });
    });

    describe('start()', function () {
        it('getter should return value', function () {
            const now = moment();
            const event = new ICalEvent(null, new ICalCalendar());
            event._data.start = now;
            assert.ok(event.start().isSame(now));
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.start(date.toJSON()));
            assert.ok(event._data.start.isSame(date));
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.start(date.toDate()));
            assert.ok(event._data.start.isSame(date));
        });

        it('setter should throw error when start time is not a Date', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.start(3);
            }, /`start`/, 'Number');
            assert.throws(function () {
                event.start(null);
            }, /`start`/, 'null');
            assert.throws(function () {
                event.start(NaN);
            }, /`start`/, 'NaN');
            assert.throws(function () {
                event.start(new Date('hallo'));
            }, /`start`/, 'Invalid Date');
        });

        it('setter should flip start and end if necessary', function () {
            const start = moment().add(5, 'minutes');
            const end = moment();
            const event = new ICalEvent({end, start}, new ICalCalendar());
            assert.ok(event._data.start.isSame(end));
            assert.ok(event._data.end.isSame(start));
        });

        it('setter should return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(event, event.start(moment()));
            assert.deepEqual(event, event.start(new Date()));
        });
    });

    describe('end()', function () {
        it('getter should return value', function () {
            const now = moment();
            const event = new ICalEvent(null, new ICalCalendar());
            event._data.end = now;
            assert.ok(event.end().isSame(now));
        });

        it('setter should handle null', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event._data.end, null);
            event._data.end = 'foo';

            assert.deepEqual(event, event.end(null));
            assert.equal(event._data.end, null);
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.end(date.toJSON()));
            assert.ok(event._data.end.isSame(date));
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.end(date.toDate()));
            assert.ok(event._data.end.isSame(date));
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.end(3);
            }, /`end`/, 'Number');
            assert.throws(function () {
                event.end(NaN);
            }, /`end`/, 'NaN');
            assert.throws(function () {
                event.end(new Date('hallo'));
            }, /`end`/, 'Invalid Date');
        });

        it('setter should flip start and end if necessary', function () {
            const start = moment().add(5, 'minutes');
            const end = moment();
            const event = new ICalEvent({start, end}, new ICalCalendar());
            assert.ok(event._data.start.isSame(end));
            assert.ok(event._data.end.isSame(start));
        });

        it('setter should return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(event, event.end(moment()));
            assert.deepEqual(event, event.end(new Date()));
        });
    });

    describe('timezone()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar()).timezone('Europe/Berlin');
            assert.equal(e.timezone(), 'Europe/Berlin');
        });

        it('getter should inherit from calendar', function () {
            const cal = new ICalCalendar();
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, cal);

            assert.equal(cal.timezone(), null);
            assert.equal(e.timezone(), null);

            cal._data.timezone = 'Europe/London';
            assert.equal(cal.timezone(), 'Europe/London');
            assert.equal(e.timezone(), 'Europe/London');

            e._data.timezone = 'Europe/Berlin';
            assert.equal(cal.timezone(), 'Europe/London');
            assert.equal(e.timezone(), 'Europe/Berlin');

            cal._data.timezone = null;
            assert.equal(cal.timezone(), null);
            assert.equal(e.timezone(), 'Europe/Berlin');

            e._data.timezone = null;
            assert.equal(cal.timezone(), null);
            assert.equal(e.timezone(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.timezone('Europe/Berlin'));
        });

        it('should update timezone', function () {
            const e = new ICalEvent({
                start: moment(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Example Event'
            }, new ICalCalendar());

            e.timezone('Europe/London');
            assert.equal(e._data.timezone, 'Europe/London');
        });

        it('should disable floating when truthy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e._data.floating = true;
            e.timezone('Europe/London');
            assert.equal(e._data.floating, false);
        });

        it('should not disable floating when falsy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e._data.floating = true;
            e.timezone(null);
            assert.equal(e._data.floating, true);
        });
    });

    describe('stamp()', function () {
        it('getter should return value', function () {
            const now = moment().add(1, 'day');
            const e = new ICalEvent(null, new ICalCalendar()).stamp(now);
            assert.ok(e.stamp().isSame(now));
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.stamp(date.toJSON()));
            assert.ok(event._data.stamp.isSame(date));
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.stamp(date.toDate()));
            assert.ok(event._data.stamp.isSame(date));
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.stamp(3);
            }, /`stamp`/, 'Number');
            assert.throws(function () {
                event.stamp(null);
            }, /`stamp`/, 'null');
            assert.throws(function () {
                event.stamp(NaN);
            }, /`stamp`/, 'NaN');
            assert.throws(function () {
                event.stamp(new Date('hallo'));
            }, /`stamp`/, 'Invalid Date');
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.stamp(new Date()));
        });
    });

    describe('timestamp()', function () {
        it('getter should return value', function () {
            const now = moment().add(1, 'day');
            const e = new ICalEvent(null, new ICalCalendar()).timestamp(now);
            assert.ok(e.timestamp().isSame(now));
        });

        it('setter should parse string if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.timestamp(date.toJSON()));
            assert.ok(event._data.stamp.isSame(date));
        });

        it('setter should handle Dates if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            assert.deepEqual(event, event.timestamp(date.toDate()));
            assert.ok(event._data.stamp.isSame(date));
        });

        it('setter should throw error when time is not a Date', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.timestamp(3);
            }, /`stamp`/, 'Number');
            assert.throws(function () {
                event.timestamp(null);
            }, /`stamp`/, 'null');
            assert.throws(function () {
                event.timestamp(NaN);
            }, /`stamp`/, 'NaN');
            assert.throws(function () {
                event.timestamp(new Date('hallo'));
            }, /`stamp`/, 'Invalid Date');
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.timestamp(new Date()));
        });
    });

    describe('allDay()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e._data.allDay = true;
            assert.equal(e.allDay(), true);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.allDay(true));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.allDay(true);
            assert.equal(event._data.allDay, true);
        });
    });

    describe('floating()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar()).floating(true);
            assert.equal(e.floating(), true);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.floating(false));
            assert.deepEqual(e, e.floating(true));
        });

        it('should update floating', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.floating(true);
            assert.ok(event._data.floating, true);
        });

        it('should remove timezone when truthy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e._data.timezone = 'Europe/London';
            e.floating(true);
            assert.equal(e._data.timezone, null);
        });

        it('should not remove timezone when falsy', function () {
            const e = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            e._data.timezone = 'Europe/London';
            e.floating(false);
            assert.equal(e._data.timezone, 'Europe/London');
        });
    });

    describe('repeating()', function () {
        it('getter should return value', function () {
            const options = {freq: 'MONTHLY', count: 5, interval: 2, exclude: moment(), until: moment()};
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e.repeating(), null);

            e._data.repeating = options;
            assert.deepEqual(e.repeating(), options);

            e._data.repeating = null;
            assert.deepEqual(e.repeating(), null);
        });

        it('setter should handle null', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.repeating(null));
            assert.deepEqual(e._data.repeating, null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.repeating(null), 'repeating(null)');
            assert.deepEqual(e, e.repeating({freq: 'MONTHLY'}), 'repeating({freq: \'MONTHLY\'})');
        });

        it('setter should throw error when repeating without freq', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {}
                }, new ICalCalendar());
            }, /`repeating\.freq` is a mandatory item/);
        });

        it('setter should throw error when repeating when freq is not allowed', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'hello'
                    }
                }, new ICalCalendar());
            }, /must be one of the following/);
        });

        it('setter should update freq', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly'});
            assert.equal(e._data.repeating.freq, 'MONTHLY');
        });

        it('setter should throw error when repeating.count is not a number', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        count: Infinity
                    }
                }, new ICalCalendar());
            }, /`repeating\.count` must be a Number/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        count: 'abc'
                    }
                }, new ICalCalendar());
            }, /`repeating\.count` must be a Number/);
        });

        it('setter should update count', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly', count: 5});
            assert.equal(e._data.repeating.count, 5);
        });

        it('should throw error when repeating.interval is not a number', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: Infinity
                    }
                }, new ICalCalendar());
            }, /`repeating\.interval` must be a Number/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 'abc'
                    }
                }, new ICalCalendar());
            }, /`repeating\.interval` must be a Number/);
        });

        it('setter should update interval', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly', interval: 5});
            assert.equal(e._data.repeating.interval, 5);
        });

        it('should throw error when repeating.until is not a date', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        until: 1413277003
                    }
                }, new ICalCalendar());
            }, /`repeating\.until` must be a Date or a moment object/);
        });

        it('setter should parse repeating.until string if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            event.repeating({freq: 'monthly', until: date.toJSON()});
            assert.ok(event._data.repeating.until.isSame(date));
        });

        it('setter should handle repeating.until Dates if required', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            event.repeating({freq: 'monthly', until: date.toDate()});
            assert.ok(event._data.repeating.until.isSame(date));
        });

        it('setter should handle repeating.until moments', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');
            event.repeating({freq: 'monthly', until: date});
            assert.ok(event._data.repeating.until.isSame(date));
        });

        it('setter should throw error when repeating.until is not a Date', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                event.repeating({freq: 'monthly', until: 3});
            }, /`repeating.until`/, 'Number');
            assert.throws(function () {
                event.repeating({freq: 'monthly', until: null});
            }, /`repeating.until`/, 'null');
            assert.throws(function () {
                event.repeating({freq: 'monthly', until: NaN});
            }, /`repeating.until`/, 'NaN');
            assert.throws(function () {
                event.repeating({freq: 'monthly', until: new Date('foo')});
            }, /`repeating.until`/, 'Invalid Date');
        });

        it('should throw error when repeating.byDay is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.byDay` contains invalid value `FOO`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: ['SU', 'BAR', 'th']
                    }
                }, new ICalCalendar());
            }, /`repeating\.byDay` contains invalid value `BAR`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: ['SU', Infinity, 'th']
                    }
                }, new ICalCalendar());
            }, /`repeating\.byDay` contains invalid value `INFINITY`/);
        });

        it('setter should update repeating.byDay', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly', byDay: ['SU', 'we', 'Th']});
            assert.deepEqual(e._data.repeating.byDay, ['SU', 'WE', 'TH']);
        });

        it('should throw error when repeating.byMonth is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byMonth: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonth` contains invalid value `FOO`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byMonth: [1, 14, 7]
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonth` contains invalid value `14`/);
        });

        it('setter should update repeating.byMonth', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly', byMonth: [1, 12, 7]});
            assert.deepEqual(e._data.repeating.byMonth, [1, 12, 7]);
        });

        it('should throw error when repeating.byMonthDay is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byMonthDay: 'FOO'
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonthDay` contains invalid value `FOO`/);

            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byMonthDay: [1, 32, 15]
                    }
                }, new ICalCalendar());
            }, /`repeating\.byMonthDay` contains invalid value `32`/);
        });

        it('setter should update repeating.byMonthDay', function () {
            const e = new ICalEvent(null, new ICalCalendar());

            e.repeating({freq: 'monthly', byMonthDay: [1, 15]});
            assert.deepEqual(e._data.repeating.byMonthDay, [1, 15]);
        });

        it('should throw error when repeating.exclude is not valid', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: ['SU'],
                        exclude: new Date('FOO')
                    }
                }, new ICalCalendar());
            }, /has to be a valid date/);
        });

        it('should throw error when repeating.exclude is not valid (should throw on first err value', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: ['SU'],
                        exclude: [moment(), new Date('BAR'), 'FOO']
                    }
                }, new ICalCalendar());
            }, /has to be a valid date/);
        });

        it('should throw error when repeating.exclude is not a valid type', function () {
            assert.throws(function () {
                new ICalEvent({
                    start: moment(),
                    end: moment(),
                    summary: 'test',
                    repeating: {
                        freq: 'DAILY',
                        interval: 2,
                        byDay: ['SU'],
                        exclude: 42
                    }
                }, new ICalCalendar());
            }, /must be a Date or a moment object/);
        });

        it('setter should update repeating.exclude', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            const date = moment().add(1, 'week');

            e.repeating({
                freq: 'monthly', exclude: [
                    date.toJSON(),
                    date.toDate(),
                    date
                ]
            });

            assert.ok(e._data.repeating.exclude[0].isSame(date), 'String');
            assert.ok(e._data.repeating.exclude[1].isSame(date), 'Date');
            assert.ok(e._data.repeating.exclude[2].isSame(date), 'Moment');
        });
    });

    describe('summary()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.summary(), '');

            e._data.summary = 'Testevent';
            assert.equal(e.summary(), 'Testevent');
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.summary(null));
            assert.deepEqual(e, e.summary('Testevent'));
        });

        it('should update summary', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.summary('Example Event II');
            assert.equal(event._data.summary, 'Example Event II');

            event.summary(null);
            assert.equal(event._data.summary, '');
        });
    });

    describe('location()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.location(), null);

            e._data.location = 'Test Location';
            assert.equal(e.location(), 'Test Location');

            e._data.location = null;
            assert.equal(e.location(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.location(null));
            assert.deepEqual(e, e.location('Test Location'));
        });

        it('should update location', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.location('Europa-Park');
            assert.equal(event._data.location, 'Europa-Park');
        });
    });

    describe('description()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.description(), null);

            e._data.description = 'I don\'t need a description. I\'m far to awesome for descriptions…';
            assert.equal(e.description(), 'I don\'t need a description. I\'m far to awesome for descriptions…');

            e._data.description = null;
            assert.equal(e.description(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.description(null));
            assert.deepEqual(e, e.description('I don\'t need a description. I\'m far to awesome for descriptions…'));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.description('Well. But other people need descriptions… :/');
            assert.equal(event._data.description, 'Well. But other people need descriptions… :/');
        });
    });

    describe('htmlDescription()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.htmlDescription(), null);

            e._data.htmlDescription = '<marquee>I\'m the best HTML tag in this universe!</marquee>';
            assert.equal(e.htmlDescription(), '<marquee>I\'m the best HTML tag in this universe!</marquee>');

            e._data.htmlDescription = null;
            assert.equal(e.htmlDescription(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.htmlDescription(null));
            assert.deepEqual(e, e.htmlDescription('I don\'t need a description. I\'m far to awesome for descriptions…'));
        });

        it('should change something', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.htmlDescription('<marquee>I\'m the best HTML tag in this universe!</marquee>');
            assert.equal(event._data.htmlDescription, '<marquee>I\'m the best HTML tag in this universe!</marquee>');
        });
    });

    describe('organizer()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.organizer(), null);

            e._data.organizer = null;
            assert.equal(e.organizer(), null);

            e._data.organizer = {name: 'Sebastian Pekarek', email: 'mail@example.com'};
            assert.equal('Sebastian Pekarek', e.organizer().name);
            assert.equal('mail@example.com', e.organizer().email);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.organizer(null));
            assert.deepEqual(e, e.organizer('Sebastian Pekarek <mail@example.com>'));
        });

        it('should work with objects', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.organizer({name: 'Sebastian Pekarek', email: 'mail@example.com'});
            assert.deepEqual(event._data.organizer, {name: 'Sebastian Pekarek', email: 'mail@example.com'});
        });

        it('should work with valid strings', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.organizer('Sebastian Pekarek <mail@example.com>');
            assert.deepEqual(event._data.organizer, {name: 'Sebastian Pekarek', email: 'mail@example.com'});
        });

        it('should throw error when string misformated', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.organizer('foo bar');
            }, /`organizer`/);
        });

        it('should throw error when object misses data', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.organizer({name: 'Sebastian Pekarek'});
            }, /`organizer\.email`/);

            assert.throws(function () {
                e.organizer({email: 'foo'});
            }, /`organizer\.name`/);
        });

        it('should throw error when unknown format', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.organizer(Infinity);
            }, /`organizer`/);
            assert.throws(function () {
                e.organizer(NaN);
            }, /`organizer`/);
        });
    });

    describe('createAttendee()', function () {
        it('if Attendee passed, it should add and return it', function () {
            const ICalAttendee = require('../src/attendee');

            const event = new ICalEvent(null, new ICalCalendar());
            const attendee = new ICalAttendee(null, event);

            assert.equal(event.createAttendee(attendee), attendee, 'createAttendee returns attendee');
            assert.deepEqual(event._data.attendees[0], attendee, 'attendee pushed');
        });

        it('should return a ICalAttendee instance', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const ICalAttendee = require('../src/attendee');

            assert.ok(event.createAttendee() instanceof ICalAttendee);
            assert.equal(event._data.attendees.length, 1, 'attendee pushed');
        });

        it('should accept string', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const attendee = event.createAttendee('Zac <zac@example.com>');

            assert.equal(attendee._data.name, 'Zac');
            assert.equal(attendee._data.email, 'zac@example.com');
            assert.equal(event._data.attendees.length, 1, 'attendee pushed');
        });

        it('should throw error when string misformated', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.createAttendee('foo bar');
            }, /`attendee`/);
        });

        it('should accept object', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const attendee = event.createAttendee({name: 'Zac', email: 'zac@example.com'});

            assert.equal(attendee._data.name, 'Zac');
            assert.equal(attendee._data.email, 'zac@example.com');
            assert.equal(event._data.attendees.length, 1, 'attendee pushed');
        });
    });

    describe('attendees()', function () {
        it('getter should return an array of attendees…', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event._data.attendees.length, 0);

            const attendee = event.createAttendee();
            assert.equal(event.attendees().length, 1);
            assert.deepEqual(event.attendees()[0], attendee);
        });

        it('setter should add attendees and return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const foo = event.attendees([{name: 'Person A'}, {name: 'Person B'}]);

            assert.equal(event.attendees().length, 2);
            assert.deepEqual(foo, event);
        });
    });

    describe('createAlarm()', function () {
        it('should return a ICalAlarm instance', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const ICalAlarm = require('../src/alarm');

            assert.ok(event.createAlarm() instanceof ICalAlarm);
        });

        it('should pass data to instance', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const alarm = event.createAlarm({type: 'audio'});

            assert.equal(alarm._data.type, 'audio');
        });
    });

    describe('alarms()', function () {
        it('getter should return an array of alarms…', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event.alarms().length, 0);

            const alarm = event.createAlarm();
            assert.equal(event.alarms().length, 1);
            assert.deepEqual(event.alarms()[0], alarm);
        });

        it('setter should add alarms and return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const foo = event.alarms([{type: 'audio'}, {type: 'display'}]);

            assert.equal(event._data.alarms.length, 2);
            assert.deepEqual(foo, event);
        });
    });

    describe('createCategory()', function () {
        it('should return a ICalCategory instance', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const ICalCategory = require('../src/category');

            assert.ok(event.createCategory() instanceof ICalCategory);
        });

        it('should pass data to instance', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const category = event.createCategory({name: 'foo'});

            assert.equal(category._data.name, 'foo');
        });
    });

    describe('categories()', function () {
        it('getter should return an array of categories…', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event.categories().length, 0);

            const category = event.createCategory();
            assert.equal(event.categories().length, 1);
            assert.deepEqual(event.categories()[0], category);
        });

        it('setter should add category and return this', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            const foo = event.categories([{name: 'foo'}, {name: 'bar'}]);

            assert.equal(event._data.categories.length, 2);
            assert.deepEqual(foo, event);
        });
    });

    describe('status()', function () {
        it('getter should return value', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event.status(), null);

            event._data.status = 'CONFIRMED';
            assert.equal(event.status(), 'CONFIRMED');

            event._data.status = null;
            assert.equal(event.status(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.status(null));
            assert.deepEqual(e, e.status('confirmed'));
        });

        it('setter should allow setting null', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e._data.status = 'CONFIRMED';
            e.status(null);
            assert.equal(e._data.status, null);
        });

        it('setter should allow setting valid value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.status('confirmed');
            assert.equal(e._data.status, 'CONFIRMED');
        });

        it('should throw error when method not allowed', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.status('COOKING');
            }, /`status`/);
            assert.throws(function () {
                e.status(Infinity);
            }, /`status`/);
            assert.throws(function () {
                e.status(NaN);
            }, /`status`/);
            assert.throws(function () {
                e.status(-1);
            }, /`status`/);
        });
    });

    describe('busystatus()', function () {
        it('getter should return value', function () {
            const event = new ICalEvent(null, new ICalCalendar());
            assert.equal(event.busystatus(), null);

            event._data.busystatus = 'BUSY';
            assert.equal(event.busystatus(), 'BUSY');

            event._data.busystatus = null;
            assert.equal(event.busystatus(), null);
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.busystatus(null));
            assert.deepEqual(e, e.busystatus('busy'));
        });

        it('setter should allow setting null', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e._data.busystatus = 'BUSY';
            e.busystatus(null);
            assert.equal(e._data.busystatus, null);
        });

        it('setter should allow setting valid value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.busystatus('busy');
            assert.equal(e._data.busystatus, 'BUSY');
        });

        it('should throw error when method not allowed', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.busystatus('COOKING');
            }, /`busystatus`/);
            assert.throws(function () {
                e.busystatus(Infinity);
            }, /`busystatus`/);
            assert.throws(function () {
                e.busystatus(NaN);
            }, /`busystatus`/);
            assert.throws(function () {
                e.busystatus(-1);
            }, /`busystatus`/);
        });
    });

    describe('url()', function () {
        it('getter should return value', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.equal(e.url(), null);

            e._data.url = 'http://sebbo.net/';
            assert.equal(e.url(), 'http://sebbo.net/');
        });

        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.url(null));
            assert.deepEqual(e, e.url('http://sebbo.net/'));
        });

        it('should update value', function () {
            const event = new ICalEvent({
                start: moment(),
                summary: 'Example Event'
            }, new ICalCalendar());

            event.url('http://github.com/sebbo2002/ical-generator');
            assert.equal(event._data.url, 'http://github.com/sebbo2002/ical-generator');
        });
    });

    describe('created()', function () {
        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.created(new Date()));
        });

        it('setter should work with moment', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.created(moment());
            assert.ok(moment.isMoment(e._data.created));
        });

        it('setter should work with Date', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.created(new Date());
            assert.ok(moment.isMoment(e._data.created));
        });

        it('setter should work with String', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.created(moment().toJSON());
            assert.ok(moment.isMoment(e._data.created));
        });

        it('setter should work with Number', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.created(new Date().getTime());
            assert.ok(moment.isMoment(e._data.created));
        });

        it('getter should return value', function () {
            const now = new Date();
            const e = new ICalEvent(null, new ICalCalendar()).created(now);
            assert.deepEqual(e.created().valueOf(), now.getTime());
        });

        it('should throw error when created is not a Date', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.created('hallo');
            }, /`created`/);
        });
    });

    describe('lastModified()', function () {
        it('setter should return this', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.deepEqual(e, e.lastModified(new Date()));
        });

        it('setter should work with moment', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.lastModified(moment());
            assert.ok(moment.isMoment(e._data.lastModified));
        });

        it('setter should work with Date', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.lastModified(new Date());
            assert.ok(moment.isMoment(e._data.lastModified));
        });

        it('setter should work with String', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.lastModified(moment().toJSON());
            assert.ok(moment.isMoment(e._data.lastModified));
        });

        it('setter should work with Number', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            e.lastModified(new Date().getTime());
            assert.ok(moment.isMoment(e._data.lastModified));
        });

        it('getter should return value', function () {
            const now = new Date();
            const e = new ICalEvent(null, new ICalCalendar()).lastModified(now);
            assert.deepEqual(e.lastModified().valueOf(), now.getTime());
        });

        it('should throw error when lastModified is not a Date', function () {
            const e = new ICalEvent(null, new ICalCalendar());
            assert.throws(function () {
                e.lastModified('hallo');
            }, /`lastModified`/);
        });
    });

    describe('toJSON()', function () {
        it('should maybe work', function () {
            const date = moment().add(1, 'month');
            const event = new ICalEvent(null, new ICalCalendar()).summary('foo').start(date);

            assert.equal(event.toJSON().summary, 'foo', 'summary is okay');
            assert.ok(date.isSame(event.toJSON().start), 'start is okay');
            assert.equal(typeof event.toJSON().start, 'string', 'start is string');
        });
    });

    describe('_generate()', function () {
        it('shoult throw an error without start', function () {
            const e = new ICalEvent({
                summary: 'Example Event'
            }, new ICalCalendar());
            assert.throws(function () {
                e._generate();
            }, /`start`/);
        });

        it('shoult make use of escaping', function () {
            const e = new ICalEvent({
                start: new Date(),
                end: new Date(new Date().getTime() + 3600000),
                summary: 'Hel\\\\lo\nW;orl,d'
            }, new ICalCalendar());

            assert.ok(e._generate().indexOf('Hel\\\\\\\\lo\\nW\\;orl\\,d') > -1);
        });

        it('should render correct UIDs', function() {
            const cal = new ICalCalendar();
            const event = new ICalEvent({
                id: 42,
                start: moment(),
                summary: ':)'
            }, cal);

            assert.ok(event._generate().indexOf('UID:42@') > -1, 'without domain');

            cal.domain('dojo-enterprises.wtf');
            assert.ok(event._generate().indexOf('UID:42@dojo-enterprises.wtf') > -1, 'with domain');
        });

        /*it('case #1', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
            cal.createEvent({
                id: '123',
                start: moment('2013-10-04T22:39:30Z'),
                end: moment('2013-10-04T23:15:00Z'),
                stamp: moment('2013-10-04T23:34:53Z'),
                summary: 'Simple Event'
            });

            /*jslint stupid: true *
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_01.ics', 'utf8'), 'ical matched 01.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #2', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
            cal.createEvent({
                id: '123',
                start: moment('2013-10-04T22:39:30.000Z'),
                end: moment('2013-10-04T23:15:00.000Z'),
                stamp: moment('2013-10-04T23:34:53.000Z'),
                summary: 'Sample Event',
                location: 'localhost',
                description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.\nbeep boop'
            });

            /*jslint stupid: true *
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_02.ics', 'utf8'), 'ical matched 02.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #3', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN', method: 'add'});
            cal.createEvent({
                id: '123',
                start: moment('2013-10-04T22:39:30.000Z'),
                end: moment('2013-10-06T23:15:00.000Z'),
                allDay: true,
                stamp: moment('2013-10-04T23:34:53.000Z'),
                summary: 'Sample Event',
                organizer: 'Sebastian Pekarek <mail@sebbo.net>',
                status: 'confirmed',
                url: 'http://sebbo.net/'
            });

            /*jslint stupid: true *
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_03.ics', 'utf8'), 'ical matched 03.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #4 (repeating)', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
            cal.events([
                {
                    id: '1',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    end: moment('2013-10-06T23:15:00.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating by month',
                    repeating: {
                        freq: 'monthly',
                        exclude: moment('2013-10-06T23:15:00.000Z')
                    }
                },
                {
                    id: '2',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    end: moment('2013-10-06T23:15:00.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating by day, twice',
                    repeating: {
                        freq: 'DAILY',
                        count: 2
                    }
                },
                {
                    id: '3',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    end: moment('2013-10-06T23:15:00.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating by 3 weeks, until 2014',
                    repeating: {
                        freq: 'WEEKLY',
                        interval: 3,
                        until: moment('2014-01-01T00:00:00.000Z')
                    }
                }
            ]);

            /*jslint stupid: true *
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_04.ics', 'utf8'), 'ical matched 04.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #5 (floating)', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
            cal.createEvent({
                id: '1',
                start: moment('2013-10-04T22:39:30.000Z'),
                end: moment('2013-10-06T23:15:00.000Z'),
                stamp: moment('2013-10-04T23:34:53.000Z'),
                summary: 'floating',
                floating: true
            });

            jslint stupid: true
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_05.ics', 'utf8'), 'ical matched 05.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #6 (attendee with simple delegation and alarm)', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN', method: 'publish'});
            cal.createEvent({
                id: '123',
                start: moment('2013-10-04T22:39:30.000Z'),
                allDay: true,
                stamp: moment('2013-10-04T23:34:53.000Z'),
                summary: 'Sample Event',
                organizer: 'Sebastian Pekarek <mail@sebbo.net>',
                attendees: [
                    {
                        name: 'Matt',
                        email: 'matt@example.com',
                        delegatesTo: {
                            name: 'John',
                            email: 'john@example.com',
                            status: 'accepted'
                        }
                    }
                ],
                alarms: [
                    {
                        type: 'display',
                        trigger: 60 * 10,
                        repeat: 2,
                        interval: 60
                    },
                    {
                        type: 'display',
                        trigger: 60 * 60,
                        description: 'I\'m a reminder :)'
                    }
                ],
                status: 'confirmed',
                url: 'http://sebbo.net/'
            });

            /*jslint stupid: true
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_06.ics', 'utf8'), 'ical matched 06.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });

        it('case #7 (repeating: byDay, byMonth, byMonthDay)', function () {
            const cal = ical({domain: 'sebbo.net', prodId: '//sebbo.net//ical-generator.tests//EN'});
            cal.events([
                {
                    id: '1',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    end: moment('2013-10-06T23:15:00.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating by month',
                    repeating: {
                        freq: 'monthly',
                        byMonth: [1, 4, 7, 10]
                    }
                },
                {
                    id: '2',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating on Mo/We/Fr, twice',
                    repeating: {
                        freq: 'DAILY',
                        count: 2,
                        byDay: ['mo', 'we', 'fr']
                    }
                },
                {
                    id: '3',
                    start: moment('2013-10-04T22:39:30.000Z'),
                    end: moment('2013-10-06T23:15:00.000Z'),
                    stamp: moment('2013-10-04T23:34:53.000Z'),
                    summary: 'repeating on 1st and 15th',
                    repeating: {
                        freq: 'DAILY',
                        interval: 1,
                        byMonthDay: [1, 15]
                    }
                }
            ]);

            /*jslint stupid: true *
            const fs = require('fs');
            const string = cal.toString();
            assert.equal(string, fs.readFileSync(__dirname + '/results/generate_07.ics', 'utf8'), 'ical matched 07.ics');

            const json = JSON.stringify(cal.toJSON());
            assert.equal(ical(json).toString(), string, 'ical json export and reimport matches original');
        });*/
    });
});