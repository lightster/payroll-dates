var module = function() {
  var adjustDate = function(payDate) {
    if (this.config.weekendAdjustment === 'closest') {
      return adjustWeekendToClosestWeekday(payDate);
    }
    if (this.config.weekendAdjustment === 'previous') {
      return adjustWeekendToPreviousWeekday(payDate);
    }
    if (this.config.weekendAdjustment === 'next') {
      return adjustWeekendToNextWeekday(payDate);
    }
  };
  var adjustWeekendToClosestWeekday = function(payDate) {
    if (payDate.getDay() === 0) { // Sunday -> Monday
      payDate.setDate(payDate.getDate() + 1);
    } else if (payDate.getDay() === 6) { // Saturday -> Friday
      payDate.setDate(payDate.getDate() - 1);
    }
  };
  var adjustWeekendToPreviousWeekday = function(payDate) {
    if (payDate.getDay() === 0) { // Sunday -> Friday
      payDate.setDate(payDate.getDate() - 2);
    } else if (payDate.getDay() === 6) { // Saturday -> Friday
      payDate.setDate(payDate.getDate() - 1);
    }
  };
  var adjustWeekendToNextWeekday = function(payDate) {
    if (payDate.getDay() === 0) { // Sunday -> Monday
      payDate.setDate(payDate.getDate() + 1);
    } else if (payDate.getDay() === 6) { // Saturday -> Monday
      payDate.setDate(payDate.getDate() + 2);
    }
  };

  var PayrollDates = {
    init: function(config) {
      this.config = config;
    },

    next: function(count, startDate) {
      count = count ? count : 1;
      startDate = startDate ? new Date(startDate) : new Date();

      var dates = [];
      if ('weekly' === this.config.repeats) {
        var periodLength = this.config.repeatEvery * 60 * 60 * 24 * 7;
        var payrollStartsOn = new Date(this.config.startsOn);

        var payrollStartsOnTs = payrollStartsOn.getTime() / 1000;
        var startDateTs = startDate.getTime() / 1000;

        var getFirstDateTimestamp = function() {
          if (payrollStartsOnTs <= startDateTs) {
            var diff = startDateTs - payrollStartsOnTs;
            var remainder = diff % periodLength;
            var firstStep = (0 === remainder ? 0 : periodLength);
            return startDateTs - remainder + firstStep;
          }

          var diff = payrollStartsOnTs - startDateTs;
          var remainder = diff % periodLength;
          return firstDateTs = startDateTs + remainder;
        };

        var firstDateTs = getFirstDateTimestamp();
        for (var i = 0; i < count; i++) {
          dates.push(new Date((firstDateTs + periodLength * i) * 1000));
        }
      } else if ('monthly' === this.config.repeats) {
        var dateIndex;
        var year = startDate.getFullYear();
        var month = startDate.getMonth();
        var date = startDate.getDate();
        var datesConfig = this.config.dates;

        var normalize = function() {
          if (dateIndex >= datesConfig.length) {
            dateIndex = 0;
            ++month;
            if (month >= 12) { // month is zero-based, 0-11, so 12 is January
              month = 0;
              ++year;
            }
          }
        };

        for (dateIndex = 0; dateIndex < datesConfig.length; dateIndex++) {
          if (date <= datesConfig[dateIndex]) {
            break;
          }
        }
        normalize();

        for (var i = 0; i < count; i++) {
          var payDate = new Date(year, month, datesConfig[dateIndex], 0, 0, 0);
          adjustDate.call(this, payDate);

          dates.push(payDate);

          ++dateIndex;
          normalize();
        }
      }

      return dates;
    },
  };

  return function(config) {
    var payrollDates = Object.create(PayrollDates);
    payrollDates.init(config);

    return payrollDates;
  };
};

define(
  'payroll-dates',
  [],
  module
);
