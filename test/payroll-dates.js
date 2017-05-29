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

test('calculate monthly payroll dates', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'monthly',
    dates: [1, 15],
  });

  t.deepEqual(
    paySchedule.next(4, '2017-02-20'),
    [
      (new Date(2017, 3 - 1, 1)),
      (new Date(2017, 3 - 1, 15)),
      (new Date(2017, 4 - 1, 1)),
      (new Date(2017, 4 - 1, 15)),
    ]
  );
});

test('calculate monthly historical payroll dates', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'monthly',
    dates: [1, 16],
  });

  t.deepEqual(
    paySchedule.next(5, '2016-11-04'),
    [
      (new Date(2016, 11 - 1, 16)),
      (new Date(2016, 12 - 1, 1)),
      (new Date(2016, 12 - 1, 16)),
      (new Date(2017, 1 - 1, 1)),
      (new Date(2017, 1 - 1, 16)),
    ]
  );
});

test('calculate monthly payroll dates relative to today', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'monthly',
    dates: [2, 17],
  });

  t.deepEqual(
    paySchedule.next(4),
    paySchedule.next(4, new Date())
  );
});

test('calculate monthly payroll dates with weekends adjusted to closest weekday', function(t) {
  t.plan(1);

  var payrollDates = requirejs('payroll-dates');
  var paySchedule = payrollDates({
    repeats: 'monthly',
    dates: [1, 16],
    weekendAdjustment: 'closest',
  });

  t.deepEqual(
    paySchedule.next(5, '2017-06-29'),
    [
      (new Date(2017, 6 - 1, 30)),
      (new Date(2017, 7 - 1, 17)),
      (new Date(2017, 8 - 1, 1)),
      (new Date(2017, 8 - 1, 16)),
      (new Date(2017, 9 - 1, 1)),
    ]
  );
});
