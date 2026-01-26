//! Auto generated file, changes to this file will get replaced on next update
export default {
  Shared: {
    navigation_button_next: 'Next',
    navigation_button_previous: 'Previous',
    Question: {
      question_label: 'Question',
      type_label: 'Question Type',
      type: {
        'multiple-choice': 'Multiple-Choice',
        'single-choice': 'Single-Choice',
        'open-question': 'Open-Question',
        'drag-drop': 'Drag-Drop'
      },
      points_label: 'Points',
      accessibility_label: 'Accessibility',
      accessibility: {
        all: 'Universal',
        'practice-only': 'Practice Question',
        'exam-only': 'Exam Question'
      },
      category_label: 'Category',
      answers_label: 'Answers'
    },
    Timestamp: {
      'hour#one': '{count} hour',
      'hour#other': '{count} hours',
      'minute#one': '{count} minute',
      'minute#other': '{count} minutes',
      join_word: 'and',
      hour: '{count} hours',
      minute: '{count} minutes'
    }
  },
  Home: {
    description: 'Create your own KnowledgeChecks to boost your knowledge to the next level. (en)'
  },
  Checks: {
    title: 'Your Checks',
    no_existing_checks: 'No checks found. Create a new one',
    no_existing_checks_action_button: 'here',
    Create: {
      GeneralSection: {
        title: 'General Section',
        name_label: 'Name',
        name_placeholder: 'Science Fiction Check',
        description_label: 'Description',
        description_placeholder: 'Learn about science fiction',
        difficulty_label: 'Difficulty',
        openDate_label: 'Start Date',
        closeDate_label: 'Deadline',
        collaborators_label: 'Collaborators',
        CollaboratorSelection: {
          collaborators_placeholder: 'Add Collaborator(s)',
          command_input_placeholder: 'Search users...',
          command_loading_message: 'Loading more users',
          command_empty_no_users: 'No matching users found.',
          command_empty_min_input: 'You must provide at least 3 characters to find matches'
        }
      },
      QuestionSection: {
        title: 'Questions',
        create_button: 'Create Question',
        no_questions_info: 'Currently there are no questions associated to this quiz',
        QuestionCard: {
          'points#one': '{count} point',
          'points#other': '{count} points',
          points: '{count} points'
        }
      },
      SettingSection: {
        title: 'Settings',
        tabs: {
          sr_only_label: 'Select a tab',
          general: 'General',
          practice: 'Practice',
          examination: 'Examination',
          sharing: 'Sharing'
        },
        PracticeSettings: {
          enablePracticing_label: 'Allow users to Practice',
          allowedPracticeCount_label: 'Allowed Practice Attempt',
          allowedPracticeCount_placeholder: 'Unlimited'
        },
        ExaminationSettings: {
          enableExaminations_label: 'Enable Examination Attempts',
          questionOrder_label: 'Randomize Question Order',
          answerOrder_label: 'Randomize Answer Order',
          examTimeFrameSeconds_label: 'Examination Time Frame',
          examinationAttemptCount_label: 'Examination Attempt Count',
          startDate_label: 'Start Date',
          endDate_label: 'End Date'
        }
      },
      OverviewSection: {
        title: 'Preview Changes',
        description: ''
      },
      MultiStages: {
        'basic-information': 'Basic Information',
        questions: 'Questions',
        settings: 'Settings',
        conclusion: 'Conclusion'
      },
      CreateQuestionDialog: {
        Header: {
          title_create: 'Create Question',
          description_create: 'Create your new question for your KnowledgeCheck',
          title_edit: 'Edit Question',
          description_edit: 'Edit your existing question of your KnowledgeCheck'
        },
        placeholders: {
          question: 'Formulate your question here',
          choice_answer_option: 'Answer {position} - to your question',
          open_question_expectation: 'What answer are you expecting'
        },
        tooltips: {
          choice_question_marked_correct: 'Answer marked as correct',
          choice_question_marked_incorrect: 'Answer marked as wrong',
          drag_drop_correct_position: 'The correct position for this answer'
        },
        buttons: {
          cancel_button_label: 'Cancel',
          add_submit_button_label: 'Add Question',
          update_submit_button_label: 'Update Question',
          add_answer_label: 'Add Answer'
        }
      }
    }
  },
  Examination: {
    attempt_not_possible: {
      title: 'Examination not possible',
      checkClosed: 'Unfortunately the check was closed on {closeDate}, thus you are no longer able to start examinations beyond that day.',
      notOpenYet: 'Unfortunately the check is not yet open for examinations, please wait until {openDate} to start an examination',
      unavailable: 'The check you tried to access is currently not available to users.'
    }
  },
  Practice: {
    practicing_not_allowed: {
      title: 'Practicing not allowed',
      disabled: 'Practicing is disabled for this check, try again later or contact the owner of this check to enable practicing.',
      toManyAttempts: 'You have unfortunately reached the allowed practice attempt count of {allowedAttemptCount} for this check.'
    }
  }
} as const
