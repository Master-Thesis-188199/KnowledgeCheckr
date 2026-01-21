export default {
  Home: {
    description: 'Create your own KnowledgeChecks to boost your knowledge to the next level. (de)',
  },

  Checks: {
    title: 'Deine Wissenschecks',
    no_existing_checks: 'Keine Wissenschecks gefunden. Erstelle einen',
    no_existing_checks_action_button: 'hier',
  },

  Examination: {
    attempt_not_possible: {
      title: 'Wissensüberprüfungs nicht möglich',
      checkClosed: 'Leider wurde die Prüfung am {closeDate} geschlossen, sodass Sie nach diesem Tag keine Prüfungen mehr starten können.',
      notOpenYet: 'Leider ist die Prüfung noch nicht für Prüfungen geöffnet. Bitte warten Sie bis zum {openDate}, um mit der Prüfung zu beginnen',
      unavailable: 'Der Wissenscheck, auf den Sie zugreifen wollten, ist derzeit für Benutzer nicht verfügbar.',
    },
  },
} as const
