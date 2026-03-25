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
      answers_label: 'Antworten',
      'points#one': '{count} Punkt',
      'points#zero': '{count} Punkte',
      'points#other': '{count} Punkte',
      points: '{count} Punkte'
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
    description: 'Create your own Course to boost your knowledge to the next level. (de)'
  },
  Courses: {
    title: 'Deine Kurse',
    no_existing_courses: 'Keine Kurse gefunden. Erstelle einen',
    no_existing_courses_action_button: 'hier',
    Create: {
      GeneralSection: {
        title: 'Allgemein',
        name_label: 'Name',
        name_placeholder: 'Österreich Kurs',
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
      ContentSection: {
        title: 'Kursinhalte',
        description: 'Erstellen Sie neue Inhalte für diesen Kurs. \n' +
          'Diese Inhalte können von Benutzern genutzt werden, um ihr Wissen zu erweitern und zu verstehen, warum Fragen falsch beantwortet wurden.',
        Actions: {
          create_new_button_label: 'Erstelle einen neuen Inhalt',
          edit_content_button_label: 'Bearbeiten',
          delete_content_confirm_label: 'Inhalt löschen',
          delete_content_dialog_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' +
            'Dadurch werden dieser Kursinhalt dauerhaft aus diesem Kurs gelöscht und seine Daten von unseren Servern entfernt.',
          delete_content_button_label: 'Löschen',
          edit_content_button_aria_label: 'Kursinhalt bearbeiten',
          delete_content_button_aria_label: 'Kursinhalt löschen'
        },
        CourseContentDialog: {
          title_create: 'Erstellen einen neuen Inhalt',
          title_edit: 'Inhalt bearbeiten',
          Fields: {
            title_placeholder: 'Grundlegende Geschichte Österreichs',
            description_placeholder: 'Enthält grundlegende Informationen über Österreich.',
            title_label: 'Inhaltstitel',
            description_label: 'Kurzbeschreibung',
            categoryId_label: 'Kategorie',
            categoryId_trigger_placerholder: 'Wähle eine Kategorie aus'
          },
          submit_create_button_label: 'Kursinhalt erstellen',
          submit_update_button_label: 'Inhalt aktualisieren'
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
        contents: 'Kursinhalte',
        questions: 'Fragen',
        settings: 'Einstellungen',
        conclusion: 'Zusammenfassung'
      },
      CreateQuestionDialog: {
        Header: {
          title_create: 'Frage erstellen',
          description_create: 'Erstellen Sie eine neue Frage für diesen Kurs',
          title_edit: 'Frage bearbeiten',
          description_edit: 'Bearbeiten Sie Ihre bestehende Frage Ihres Kurses'
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
      title: 'Entdecken Sie neue Kurse',
      no_courses_found_base: 'Keine Wissensüberprüfungen gefunden. \nErstellen Sie Ihren eigenen Kurs',
      no_courses_found_link: 'hier',
      FilterFields: {
        filter_operand_menu_label: 'Filter Operatoren',
        create_course_button_label: 'Erstelle deinen eigenen Kurs',
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
        user_type_normal: 'normal',
        Drawer: {
          close_button_label: 'Schließen',
          description: 'Zeigt Informationen zum Prüfungsversuch von {username}.',
          duration_label: 'Dauer',
          end_time_label: 'Endzeit',
          start_time_label: 'Startzeit',
          submit_button_label: 'Änderungen speichern',
          title: 'Prüfungsversuch – {username}',
          user_score_label: 'Benutzerbewertung',
          username_label: 'Benutzername'
        },
        columns: {
          username_header: 'Benutzername',
          status_header: 'Status',
          duration_header: 'Dauer',
          user_type_header: 'Benutzertyp',
          score_header: 'Punktzahl',
          totalScore_header: 'Maximale Punktzahl',
          preview_action_cell: 'Vorschau',
          actions_menu: {
            delete_attempt_label: 'Versuch löschen',
            show_results_label: 'Ergebnisse anzeigen',
            sr_only_trigger: 'Menü öffnen'
          }
        }
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
        },
        ActionMenu: {
          delete_answer_label: 'Antwort löschen',
          show_answers_label: 'Antworten anzeigen',
          sr_only_trigger: 'Menü öffnen'
        }
      },
      ExamAttemptResultPage: {
        description: 'Zeigt alle Details zum jeweiligen Prüfungsversuch von {name}',
        title: 'Ergebnisse des Prüfungsversuchs'
      },
      ShowAnswerDrawer_TableCell: {
        answer_open_question_label: 'Antwort',
        answers_array_label: 'Antworten',
        description: 'Zeigt Details zu einer bestimmten Frage und ihren Ergebnissen an.',
        drawer_close_button_label: 'Schließen',
        drawer_submit_button_label: 'Änderungen speichern',
        grade_label: 'Note',
        score_slider_label: 'Fragenergebnis',
        title: 'Details zur Antwort auf die Prüfungsfrage'
      }
    },
    PracticeResults: {
      Charts: {
        QuestionCorrectnessPieChart: {
          correct_label: 'Richtig',
          description: 'Zeigt die Anzahl der Fragen an, die richtig, richtig oder gar nicht beantwortet wurden.',
          incorrect_label: 'Falsch',
          title: 'Übungsleistung',
          unanswered_label: 'Unbeantwortet',
          questions_inner_label: 'Fragen'
        },
        DataTable: {
          description: 'Zeigt eine detaillierte Liste aller Fragen dieser Prüfung an, um Ihre Antworten zu überprüfen.',
          title: 'Fragenübersicht'
        },
        DurationChart: {
          title: 'Zeitunterschied zwischen Fragen'
        },
        QuestionScorePlot: {
          description: 'Zeigt die Abweichung zwischen der erhaltenen Fragepunktzahl und der maximalen Punktzahl pro Frage an',
          title: 'Punkte unterschiede pro Frage'
        }
      },
      title: 'Ergebnisse deines Übungsversuchs'
    }
  },
  Examination: {
    attempt_not_possible: {
      title: 'Wissensüberprüfungs nicht möglich',
      courseClosed: 'Leider wurde die Prüfung am {closeDate} geschlossen, sodass Sie nach diesem Tag keine Prüfungen mehr starten können.',
      notOpenYet: 'Leider ist die Prüfung noch nicht für Prüfungen geöffnet. Bitte warten Sie bis zum {openDate}, um mit der Prüfung zu beginnen',
      unavailable: 'Der Kurs, auf den Sie zugreifen wollten, ist derzeit für Benutzer nicht verfügbar.',
      'anonymous-users-not-allowed': 'Anonyme Benutzer sind bei dieser Prüfung nicht zugelassen. Bitte melden Sie sich mit einem anderen Konto an'
    }
  },
  Practice: {
    practicing_not_allowed: {
      disabled: 'Das Üben dieses Kurses ist deaktiviert. Versuchen Sie es später erneut oder wenden Sie sich an den Besitzer des Kurses, um das Üben zu aktivieren.',
      title: 'Üben nicht erlaubt',
      toManyAttempts: 'Leider haben Sie für diese Prüfung die zulässige Anzahl an Übungsversuchen von {allowedAttemptCount} erreicht.'
    },
    PracticeQuestionNavigation: {
      session_timer_label: 'Sitzung',
      EndPractice_button_label: 'Üben beenden',
      EndPractice_ConfirmDialog: {
        confirm_button_label: 'Beenden',
        cancel_button_label: 'Fortsezten',
        title: 'Mit dem Üben aufhören?',
        body: 'Nachdem Sie Ihren aktuellen Übungsversuch beendet haben, werden Ihre Ergebnisse übermittelt und sind für andere zugänglich. \n' +
          'Bitte beachten Sie, dass Sie genau diesen Übungsversuch nicht fortsetzen können, nachdem Sie sie beendet haben.'
      }
    }
  },
  StartOptionsPage: {
    title: 'Übung oder Prüfungsversuch starten',
    Card: {
      title: 'Kurs per Share-Token finden',
      description: 'Geben Sie einen Share-Token ein, um eine Übung oder einen Prüfungsversuch zu starten.'
    },
    ShareTokenInput: {
      parse_token_label: 'Token wird überprüft'
    },
    ShareTokenOptions: {
      not_found_error_message: 'Kurs wurde nicht gefunden.',
      retrieval_error_message: 'Der Kurs konnte nicht geladen werden.',
      start_examination_label: 'Prüfungsversuch starten',
      start_practice_label: 'Übung starten'
    }
  },
  Components: {
    CourseCard: {
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
    ShareCourseButton: {
      tooltip_message: 'Teile diesen Kurs',
      tooltip_empty_message: 'Dieser Kurs hat keine Fragen und kann deswegen nicht geteilt werden.',
      successfully_copied_toast_message: 'Freigabelink erfolgreich in Zwischenablage gespeichert',
      failed_copy_toast_message: 'Der Freigabelink konnte nicht in Zwischenablage gespeichert werden.'
    },
    CourseActionMenu: {
      menu_label: 'Aktionen',
      invite_to_submenu_label: 'Teile diesen Kurs',
      copy_practice: {
        label: 'Kopiere Übungslink',
        toast_success: 'Übungs freigabelink erfolgreich in Zwischenablage kopiert.',
        toast_failure: 'Erstellen des Übungslinks fehlgeschlagen.'
      },
      start_practice: {
        label: 'Beginne zu Üben',
        tooltip: 'Dieser Kurs hat keine Fragen, Übung deaktiviert.',
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
      edit_course: {
        label: 'Kurs bearbeiten',
        tooltip: 'Dir fehlen die Berechtigungen um diesen Kurs zu bearbeiten.'
      },
      clone_course: {
        label: 'Kurs duplizieren'
      },
      inspect_statistics: {
        label: 'Statistik anzeigen'
      },
      remove_share_token: {
        tooltip: 'Dieser Kurs hat keinen Freigabe schlüssel.',
        confirmation_dialog_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' +
          'Dadurch wird das Share-Token dauerhaft aus diesem Kurs gelöscht.',
        toast_deletion_successful: 'Freigabe token erfolgreich gelöscht',
        toast_deletion_failure: 'Löschen des freigabge tokens fehlgeschlagen!'
      },
      delete_course: {
        label: 'Kurs löschen',
        confirmation_dialog_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' +
          'Dadurch wird dieser Kurs dauerhaft aus Ihrem Konto gelöscht und seine Daten von unseren Servern entfernt.',
        toast_deletion_successful: 'Kurs erfolgreich gelöscht',
        toast_deletion_failure: 'Löschen des Kurses fehlgeschlagen!'
      },
      Shared: {
        tooltip_not_allowed: 'Dir fehlen die Berechtigungen um diese Aktion durchzuführen.',
        toast_deletion_not_found: 'Löschvorgang fehlgeschlagen, Kurs nicht gefunden.'
      }
    },
    ConfirmationDialog: {
      default_title: 'Bist du absolut sicher?',
      default_body: 'Diese Aktion kann nicht rückgängig gemacht werden. \n' +
        'Dadurch wird dieses Element dauerhaft aus Ihrem Konto gelöscht und seine Daten von unseren Servern entfernt.',
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
      page_size_label: 'Zeilen pro Seite',
      Sorting: {
        ascending_order_label: 'Aufsteigend sortieren',
        ascending_order_title: 'Zeilen in aufsteigender Reihenfolge sortieren',
        descending_order_label: 'Absteigend sortieren',
        descending_order_title: 'Zeilen in absteigender Reihenfolge sortieren',
        reset_sorting_label: 'Sortierung entfernen',
        reset_sorting_disabled_tooltip: 'Diese Spalte wird derzeit nicht sortiert.',
        column_sort_button_aria_label: 'Sortieren nach {columnId}',
        dropdown_sr_only_trigger_label: 'Sortiermenü öffnen'
      }
    },
    QuestionNavigation: {
      title: 'Übungsfragen',
      question_aria_label: 'Frage {index} ist {status}',
      question_status_correct: 'richtig',
      question_status_incorrect: 'falsch',
      'question_status_partly-correct': 'fast richtig',
      question_status_unanswered: 'unbeantwortet'
    },
    RichTextEditor: {
      Content: {
        input_aria_label: 'Text Bereichm, beginne mit dem Schreiben.'
      },
      Toolbar: {
        undo_tooltip_label: 'Rückgängig',
        redo_tooltip_label: 'Wiederholen',
        Headings: {
          trigger_tooltip_label: 'Überschrift',
          trigger_aria_label: 'Text als Überschrift formatieren',
          heading_level_label: 'Überschrift {level}'
        },
        ListOptions: {
          trigger_label: 'Liste',
          trigger_aria_label: 'Listenoptionen',
          Options: {
            bulletList: 'Aufzählungsliste',
            orderedList: 'Geordnete Liste',
            taskList: 'Aufgabenliste'
          }
        },
        FontOptions: {
          trigger_tooltip_label: 'Schriftartoptionen',
          bold_label: 'Fett',
          italic_label: 'Kursiv',
          strike_label: 'Durchstreichen',
          code_label: 'Code',
          underline_label: 'Unterstreichen'
        },
        Alignment: {
          trigger_aria_label: 'Textausrichtung formatieren',
          trigger_tooltip_label: 'Ausrichtungs Optionen',
          left_label: 'Links ausrichten',
          center_label: 'Mittig ausrichten',
          right_label: 'Rechts ausrichten',
          justify_label: 'Ausrichten'
        }
      }
    }
  },
  AccountPage: {
    LinkAccountSection: {
      description: 'Um Ihre Daten nach dem Abmelden oder Schließen dieses Tabs zu behalten, können Sie sich über einen sozialen Anbieter wie Google oder GitHub anmelden.',
      title: 'Verknüpfen Sie Ihr Konto'
    },
    signout_button_label: 'Abmelden',
    signout_delete_notice: 'Daten löschen',
    title: 'Kontoinformationen'
  },
  schemas: {
    Course: {
      name: {
        default: 'Wissenskurs',
        description: 'Der Name, unter dem der erstellte Kurs zugeordnet wird.'
      },
      description: {
        description: 'Beschreiben Sie das Konzept Ihres Kurses mit ein paar Worten.'
      },
      difficulty: {
        description: 'Legt das für diesen Kurs erforderliche Kenntnisniveau fest.',
        min_max_message: 'Bitte geben Sie einen Schwierigkeitsgrad zwischen 1 und 10 an.'
      },
      questions: {
        refinement_message: 'Die IDs der Fragen müssen eindeutig sein!'
      },
      openDate: {
        description: 'Der Tag, an dem Benutzer den Kurs nutzen können.'
      },
      closeDate: {
        description: 'Der letzte Tag, an dem der Kurs von anderen genutzt werden kann.'
      },
      owner_id: {
        max_message: 'Bitte geben Sie eine gültige Benutzer-ID an, die der Definition von `db_user`.id entspricht. (maximale Länge: 36)'
      }
    },
    Authentication: {
      email: {
        email_constraint_message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
      },
      password: {
        'min_constraint_message#one': 'Das Passwort muss mindestens {count} Zeichen lang sein.',
        'min_constraint_message#other': 'Das Passwort muss mindestens {count} Zeichen lang sein.',
        min_constraint_message: 'Das Passwort muss mindestens {count} Zeichen lang sein.'
      },
      name: {
        'min_constraint_message#one': 'Der Name muss mindestens {count} Zeichen lang sein.',
        'min_constraint_message#other': 'Der Name muss mindestens {count} Zeichen lang sein.',
        min_constraint_message: 'Der Name muss mindestens {count} Zeichen lang sein.'
      }
    },
    Category: {
      prerequisiteCategoryId: {
        min_constraint_message: 'Eine Voraussetzungskategorie darf nicht leer sein!'
      }
    },
    CourseContent: {
      title: {
        nonempty_message: 'Der Titel eines Inhalts darf nicht leer sein.',
        description: 'Wird verwendet, um einen bestimmten Inhalt einer Kategorie schnell zu identifizieren'
      },
      description: {
        description: 'Beschreibt den Inhalt, der einer bestimmten Kategorie zugeordnet ist.'
      },
      categoryId: {
        uuidv4_message: 'Die Auswahl einer Kategorie ist erforderlich'
      }
    },
    CourseSettings: {
      practice: {
        enablePracticing: {
          description: 'Legt fest, ob Benutzer mit diesem Kurs üben können oder nicht.'
        },
        allowedPracticeCount: {
          min_constraint: 'Benutzern muss mindestens ein Versuch erlaubt sein.',
          description: 'Die Anzahl der Übungsversuche, die Benutzer haben. \n' +
            'Wenn der Wert auf null gesetzt ist, haben Benutzer unbegrenzte Versuche'
        }
      },
      examination: {
        enableExaminations: {
          description: 'Legt fest, ob Benutzer einen Prüfungsversuch für diesen Kurs starten können oder nicht.'
        },
        startDate: {
          description: 'Das Startdatum, an dem Benutzer mit Prüfungen beginnen können.'
        },
        endDate: {
          description: 'Das Enddatum, nach dem Benutzer keine Prüfungen mehr starten können. \n' +
            'Bei Null werden keine Endbeschränkungen festgelegt.'
        },
        questionOrder: {
          description: 'Definiert die Reihenfolge der Fragen während der Übung/Prüfung.'
        },
        answerOrder: {
          description: 'Definiert die Reihenfolge der Antworten während der Übung/Prüfung.'
        },
        allowAnonymous: {
          description: 'Gibt an, ob anonyme Benutzer eine Prüfung starten können.'
        },
        allowFreeNavigation: {
          description: 'Gibt an, ob Benutzer frei zwischen den Fragen wechseln können oder nicht.'
        },
        examTimeFrameSeconds: {
          'min_constraint#one': 'Der Prüfungszeitraum muss mindestens {count} Minute betragen!',
          'min_constraint#other': 'Der Prüfungszeitraum muss mindestens {count} Minuten betragen!',
          min_constraint: 'Der Prüfungszeitraum muss mindestens {count} Minuten betragen!',
          'max_constraint#one': 'Der Prüfungszeitraum darf nicht mehr als {count} Stunde überschreiten!',
          'max_constraint#other': 'Der Prüfungszeitraum darf nicht mehr als {count} Stunden überschreiten!',
          max_constraint: 'Der Prüfungszeitraum darf nicht mehr als {count} Stunden überschreiten!',
          description: 'Die maximale Dauer, die einem Benutzer für einen Prüfungsversuch zur Verfügung steht.'
        },
        examinationAttemptCount: {
          min_constraint: 'Benutzern muss mindestens ein Versuch erlaubt sein.',
          description: 'Die Anzahl der Prüfungsversuche, die Benutzer haben.'
        }
      },
      shareAccessibility: {
        description: 'Definiert, ob dieser Kurs öffentlich zugänglich ist, also ob Benutzer diesen Kurs entdecken können.'
      }
    },
    Question: {
      id: {
        uuid_message: 'Eine Antwort muss eine id haben, um sie zu identifizieren!'
      },
      question: {
        'min_words_constraint#one': 'Bitte formulieren Sie Ihre Frage so um, dass sie mindestens {count} Wörter lang ist.',
        'min_words_constraint#other': 'Bitte formulieren Sie Ihre Frage so um, dass sie mindestens {count} Wörter lang ist.',
        min_words_constraint: 'Bitte formulieren Sie Ihre Frage so um, dass sie mindestens {count} Wörter lang ist.'
      },
      Shared: {
        unique_answer_text_constraint_message: 'Antworten müssen eindeutig sein. \nDuplikat: {text}',
        unique_answer_id_constraint_message: 'Antwort-IDs müssen eindeutig sein. \nDoppelte ID: {id}',
        default_answer_name: 'Antwort {pos}'
      },
      MultipleChoice: {
        answer: {
          min_constraint: 'Eine Antwort darf nicht leer sein!'
        },
        answers: {
          min_constraint: 'Bitte erstelle mindestens eine Antwort',
          min_one_correct_answer_constraint: 'Mindestens eine Antwort muss richtig sein!'
        }
      },
      SingleChoice: {
        answers: {
          min_answer_count: 'Bitte erstelle mindestens eine Antwort',
          exactly_one_correct_answer_message: 'Eine Einzelauswahl Frage kann genau *eine* richtige Antwort haben!'
        }
      },
      DragDrop: {
        refinements: {
          continous_order_range: 'Positionen müssen einen kontinuierlichen Reihenfolge bilden: [0...{highestPosition}]; \n' +
            'erhalten: [{receivedPositions}]. \n' +
            'Position {missingPosition} fehlt!',
          start_index_constraint: 'Antwort Positionen müssen bei 0 beginnen; \n' +
            'erhalten: {receivedStartIndex}',
          duplicate_position_message: 'Doppelte Position: {position}'
        }
      }
    },
    QuestionInput: {
      SingleChoice: {
        empty_selection_message: 'Bitte wählen eine Antwort aus'
      },
      MultipleChoice: {
        empty_selection_message: 'Bitte wähle mindestens eine Antwort aus'
      },
      OpenQuestion: {
        empty_input_message: 'Bitte gib eine Antwort'
      },
      DragDrop: {
        missing_ordering_message: 'Ordne die Antworten in der richtigen Reihenfolge an'
      }
    },
    Shared: {
      date_nan_time: 'Ungültiger Datumswert angegeben',
      number: {
        positive: 'Diese Zahl muss größer als 0 sein'
      }
    }
  }
} as const
