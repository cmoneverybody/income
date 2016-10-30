var app = angular.module("incoming", ["firebase", 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngLocale']);
/*firebase.initializeApp({
   apiKey: "AIzaSyARARvfxcSN1CSzom2cBfRMxb-9WpCxbrA",
   authDomain: "soundcrumbs-2a8a4.firebaseapp.com",
   databaseURL: "https://soundcrumbs-2a8a4.firebaseio.com",
   storageBucket: "soundcrumbs-2a8a4.appspot.com",
   messagingSenderId: "183407586911"
});

app.controller("incomingCtrl", function($scope, $firebaseArray) {
   var
      ref = firebase.database().ref('SoundCrumbs');
   $scope.crumbs = $firebaseArray(ref);
});*/

var rec = {
   month: '2016-10',
   date: '31',
   alena: {
      incoming: 10000,
      cost: 1000
   },
   alexey: {
      incoming: 5000,
      cost: 500
   }
};

function prepareMonthWeeks(year, month) {
   var
      weeks = [],
      weeksDays,
      daysInMonth = moment([year, month, '01'].join('-')).daysInMonth(),
      firstDay = moment([year, month, '01'].join('-')).weekday() + 1, // 1 - 7
      lastDay = moment([year, month, daysInMonth].join('-')).weekday() + 1, // 1 - 7
      daysForDrawMonth = daysInMonth + firstDay - 1 + 7 - lastDay,
      weeksCount = daysForDrawMonth / 7,
      day = 1;
   for (var i = 1; i <= weeksCount; i++) {
      weeksDays = [];
      weeks.push(weeksDays);
      for (var j = 1; j <= 7; j++) {
         weeksDays.push({
            index: day,
            lastOfWeek: j === 7,
            lastOfMonth: day === daysInMonth + firstDay - 1,
            date: day < firstDay || day >= daysInMonth + firstDay ? '' : [((day - firstDay + 1 < 10 ? '0' : '') + (day - firstDay + 1)), month, year].join('.')
         });
         day++;
      }
   }
   return weeks;
}

app.controller('incomingCtrl', ['$scope', function($scope) {
   $scope.weeks = prepareMonthWeeks('2016', '10');
   $scope.weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];   

   $scope.beginDataDisabled = true;

   $scope.datepicker = {
      opened: false,
      model: moment().format('YYYY-MM'),
      options: {
       datepickerMode: "month",
       showWeeks: false,
       minMode: 'month'
      },
      topggleOpened: function() {
         this.opened = !this.opened;
      },
      onChange: function() {
         $scope.weeks = prepareMonthWeeks(moment(this.model).format('YYYY'), moment(this.model).format('MM'));
      }
   };

   $scope.updateMonth = function(nextMonth) {
      var
         currentMoment = moment($scope.datepicker.model);
      currentMoment[nextMonth ? 'add' : 'subtract'](1, 'month');
      $scope.datepicker.model = currentMoment.format('YYYY-MM');
      $scope.weeks = prepareMonthWeeks(currentMoment.format('YYYY'), currentMoment.format('MM'));
   };
}]);

app.controller('periodCtrl', ['$scope', function($scope) {

}]);