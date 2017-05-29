var module = function() {
  var adjustDate = function(payDate) {
    if (this.config.weekendAdjustment === 'closest') {
      return adjustWeekend(payDate, -1, 1);
    }
    if (this.config.weekendAdjustment === 'previous') {
      return adjustWeekend(payDate, -1, -2);
    }
    if (this.config.weekendAdjustment === 'next') {
      return adjustWeekend(payDate, 2, 1);
    }
  };
  var adjustWeekend = function(payDate, saturdayAdjustment, sundayAdjustment) {
    if (payDate.getDay() === 0) {
      payDate.setDate(payDate.getDate() + sundayAdjustment);
    } else if (payDate.getDay() === 6) {
      payDate.setDate(payDate.getDate() + saturdayAdjustment);
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
