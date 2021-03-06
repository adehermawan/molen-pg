// (C) Copyright 2015 Martin Dougiamas
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

angular.module('mm.addons.mod_quiz', ['mm.core'])

.constant('mmaModQuizCheckChangesInterval', 5000)
.constant('mmaModQuizAttemptComponent', 'mmaModQuizAttempt')
.constant('mmaModQuizAttemptFinishedEvent', 'mma_mod_quiz_attempt_finished')

.config(function($stateProvider) {

    $stateProvider

    .state('site.mod_quiz', {
      url: '/mod_quiz',
      params: {
        module: null,
        courseid: null
      },
      views: {
        'site': {
          controller: 'mmaModQuizIndexCtrl',
          templateUrl: 'addons/mod_quiz/templates/index.html'
        }
      }
    })

    .state('site.mod_quiz-attempt', {
      url: '/mod_quiz-attempt',
      params: {
        courseid: null,
        quizid: null,
        attemptid: null
      },
      views: {
        'site': {
          controller: 'mmaModQuizAttemptCtrl',
          templateUrl: 'addons/mod_quiz/templates/attempt.html'
        }
      }
    })

    .state('site.mod_quiz-player', {
      url: '/mod_quiz-player',
      params: {
        courseid: null,
        quizid: null,
        moduleurl: null // Module URL to open it in browser.
      },
      views: {
        'site': {
          controller: 'mmaModQuizPlayerCtrl',
          templateUrl: 'addons/mod_quiz/templates/player.html'
        }
      }
    })

    .state('site.mod_quiz-review', {
      url: '/mod_quiz-review',
      params: {
        courseid: null,
        quizid: null,
        attemptid: null,
        page: -1
      },
      views: {
        'site': {
          controller: 'mmaModQuizReviewCtrl',
          templateUrl: 'addons/mod_quiz/templates/review.html'
        }
      }
    });

})

.config(function($mmCourseDelegateProvider, $mmContentLinksDelegateProvider) {
    $mmCourseDelegateProvider.registerContentHandler('mmaModQuiz', 'quiz', '$mmaModQuizHandlers.courseContentHandler');
    $mmContentLinksDelegateProvider.registerLinkHandler('mmaModQuiz', '$mmaModQuizHandlers.linksHandler');
});
