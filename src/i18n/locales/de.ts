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
    },
    Timestamp: {
      'hour#one': '{count} stunde',
      'hour#other': '{count} stunden',
      'minute#one': '{count} minute',
      'minute#other': '{count} minuten',
      join_word: 'und',
      hour: '{count} stunden',
      minute: '{count} minuten',
      'minute_label#one': 'minute',
      'minute_label#zero': 'minuten',
      'minute_label#other': 'minuten',
      minute_label: 'minuten'
    },
    jump_back_button_label: 'Bearbeiten'
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
      SettingSection: {
        title: 'Einstellungen',
        tabs: {
          sr_only_label: 'Wähle einen Tab',
          general: 'Allgemein',
          practice: 'Üben',
          examination: 'Prüfung',
          sharing: 'Teilen'
        },
        PracticeSettings: {
          title: 'Übungs Einstellungen',
          enablePracticing_label: 'Erlaube benutzern zu Üben',
          allowedPracticeCount_label: 'Erlaubte Übungsversuche',
          allowedPracticeCount_placeholder: 'Unbeschränkt'
        },
        ExaminationSettings: {
          title: 'Prüfungs Einstellungen',
          enableExaminations_label: 'Erlaube Prüfungsantritte',
          allowAnonymous_label: 'Erlaube Anonyme Benutzer',
          questionOrder_label: 'Zufällige Fragen Reihenfolge',
          answerOrder_label: 'Zufällige Antwort Reihenfolge',
          examTimeFrameSeconds_label: 'Prüfungszeit',
          examinationAttemptCount_label: 'Erlaubte Prüfungsantritte',
          startDate_label: 'Start Datum',
          endDate_label: 'Abschluss Datum'
        },
        ShareSettings: {
          title: 'Freigabe Einstellungen',
          shareAccessibility: 'Öffentlich auffindbar'
        }
      },
      OverviewSection: {
        title: 'Überlick',
        description: 'Kontrolliere deine Änderungen bevor du diese speicherst.'
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
      },
      UnsavedChangesAlert: {
        title: 'Sie haben nicht gespeicherte Änderungen. \nVerwerfen?',
        description: 'Wenn Sie die Seite jetzt verlassen, gehen die von Ihnen vorgenommenen Änderungen endgültig verloren.',
        dismissLabel: 'Bearbeiten fortsetzten',
        continueLabel: 'Ohne Speichern fortfahren'
      }
    },
    Discover: {
      title: 'Entdecken Sie neue Wissenschecks',
      no_checks_found_base: 'Keine Wissensüberprüfungen gefunden. \n' + 'Erstellen Sie Ihren eigenen KnowledgeCheck',
      no_checks_found_link: 'hier',
      FilterFields: {
        filter_operand_menu_label: 'Filter Operatoren',
        create_check_button_label: 'Erstelle deinen eigenen Check',
        filter_input_placeholder: 'nach Namen filtern',
        tooltips: {
          filter_case_sensitive: 'Filter beachtet die Groß-/Kleinschreibung',
          filter_case_ignored: 'Der Filter ignoriert die Groß- und Kleinschreibung'
        },
        operands: {
          contains_filter_operand: 'enthält',
          startsWith_filter_operand: 'beginnt mit',
          endsWith_filter_operand: 'endet mit',
          eq_filter_operand: 'Gleich'
        }
      }
    },
    ExaminatonResults: {
      Charts: {
        ExamQuestionDurationChart: {
          description: 'Zeigt die Abweichung zwischen tatsächlicher und geschätzter Antwortzeit an',
          title: 'Durchschnittlicher Zeitunterschied bei Fragen',
          tooltip: {
            title: 'Frage {count}',
            actual_time_label: 'tatsächliche Zeit',
            estimated_time_label: 'geschätzte Zeit',
            total_faster_label: 'Schneller um',
            total_slower_label: 'Langsamer um'
          },
          x_axis_label: 'Fragen',
          y_axis_label: 'Zeitaufwand'
        },
        ExaminationSuccessPieChart: {
          description: 'Zeigt an, wie viele Benutzer bestanden/fehlgeschlagen sind.',
          title: 'Erfolgsquote der Prüfungen',
          'inner_label#one': 'Antritt',
          'inner_label#other': 'Antritte',
          inner_label: 'Antritte',
          passed_label: 'Positiv',
          failed_label: 'Negativ'
        },
        QuestionScoresLineChartCard: {
          description: 'Zeigt die Varianz zwischen der durchschnittlichen Fragepunktzahl und der Höchstpunktzahl pro Frage an',
          title: 'Durchschnittliche Fragepunktzahl pro Frage',
          x_axis_label: 'Fragen',
          score_label: 'Punkte',
          maxScore_label: 'max Punkte'
        },
        UserTypePieChart: {
          description: 'Zeigt Prüfungsversuche nach Benutzertyp',
          title: 'Prüfungen nach Benutzertypen',
          user_type_normal: 'Normal',
          user_type_anonynmous: 'Anonym',
          inner_label: 'Benutzer'
        }
      },
      ExaminationAttemptTable: {
        description: 'Zeigt eine detaillierte Liste aller Prüfungsversuche für diese Prüfung',
        status_done: 'Erledigt',
        status_in_progress: 'läuft',
        title: 'Prüfungsversuche',
        user_type_anonynmous: 'anonym',
        user_type_normal: 'normal'
      },
      description: 'Schauen Sie sich die Prüfungsversuche der Nutzer an.',
      title: 'Prüfungsergebnisse',
      ExaminationQuestionTable: {
        columns: {
          answer_status_accessorKey: 'Antwortstatus',
          answer_status_cell_answered: 'Beantwortet',
          answer_status_cell_unanswered: 'nicht beantwortet',
          category_accessorKey: 'Kategorie',
          grade_accessorKey: 'Note',
          points_accessorKey: 'Punkte',
          preview_action_cell: 'Antworten anzeigen',
          question_accessorKey: 'Frage',
          score_accessorKey: 'Punktzahl',
          type_accessorKey: 'Typ'
        }
      }
    }
  },
  Examination: {
    attempt_not_possible: {
      title: 'Wissensüberprüfungs nicht möglich',
      checkClosed: 'Leider wurde die Prüfung am {closeDate} geschlossen, sodass Sie nach diesem Tag keine Prüfungen mehr starten können.',
      notOpenYet: 'Leider ist die Prüfung noch nicht für Prüfungen geöffnet. Bitte warten Sie bis zum {openDate}, um mit der Prüfung zu beginnen',
      unavailable: 'Der Wissenscheck, auf den Sie zugreifen wollten, ist derzeit für Benutzer nicht verfügbar.',
      'anonymous-users-not-allowed': 'Anonyme Benutzer sind bei dieser Prüfung nicht zugelassen. Bitte melden Sie sich mit einem anderen Konto an'
    }
  },
  Practice: {
    practicing_not_allowed: {
      disabled: 'Das Üben dieses KnowledgeChecks ist deaktiviert. Versuchen Sie es später erneut oder wenden Sie sich an den Besitzer des KnowledgeChecks, um das Üben zu aktivieren.',
      title: 'Üben nicht erlaubt',
      toManyAttempts: 'Leider haben Sie für diese Prüfung die zulässige Anzahl an Übungsversuchen von {allowedAttemptCount} erreicht.'
    }
  },
  Components: {
    KnowledgeCheckCard: {
      last_modified_label: 'zuletzt geändert',
      Statistics: {
        questions_label: 'Fragen',
        estimatedTime_label: 'geschätze Zeit',
        points_label: 'Punkte'
      },
      user_role: {
        is_Owner_role: 'Besitzer',
        is_Collaborator_role: 'Co-Author',
        is_Guest_role: 'Gast'
      }
    },
    ShareKnowledgeCheckButton: {
      tooltip_message: 'Teile diesen KnowledgeCheck',
      tooltip_empty_message: 'Dieser KnowledgeCheck hat keine Fragen und kann deswegen nicht geteilt werden.',
      successfully_copied_toast_message: 'Freigabelink erfolgreich in Zwischenablage gespeichert',
      failed_copy_toast_message: 'Der Freigabelink konnte nicht in Zwischenablage gespeichert werden.'
    },
    KnowledgeCheckCardMenu: {
      menu_label: 'Aktionen',
      invite_to_submenu_label: 'Teile diesen Check',
      copy_practice: {
        label: 'Kopiere Übungslink',
        toast_success: 'Übungs freigabelink erfolgreich in Zwischenablage kopiert.',
        toast_failure: 'Erstellen des Übungslinks fehlgeschlagen.'
      },
      start_practice: {
        label: 'Beginne zu Üben',
        tooltip: 'Dieser KnowledgeCheck hat keine Fragen, Übung deaktiviert.',
        toast: 'Starten der Übungsumgebung fehlgeschlagen.'
      },
      copy_examination: {
        label: 'Kopiere Prüfungslink',
        toast_success: 'Prüfungs freigabelink erfolgreich in Zwischenablage kopiert.',
        toast_failure: 'Erstellen des Prüfungslinks fehlgeschlagen.'
      },
      start_examination: {
        label: 'Starte Prüfung',
        tooltip: 'Übungs freigabelink erfolgreich in Zwischenablage kopiert.',
        toast: 'Erstellen des Übungslinks fehlgeschlagen.'
      },
      edit_check: {
        label: 'Check bearbeiten',
        tooltip: 'Dir fehlen die Berechtigungen um diese Check zu bearbeiten.'
      },
      clone_check: {
        label: 'Check duplizieren'
      },
      inspect_statistics: {
        label: 'Statistik anzeigen'
      },
      remove_share_token: {
        tooltip: 'Dieser Check hat keinen Freigabe schlüssel.',
        confirmation_dialog_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' + 'Dadurch wird das Share-Token dauerhaft aus diesem KnowledgeCheck gelöscht.',
        toast_deletion_successful: 'Freigabe token erfolgreich gelöscht',
        toast_deletion_failure: 'Löschen des freigabge tokens fehlgeschlagen!'
      },
      delete_knowledgeCheck: {
        label: 'Check löschen',
        confirmation_dialog_body:
          'Diese Aktion kann nicht rückgängig gemacht werden. \n' + 'Dadurch wird dieser KnowledCheck dauerhaft aus Ihrem Konto gelöscht und seine Daten von unseren Servern entfernt.',
        toast_deletion_successful: 'KnowledgeCheck erfolgreich gelöscht',
        toast_deletion_failure: 'Löschen des KnowledgeChecks fehlgeschlagen!'
      },
      Shared: {
        tooltip_not_allowed: 'Dir fehlen die Berechtigungen um diese Aktion durchzuführen.',
        toast_deletion_not_found: 'Löschvorgang fehlgeschlagen, Check nicht gefunden.'
      }
    },
    ConfirmationDialog: {
      default_title: 'Bist du absolut sicher?',
      default_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' + 'Dadurch wird dieses Element dauerhaft aus Ihrem Konto gelöscht und seine Daten von unseren Servern entfernt.',
      default_cancel_label: 'Abbrechen',
      default_confirm_label: 'Weiter'
    },
    DataTable: {
      Pagination: {
        current_page_label: 'Seite {page} von {total}',
        selection_label: '{selected} von {total} Zeilen ausgewählt.',
        sr_only: {
          go_first_page: 'Gehe zur ersten Seite',
          go_last_page: 'Gehe zur letzten Seite',
          go_next_page: 'Gehe zur nächsten Seite',
          go_previous_page: 'Gehe zur vorherigen Seite'
        }
      },
      customize_columns_label_long: 'Spalten anpassen',
      customize_columns_label_short: 'Spalten',
      no_results_label: 'Keine Ergebnisse.',
      page_size_label: 'Zeilen pro Seite'
    }
  }
} as const
