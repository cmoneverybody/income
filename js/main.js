var
   activeDate = moment(),
   app = angular.module("incoming", ["firebase", 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ngLocale']);

firebase.initializeApp({
   apiKey: "AIzaSyDnNj1-paI_bjwWlxo3miXw7GREA908Skc",
   authDomain: "income-397c2.firebaseapp.com",
   databaseURL: "https://income-397c2.firebaseio.com",
   storageBucket: "income-397c2.appspot.com",
   messagingSenderId: "775465313185"
});

function prepareMonthWeeks(data, year, month) {
   var
      weeks = [],
      weeksDays,
      daysInMonth = moment([year, month, '01'].join('-')).daysInMonth(),
      firstDay = moment([year, month, '01'].join('-')).weekday() + 1, // 1 - 7
      lastDay = moment([year, month, daysInMonth].join('-')).weekday() + 1, // 1 - 7
      daysForDrawMonth = daysInMonth + firstDay - 1 + 7 - lastDay,
      weeksCount = daysForDrawMonth / 7,
      day = 1,
      realDay,
      dayData;
   for (var i = 1; i <= weeksCount; i++) {
      weeksDays = [];
      weeks.push(weeksDays);
      for (var j = 1; j <= 7; j++) {
         realDay = day < firstDay || day >= daysInMonth + firstDay ? undefined : (day - firstDay + 1 < 10 ? '0' : '') + (day - firstDay + 1);
         if (realDay) {
            dayData = {
               incoming: {
                  alena: data && data[realDay] && data[realDay].incoming ? data[realDay].incoming.alena : null,
                  alexey: data && data[realDay] && data[realDay].incoming ? data[realDay].incoming.alexey : null
               },
               cost: {
                  alena: data && data[realDay] && data[realDay].cost ? data[realDay].cost.alena : null,
                  alexey: data && data[realDay] && data[realDay].cost ? data[realDay].cost.alexey : null
               }
            }
         } else {
            dayData = null;
         }
         weeksDays.push({
            index: day,
            day: realDay,
            lastOfWeek: j === 7,
            lastOfMonth: day === daysInMonth + firstDay - 1,
            data: dayData,
            date: realDay ? [realDay, month, year].join('.') : undefined
         });
         day++;
      }
   }
   return weeks;
}

function prepareEndData(beginData, weeks) {
   var
      result = {
         alena: beginData.alena,
         alexey: beginData.alexey
      };
   weeks.forEach(function(weekDays) {
      weekDays.forEach(function(day) {
         if (day.data) {
            if (day.data.incoming) {
               if (day.data.incoming.alena) {
                  result.alena += day.data.incoming.alena;
               }
               if (day.data.incoming.alexey) {
                  result.alexey += day.data.incoming.alexey;
               }
            }
            if (day.data.cost) {
               if (day.data.cost.alena) {
                  result.alena -= day.data.cost.alena;
               }
               if (day.data.cost.alexey) {
                  result.alexey -= day.data.cost.alexey;
               }
            }
         }
      });
   });
   return result;
}

function readData(path) {
   return new Promise(function(resolve) {
      resolve(firebase.database().ref(path).once('value', function(data) {
         resolve(data);
      }));
   });
}

function getUserData(user) {
   return new Promise(function(resolve) {
      readData(activeDate.format('MMYYYY') + '/data/begin/' + user).then(function(result) {
         if (result.exists()) {
            resolve(result.val());
         } else {
            readData(moment(activeDate).subtract('1', 'month').format('MMYYYY') + '/data/end/' + user).then(function(result) {
               resolve(result.exists() ? result.val() : undefined);
            });
         }
      });
   });
}

function getElementIndexByClassName(curNodeClass, element) {
   var
      result = 0,
      curNodes = document.getElementsByClassName(curNodeClass);
   while (curNodes[result] && curNodes[result] !== element) {
      result++;
   }
   return result;
}

function focusNextTarget(target) {
   var
      curIndex, nextIndex, nextNodes, curNodeClass, nextNodeClass;
   curNodeClass = target.classList[1];
   curIndex = getElementIndexByClassName(curNodeClass, target);
   if (curNodeClass === 'incoming-calendar-cost-alena') {
      nextNodeClass = 'incoming-calendar-incoming-alena';
      nextIndex = curIndex + 1;
   } else if (curNodeClass === 'incoming-calendar-incoming-alena') {
      nextNodeClass = 'incoming-calendar-cost-alena';
      nextIndex = curIndex;
   } else if (curNodeClass === 'incoming-calendar-cost-alexey') {
      nextNodeClass = 'incoming-calendar-incoming-alexey';
      nextIndex = curIndex + 1;
   } else {
      nextNodeClass = 'incoming-calendar-cost-alexey';
      nextIndex = curIndex;
   }
   nextNodes = document.getElementsByClassName(nextNodeClass);
   if (nextNodes[nextIndex]) {
      nextNodes[nextIndex].focus();
   } else {
      nextNodes[0].focus();
   }
}

app.controller('incomingCtrl', ['$scope', function($scope) {
   var
      monthCalendarRef;

   $scope.weekDays = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
   $scope.beginDataDisabled = true;
   $scope.beginData = {
      alena: null,
      alexey: null
   };
   $scope.datepicker = {
      opened: false,
      model: activeDate.format('YYYY-MM'),
      options: {
         datepickerMode: "month",
         showWeeks: false,
         minMode: 'month'
      },
      topggleOpened: function() {
         this.opened = !this.opened;
      },
      onChange: function() {
         activeDate = moment(this.model);
         applyMonth();
      }
   };

   function updateUserData() {
      return getUserData('alena').then(function(val) {
         $scope.beginData.alena = val !== undefined ? val : 0;
         return getUserData('alexey')
      }).then(function(val) {
         $scope.beginData.alexey = val !== undefined ? val : 0;
      });
   }

   function monthCalendarValueChanged(data) {
      $scope.weeks = prepareMonthWeeks(data.val(), activeDate.format('YYYY'), activeDate.format('MM'));
      if (!$scope.endData) {
         $scope.endData = prepareEndData($scope.beginData, $scope.weeks);
      } else {
         $scope.endData = prepareEndData($scope.beginData, $scope.weeks);
         firebase.database().ref(activeDate.format('MMYYYY') + '/data/end').set($scope.endData);
      }
      if (!$scope.$$phase) {
         $scope.$apply();
      }
   }

   function applyMonth() {
      $scope.weeks = [];
      if (!$scope.$$phase) {
         $scope.$apply();
      }
      $scope.endData = undefined;
      return updateUserData().then(function() {
         if (monthCalendarRef) {
            monthCalendarRef.off('value');
         }
         monthCalendarRef = firebase.database().ref(activeDate.format('MMYYYY') + '/calendar');
         monthCalendarRef.on('value', monthCalendarValueChanged);
         if (!$scope.$$phase) {
            $scope.$apply();
         }
      });
   }

   $scope.onCalendarInputBlur = function(event, path, lastValue) {
      var
         changes = {},
         value = parseFloat(event.target.value, 2);
      if ((lastValue || !isNaN(value) && typeof value === 'number') && lastValue !== value) {
         changes[path] = !isNaN(value) && typeof value === 'number' ? value : null;
         monthCalendarRef.update(changes);
      }
   };

   $scope.onCalendarInputKeyPress = function(event) {
      if (event.keyCode === 13) {
         focusNextTarget(event.target);
      }
   };

   $scope.beginDataInputBlur = function(event, path, user, lastValue) {
      var
         changes = {},
         value = parseFloat(event.target.value, 2);
      if ((lastValue || !isNaN(value) && typeof value === 'number') && lastValue !== value) {
         $scope.beginData[user] = !isNaN(value) && typeof value === 'number' ? value : null;
         changes[path + user] = $scope.beginData[user];
         $scope.endData = prepareEndData($scope.beginData, $scope.weeks);
         if (!$scope.$$phase) {
            $scope.$apply();
         }
         firebase.database().ref(activeDate.format('MMYYYY')).update(changes);
      }
   };

   applyMonth();

   $scope.updateMonth = function(nextMonth) {
      activeDate = moment($scope.datepicker.model);
      activeDate[nextMonth ? 'add' : 'subtract'](1, 'month');
      $scope.datepicker.model = activeDate.format('YYYY-MM');
      applyMonth();
   };
}]);

app.controller('periodCtrl', ['$scope', function($scope) {

}]);