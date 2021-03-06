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

angular.module('mm.core.question')

/**
 * Directive to render a question.
 * It will search for the right directive to render the question based on the question type.
 * See {@link $mmQuestionDelegate}.
 *
 * @module mm.core.question
 * @ngdoc directive
 * @name mmQuestion
 * @description
 *
 * The directives to render the question will receive the following parameters in the scope:
 *
 * @param {Object} question      The question to render.
 * @param {Boolean} review       True if reviewing an attempt.
 * @param {String} component     The component to link files to if the question has any.
 * @param {Number} [componentId] An ID to use in conjunction with the component.
 * @param {Function} abort       A function to call to abort the execution.
 *                               Directives implementing questions should use it if there's a critical error.
 *                               Addons using this directive should provide a function that allows aborting the execution
 *                               of the addon, so if any question calls it the whole feature is aborted.
 */
.directive('mmQuestion', function($log, $compile, $mmQuestionDelegate, $mmQuestionHelper) {
    $log = $log.getInstance('mmQuestion');

    return {
        restrict: 'E',
        templateUrl: 'core/components/question/templates/question.html',
        scope: {
            question: '=',
            review: '=?',
            component: '=?',
            componentId: '=?',
            abort: '&'
        },
        link: function(scope, element) {
            var question = scope.question,
                questionContainer = element[0].querySelector('#mm-question-container');

            if (question && questionContainer) {
                // Search the right directive to render the question.
                var directive = $mmQuestionDelegate.getDirectiveForQuestion(question);
                if (directive) {
                    // Treat the question before starting the directive.
                    $mmQuestionHelper.extractQuestionScripts(question);

                    // Extract the validation error of the question.
                    question.validationError = $mmQuestionHelper.getValidationErrorFromHtml(question.html);

                    // Get the sequence check (hidden input). This is required.
                    scope.seqCheck = $mmQuestionHelper.getQuestionSequenceCheckFromHtml(question.html);
                    if (!scope.seqCheck) {
                        $log.warn('Aborting question because couldn\'t retrieve sequence check.', question.name);
                        scope.abort();
                        return;
                    }

                    if (scope.review) {
                        // If we're in review mode, try to extract the feedback and comment for the question.
                        $mmQuestionHelper.extractQuestionFeedback(question);
                        $mmQuestionHelper.extractQuestionComment(question);
                    }

                    // Add the directive to the element.
                    questionContainer.setAttribute(directive, '');
                    // Compile the new directive.
                    $compile(questionContainer)(scope);
                }
            }
        }
    };
});
