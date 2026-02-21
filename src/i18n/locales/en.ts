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
      'points#one': '{count} point',
      'points#zero': '{count} points',
      'points#other': '{count} points',
      points: '{count} points',
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
      minute: '{count} minutes',
      'minute_label#one': 'minute',
      'minute_label#zero': 'minutes',
      'minute_label#other': 'minutes',
      minute_label: 'minutes'
    },
    jump_back_button_label: 'Jump back'
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
          title: 'Practice Settings',
          enablePracticing_label: 'Allow users to Practice',
          allowedPracticeCount_label: 'Allowed Practice Attempt',
          allowedPracticeCount_placeholder: 'Unlimited'
        },
        ExaminationSettings: {
          title: 'Examination Settings',
          enableExaminations_label: 'Enable Examination Attempts',
          allowAnonymous_label: 'Allow Anonymous Users',
          questionOrder_label: 'Randomize Question Order',
          answerOrder_label: 'Randomize Answer Order',
          examTimeFrameSeconds_label: 'Examination Time Frame',
          examinationAttemptCount_label: 'Examination Attempt Count',
          startDate_label: 'Start Date',
          endDate_label: 'End Date'
        },
        ShareSettings: {
          title: 'Share Settings',
          shareAccessibility: 'Publicly Discoverable'
        }
      },
      OverviewSection: {
        title: 'Preview Changes',
        description: 'Here is a brief overview of what changes were made'
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
      },
      UnsavedChangesAlert: {
        title: 'You have unsaved changes. Discard?',
        description: 'By leaving the page now the change you have made will be permanently lost.',
        dismissLabel: 'Continue Editing',
        continueLabel: 'Proceed without saving'
      }
    },
    Discover: {
      title: 'Explore new Checks',
      no_checks_found_base: 'No checks found. Create your own KnowledgeCheck',
      no_checks_found_link: 'here',
      FilterFields: {
        filter_operand_menu_label: 'Filter Operands',
        create_check_button_label: 'Create your own Check',
        filter_input_placeholder: 'Filter by name',
        tooltips: {
          filter_case_sensitive: 'Filter is case-sensitive',
          filter_case_ignored: 'Filter is ignored word casing'
        },
        operands: {
          contains_filter_operand: 'contains',
          startsWith_filter_operand: 'startsWith',
          endsWith_filter_operand: 'endsWith',
          eq_filter_operand: 'Equals'
        }
      }
    },
    ExaminatonResults: {
      title: 'Examination Results',
      description: 'Look at the examination attempts of users.',
      ExaminationAttemptTable: {
        columns: {
          username_header: 'Username',
          status_header: 'Status',
          duration_header: 'Duration',
          user_type_header: 'User Type',
          score_header: 'Score',
          totalScore_header: 'Max Score',
          preview_action_cell: 'Preview',
          actions_menu: {
            sr_only_trigger: 'Open menu',
            show_results_label: 'Show Results',
            delete_attempt_label: 'Delete Attempt'
          }
        },
        title: 'Examination Attempts',
        description: 'Shows a detailed list of all examination attempts for this check',
        status_done: 'Done',
        status_in_progress: 'in-progress',
        user_type_normal: 'normal',
        user_type_anonynmous: 'anonymous',
        Drawer: {
          title: 'Examination Attempt - {username}',
          description: "Showing basics about {username}'s examination attempt.",
          username_label: 'Username',
          user_score_label: 'User Score',
          start_time_label: 'Start Time',
          duration_label: 'Duration',
          end_time_label: 'End Time',
          close_button_label: 'Close',
          submit_button_label: 'Save Changes'
        }
      },
      ExaminationQuestionTable: {
        columns: {
          question_accessorKey: 'Question',
          category_accessorKey: 'Category',
          answer_status_accessorKey: 'Answer Status',
          type_accessorKey: 'Type',
          score_accessorKey: 'Score',
          points_accessorKey: 'Points',
          grade_accessorKey: 'Grade',
          answer_status_cell_answered: 'Answered',
          answer_status_cell_unanswered: 'not Answered',
          preview_action_cell: 'Show Answers'
        },
        ActionMenu: {
          sr_only_trigger: 'Open Menu',
          show_answers_label: 'Show Answers',
          delete_answer_label: 'Delete Answer'
        }
      },
      ShowAnswerDrawer_TableCell: {
        title: 'Preview User Question Answer',
        description: 'Shows details about a given question and its results.',
        score_slider_label: 'Question Score',
        grade_label: 'Grade',
        answers_array_label: 'Answers',
        answer_open_question_label: 'Answer',
        drawer_close_button_label: 'Close',
        drawer_submit_button_label: 'Save Changes'
      },
      Charts: {
        UserTypePieChart: {
          title: 'Examinations by User types',
          description: 'Shows examination attempts by user type',
          user_type_normal: 'Normal',
          user_type_anonynmous: 'Anonymous',
          inner_label: 'Users'
        },
        ExamQuestionDurationChart: {
          title: 'Average Question time difference',
          description: 'Shows the variance in actual and estimated answer-time',
          x_axis_label: 'Questions',
          y_axis_label: 'Time spent',
          tooltip: {
            title: 'Question {count}',
            estimated_time_label: 'Estimated Time',
            actual_time_label: 'Time needed',
            total_faster_label: 'Faster by',
            total_slower_label: 'Slower by'
          }
        },
        ExaminationSuccessPieChart: {
          title: 'Examinations Success Rate',
          description: 'Shows how many users have passed / failed.',
          'inner_label#one': 'Attempt',
          'inner_label#other': 'Attempts',
          inner_label: 'Attempts',
          passed_label: 'Passed',
          failed_label: 'Failed'
        },
        QuestionScoresLineChartCard: {
          title: 'Average question score by question',
          description: 'Shows the variance between average question score and max-score by question',
          x_axis_label: 'Questions',
          score_label: 'Score',
          maxScore_label: 'max Score'
        }
      },
      ExamAttemptResultPage: {
        title: 'Examination Attempt Results',
        description: 'Shows all the details of the respective examination attempt of {name}'
      }
    }
  },
  Examination: {
    attempt_not_possible: {
      title: 'Examination not possible',
      checkClosed: 'Unfortunately the check was closed on {closeDate}, thus you are no longer able to start examinations beyond that day.',
      notOpenYet: 'Unfortunately the check is not yet open for examinations, please wait until {openDate} to start an examination',
      unavailable: 'The check you tried to access is currently not available to users.',
      'anonymous-users-not-allowed': 'Anonymous users are not allowed in this check, please sign-in / login with a different account'
    }
  },
  Practice: {
    practicing_not_allowed: {
      title: 'Practicing not allowed',
      disabled: 'Practicing is disabled for this check, try again later or contact the owner of this check to enable practicing.',
      toManyAttempts: 'You have unfortunately reached the allowed practice attempt count of {allowedAttemptCount} for this check.'
    }
  },
  Components: {
    KnowledgeCheckCard: {
      last_modified_label: 'last modified',
      Statistics: {
        questions_label: 'Questions',
        estimatedTime_label: 'estimatedTime',
        points_label: 'Points'
      },
      user_role: {
        is_Owner_role: 'Owner',
        is_Collaborator_role: 'Collaborator',
        is_Guest_role: 'Guest'
      }
    },
    ShareKnowledgeCheckButton: {
      tooltip_message: 'Share this KnowledgeCheck',
      tooltip_empty_message: 'This check has no questions, cannot be shared at this moment.',
      successfully_copied_toast_message: 'Successfully saved token to your clipboard.',
      failed_copy_toast_message: 'Failed to copy share link to the clipboard.'
    },
    KnowledgeCheckCardMenu: {
      menu_label: 'Actions',
      invite_to_submenu_label: 'Invite users to',
      copy_practice: {
        label: 'Copy Practice Link',
        toast_success: 'Successfully saved practice url to clipboard.',
        toast_failure: 'Failed to copy practice link to clipboard.'
      },
      start_practice: {
        label: 'Start Practicing',
        tooltip: 'This check has no questions, practice disabled.',
        toast: 'Unable to start Practice'
      },
      copy_examination: {
        label: 'Copy Examination Link',
        toast_success: 'Successfully saved exam url to clipboard.',
        toast_failure: 'Failed to copy exam link to clipboard.'
      },
      start_examination: {
        label: 'Start Examination',
        tooltip: 'This check has no questions, examination disabled.',
        toast: 'Unable to start Practice'
      },
      edit_check: {
        label: 'Edit KnowledgeCheck',
        tooltip: 'You are not allowed to edit this check!'
      },
      clone_check: {
        label: 'Clone KnowledgeCheck'
      },
      inspect_statistics: {
        label: 'Inspect Statistics'
      },
      remove_share_token: {
        tooltip: 'There is no share token associated to this check!',
        confirmation_dialog_body: 'This action cannot be undone. This will permanently delete the share-token from this KnowledgeCheck.',
        toast_deletion_successful: 'Successfully deleted share token',
        toast_deletion_failure: 'Removing share token was unsuccessful!'
      },
      delete_knowledgeCheck: {
        label: 'Delete KnowledgeCheck',
        confirmation_dialog_body: 'This action cannot be undone. This will permanently delete this KnowledCheck from your account and remove its data from our servers.',
        toast_deletion_successful: 'Successfully deleted knowledgeCheck',
        toast_deletion_failure: 'Removing knowledgeCheck was unsuccessful!'
      },
      Shared: {
        tooltip_not_allowed: 'You are not allowed to perform this action!',
        toast_deletion_not_found: 'Deletion was unsuccesful, check not found!'
      }
    },
    ConfirmationDialog: {
      default_title: 'Are you absolutely sure?',
      default_body: 'This action cannot be undone. This will permanently delete this element from your account and remove its data from our servers.',
      default_cancel_label: 'Cancel',
      default_confirm_label: 'Continue'
    },
    DataTable: {
      page_size_label: 'Rows per page',
      customize_columns_label_long: 'Customize Columns',
      customize_columns_label_short: 'Columns',
      no_results_label: 'No results.',
      Pagination: {
        selection_label: '{selected} of {total} rows selected.',
        current_page_label: 'Page {page} of {total}',
        sr_only: {
          go_first_page: 'Go to first page',
          go_next_page: 'Go to next page',
          go_previous_page: 'Go to previous page',
          go_last_page: 'Go to last page'
        }
      },
      Sorting: {
        ascending_order_title: 'Sorting rows in ascending order',
        ascending_order_label: 'Sort ascending',
        descending_order_title: 'Sorting rows in descending order',
        descending_order_label: 'Sort descending',
        reset_sorting_label: 'Reset Sorting',
        reset_sorting_disabled_tooltip: 'This column is currently not being sorted.',
        dropdown_sr_only_trigger_label: 'Open sort menu',
        column_sort_button_aria_label: 'Sort by {columnId}'
      }
    }
  }
} as const
