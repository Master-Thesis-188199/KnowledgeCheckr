export default {
  Home: {
    description: 'Create your own KnowledgeChecks to boost your knowledge to the next level. (en)',
  },
  Checks: {
    title: 'Your Checks',
    no_existing_checks: 'No checks found. Create a new one',
    no_existing_checks_action_button: 'here',
  },
  Examination: {
    attempt_not_possible: {
      title: 'Examination not possible',
      checkClosed: 'Unfortunately the check was closed on {closeDate}, thus you are no longer able to start examinations beyond that day.',
      notOpenYet: 'Unfortunately the check is not yet open for examinations, please wait until {openDate} to start an examination',
      unavailable: 'The check you tried to access is currently not available to users.',
    },
  },
} as const
