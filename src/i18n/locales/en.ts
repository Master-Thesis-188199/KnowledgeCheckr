//! Auto generated file, changes to this file will get replaced on next update
export default {
  Shared: {
    navigation_button_next: 'Next',
    navigation_button_previous: 'Previous'
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
      MultiStages: {
        'basic-information': 'Basic Information',
        questions: 'Questions',
        settings: 'Settings',
        conclusion: 'Conclusion'
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
