({
  baseUrl: 'src',
  name: '../node_modules/almond/almond',
  include: ['payroll-dates'],
  out: 'dist/payroll-dates.min.js',
  wrap: {
    startFile: '.almond/start.frag',
    endFile: '.almond/end.frag',
  },
});
