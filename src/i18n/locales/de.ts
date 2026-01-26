//! Auto generated file, changes to this file will get replaced on next update
export default {
  Shared: {
    navigation_button_next: 'Weiter',
    navigation_button_previous: 'Zurück',
    Question: {
      question_label: 'Frage',
      type_label: 'Art der Frage',
      type: {
        'multiple-choice': 'Mehrfach-auswahl',
        'single-choice': 'Einzel-auswahl',
        'open-question': 'Offene-Frage',
        'drag-drop': 'Drag-Drop'
      },
      points_label: 'Punkte',
      accessibility_label: 'Zugehörigkeit',
      accessibility: {
        all: 'Universal',
        'practice-only': 'Übungs Frage',
        'exam-only': 'Prüfungs Frage'
      },
      category_label: 'Kategorie',
      answers_label: 'Antworten'
    }
  },
  Home: {
    description: 'Create your own KnowledgeChecks to boost your knowledge to the next level. (de)'
  },
  Checks: {
    title: 'Deine Wissenschecks',
    no_existing_checks: 'Keine Wissenschecks gefunden. Erstelle einen',
    no_existing_checks_action_button: 'hier',
    Create: {
      GeneralSection: {
        title: 'Allgemein',
        name_label: 'Name',
        name_placeholder: 'Österreich Wissenscheck',
        description_label: 'Beschreibung',
        description_placeholder: 'Erfahren Sie mehr über Österreich',
        difficulty_label: 'Schwierigkeit',
        openDate_label: 'Startdatum',
        closeDate_label: 'Frist',
        collaborators_label: 'Co-Authoren',
        CollaboratorSelection: {
          collaborators_placeholder: 'Author hinzufügen',
          command_input_placeholder: 'Benutzer suchen...',
          command_loading_message: 'Benutzer werden geladen',
          command_empty_no_users: 'Keine Benutzer gefunden.',
          command_empty_min_input: 'Sie müssen mindestens 3 Zeichen angeben, um Übereinstimmungen zu finden'
        }
      },
      QuestionSection: {
        title: 'Fragen',
        create_button: 'Frage hinzufügen',
        no_questions_info: 'Derzeit sind diesem Quiz keine Fragen zugeordnet',
        QuestionCard: {
          'points#one': '{count} punkt',
          'points#other': '{count} punkte',
          points: '{count} punkte'
        }
      },
      MultiStages: {
        'basic-information': 'Allgemein',
        questions: 'Fragen',
        settings: 'Einstellungen',
        conclusion: 'Zusammenfassung'
      },
      CreateQuestionDialog: {
        Header: {
          title_create: 'Frage erstellen',
          description_create: 'Erstellen Sie eine neue Frage für diesen KnowledgeCheck',
          title_edit: 'Frage bearbeiten',
          description_edit: 'Bearbeiten Sie Ihre bestehende Frage Ihres KnowledgeChecks'
        },
        placeholders: {
          question: 'Formuliere deine Frage hier',
          choice_answer_option: 'Antwort {position} - dieser Frage',
          open_question_expectation: 'Welche Antwort erwarten Sie von dieser Frage'
        },
        tooltips: {
          choice_question_marked_correct: 'Anwort als richtig markiert',
          choice_question_marked_incorrect: 'Antwort als falsch markiert',
          drag_drop_correct_position: 'Die richtige position dieser Antwort'
        },
        buttons: {
          cancel_button_label: 'Abbrechen',
          add_submit_button_label: 'Frage erstellen',
          update_submit_button_label: 'Frage aktualisieren',
          add_answer_label: 'Weitere Antwort'
        }
      }
    }
  },
  Examination: {
    attempt_not_possible: {
      title: 'Wissensüberprüfungs nicht möglich',
      checkClosed: 'Leider wurde die Prüfung am {closeDate} geschlossen, sodass Sie nach diesem Tag keine Prüfungen mehr starten können.',
      notOpenYet: 'Leider ist die Prüfung noch nicht für Prüfungen geöffnet. Bitte warten Sie bis zum {openDate}, um mit der Prüfung zu beginnen',
      unavailable: 'Der Wissenscheck, auf den Sie zugreifen wollten, ist derzeit für Benutzer nicht verfügbar.'
    }
  },
  Practice: {
    practicing_not_allowed: {
      disabled: 'Das Üben dieses KnowledgeChecks ist deaktiviert. Versuchen Sie es später erneut oder wenden Sie sich an den Besitzer des KnowledgeChecks, um das Üben zu aktivieren.',
      title: 'Üben nicht erlaubt',
      toManyAttempts: 'Leider haben Sie für diese Prüfung die zulässige Anzahl an Übungsversuchen von {allowedAttemptCount} erreicht.'
    }
  }
} as const
