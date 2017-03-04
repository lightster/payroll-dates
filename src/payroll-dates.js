var module = function() {
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
