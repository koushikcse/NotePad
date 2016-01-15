var notePadApp = angular.module("note-pad-app", []);

notePadApp.controller("NotePadController", ['$scope', '$http', function($scope, $http) {

    var _this = this;

    $http.get('/notes').then(function(response) {
        _this.notes = response.data;
    }, function(error) {
        console.log(error);
    });

    this.showNote = false;
    this.noteTitle = "";
    this.noteBody = "";

    this.addNote = function() {
        if (!this.noteTitle || !this.noteBody) return;

        var note = {
            name: this.noteTitle,
            text: this.noteBody,
            date: (new Date()).toISOString()
        };

        $http.post('/notes', note).then(
            function(response) {
                _this.notes.push(response.data);
                _this.clearNote();
            },
            function(error) {
                console.log(error);
            }
        );
    };

    this.clearNote = function() {
        this.showNote = false;
        this.noteTitle = "";
        this.noteBody = "";
    };

    this.delNote = function(noteId) {

        $http({
            url: '/notes',
            method: 'DELETE',
            data: this.notes[noteId],
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            }
        }).then(function(response) {
            _this.notes.map(function(elem, index, array) {
                if (index === noteId) {
                    array.splice(index, 1);
                }
            });
        }, function(error) {
            console.log(error);
        });
    };

    this.update = function(noteId) {
        $http.put('/notes', this.notes[noteId]).then(function(response) {
            console.log(response);
        }, function(error) {
            console.log(error);
        });
    };

}]);

notePadApp.directive("addNote", function() {
    return {
        restrict: 'E',
        templateUrl: './partial/addNote.html'
    };
});

notePadApp.directive("allNotes", function() {
    return {
        restrict: 'E',
        templateUrl: './partial/allNotes.html'
    };
});

notePadApp.directive("contenteditable", function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            function read() {
                ngModel.$setViewValue(element.html());
            }

            ngModel.$render = function() {
                element.html(ngModel.$viewValue || "");
            };

            element.bind("blur keyup change", function() {
                scope.$apply(read);
            });
        }
    };
});

notePadApp.filter('reverse', function() {
    return function(items) {
        if (!items) return [];
        return items.slice().reverse();
    };
});
