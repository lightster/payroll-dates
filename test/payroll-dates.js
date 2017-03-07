var requirejs = require('requirejs');
var test = require('tape');

requirejs.config({
  baseUrl: 'src',
});

test('calculate weekly payroll dates', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'weekly',
    repeatEvery: 2,
    startsOn: '2016-10-19',
  });

  t.deepEqual(
    paySchedule.next(4, '2017-02-20'),
    [
      (new Date('2017-02-22')),
      (new Date('2017-03-08')),
      (new Date('2017-03-22')),
      (new Date('2017-04-05')),
    ]
  );
});

test('calculate weekly historical payroll dates', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'weekly',
    repeatEvery: 2,
    startsOn: '2016-10-19',
  });

  t.deepEqual(
    paySchedule.next(5, '2016-04-04'),
    [
      (new Date('2016-04-06')),
      (new Date('2016-04-20')),
      (new Date('2016-05-04')),
      (new Date('2016-05-18')),
      (new Date('2016-06-01')),
    ]
  );
});

test('calculate weekly payroll dates relative to today', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'weekly',
    repeatEvery: 2,
    startsOn: '2016-10-19',
  });

  t.deepEqual(
    paySchedule.next(4),
    paySchedule.next(4, new Date())
  );
});
