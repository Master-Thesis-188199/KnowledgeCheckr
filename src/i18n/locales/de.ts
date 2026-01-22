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
  Practice: {
    practicing_not_allowed: {
      disabled: 'Das Üben dieses KnowledgeChecks ist deaktiviert. Versuchen Sie es später erneut oder wenden Sie sich an den Besitzer des KnowledgeChecks, um das Üben zu aktivieren.',
      title: 'Üben nicht erlaubt',
      toManyAttempts: 'Leider haben Sie für diese Prüfung die zulässige Anzahl an Übungsversuchen von {allowedAttemptCount} erreicht.',
    },
  },
} as const
