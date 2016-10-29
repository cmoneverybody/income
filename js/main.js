var app = angular.module("incoming", ["firebase"]);
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

var oneConvertedDay = moment('2016-10-11').toDate().getTime();

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
            date: day < firstDay || day >= daysInMonth + firstDay ? '' : ((day - firstDay + 1 < 10 ? '0' : '') + (day - firstDay + 1))
         });
         day++;
      }
      /*dates.push({
         index: i,
         date: i < firstDay || i >= daysInMonth + firstDay ? '' : ((i - firstDay + 1 < 10 ? '0' : '') + (i - firstDay + 1))
      });*/
   }
   return weeks;
}

app.controller('incomingCtrl', ['$scope', function($scope) {
   $scope.weeks = prepareMonthWeeks('2016', '10');
   $scope.selectedMonth = moment().format('MMMM');
   $scope.selectedYear = moment().format('YYYY');
   $scope.months = [ 'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь' ];
   $scope.years = [ '2015', '2016', '2017' ];
}]);

app.controller('periodCtrl', ['$scope', function($scope) {

}]);