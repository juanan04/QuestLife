export const initialData = {
  player: {
    name: "Aventurero",
    xp: 0,
    level: 1,
    joinDate: new Date().toISOString().split('T')[0]
  },
  quests: [
    // === ACTO 1 — Primeros pasos ===
    {
      id: "quest-01",
      title: "Primer proyecto personal completado",
      act: 1,
      category: "profesional",
      status: "in_progress",
      difficulty: 2,
      estimatedTime: "2-4 semanas",
      xpReward: 100,
      description: "Elige un proyecto personal pequeño y llévalo de inicio a fin. Puede ser una app, un diseño, un blog o cualquier cosa que siempre hayas querido hacer.",
      howTo: [
        "Define claramente el objetivo del proyecto",
        "Dedica al menos 30 min diarios",
        "Comparte el resultado con alguien"
      ],
      prerequisites: [],
      unlocks: ["quest-03", "quest-04"],
      rewards: ["Desbloquea: Siguiente nivel de habilidades"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-01", title: "Definir el objetivo del proyecto", completed: false, completedAt: null },
        { id: "st-02", title: "Completar la primera versión funcional", completed: false, completedAt: null },
        { id: "st-03", title: "Compartir o publicar el resultado", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-02",
      title: "Crear un hábito de ejercicio constante",
      act: 1,
      category: "salud",
      status: "in_progress",
      difficulty: 2,
      estimatedTime: "30 días",
      xpReward: 100,
      description: "Establece una rutina de ejercicio que puedas mantener durante 30 días seguidos. No importa si es correr, gym, yoga o caminar.",
      howTo: [
        "Elige un tipo de ejercicio que disfrutes",
        "Fija un horario fijo en tu día",
        "Cumple 30 días consecutivos"
      ],
      prerequisites: [],
      unlocks: ["quest-05"],
      rewards: ["Desbloquea: Objetivos físicos avanzados"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-04", title: "Elegir tipo de ejercicio y horario", completed: false, completedAt: null },
        { id: "st-05", title: "15 días completados", completed: false, completedAt: null },
        { id: "st-06", title: "30 días completados", completed: false, completedAt: null }
      ]
    },

    // === ACTO 2 — Construyendo ===
    {
      id: "quest-03",
      title: "Aprender una habilidad nueva técnica",
      act: 2,
      category: "profesional",
      status: "locked",
      difficulty: 3,
      estimatedTime: "2-3 meses",
      xpReward: 200,
      description: "Elige una habilidad técnica que abra nuevas puertas: un lenguaje de programación, diseño, edición de vídeo, etc. Completa un proyecto con ella.",
      howTo: [
        "Elige la habilidad y un recurso de aprendizaje",
        "Dedica 30-60 min diarios",
        "Construye un proyecto de ejemplo al finalizar"
      ],
      prerequisites: ["quest-01"],
      unlocks: ["quest-07"],
      rewards: ["Desbloquea: Proyectos avanzados"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-07", title: "Elegir habilidad y recurso de aprendizaje", completed: false, completedAt: null },
        { id: "st-08", title: "Completar el curso o material base", completed: false, completedAt: null },
        { id: "st-09", title: "Proyecto de ejemplo terminado", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-04",
      title: "Empezar a generar ingresos propios",
      act: 2,
      category: "financiero",
      status: "locked",
      difficulty: 3,
      estimatedTime: "1-3 meses",
      xpReward: 200,
      description: "Genera tu primer euro de forma independiente: freelance, venta de algo que creaste, servicio puntual. El primer ingreso propio cambia la mentalidad.",
      howTo: [
        "Identifica qué valor puedes ofrecer",
        "Busca tu primer cliente o comprador",
        "Cobra y documenta la experiencia"
      ],
      prerequisites: ["quest-01"],
      unlocks: ["quest-08"],
      rewards: ["Desbloquea: Escalar ingresos"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-10", title: "Definir propuesta de valor", completed: false, completedAt: null },
        { id: "st-11", title: "Primer cliente o venta conseguida", completed: false, completedAt: null },
        { id: "st-12", title: "Primer ingreso cobrado", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-05",
      title: "Mejorar composición corporal",
      act: 2,
      category: "salud",
      status: "locked",
      difficulty: 3,
      estimatedTime: "3-6 meses",
      xpReward: 200,
      description: "Con la base del hábito de ejercicio, añade nutrición y entrena con objetivo específico: más músculo, menos grasa o más resistencia.",
      howTo: [
        "Define tu objetivo físico concreto",
        "Ajusta alimentación a ese objetivo",
        "Entrena 3-4x por semana con progresión"
      ],
      prerequisites: ["quest-02"],
      unlocks: [],
      rewards: ["Composición corporal mejorada significativamente"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-13", title: "Objetivo físico definido (músculo / grasa / resistencia)", completed: false, completedAt: null },
        { id: "st-14", title: "Dieta ajustada al objetivo", completed: false, completedAt: null },
        { id: "st-15", title: "Progreso visible a los 3 meses", completed: false, completedAt: null }
      ]
    },

    // === ACTO 3 — Escalando ===
    {
      id: "quest-06",
      title: "Aprender un idioma hasta nivel conversacional",
      act: 3,
      category: "profesional",
      status: "locked",
      difficulty: 3,
      estimatedTime: "6-12 meses",
      xpReward: 200,
      description: "Alcanza nivel conversacional en un idioma que no hablas. Inglés, alemán, francés, japonés... el que te abra más puertas.",
      howTo: [
        "30 min/día de práctica activa",
        "Buscar un intercambio de idiomas o tutor",
        "Mantener una conversación de 15 min sin ayuda"
      ],
      prerequisites: [],
      unlocks: ["quest-09"],
      rewards: ["Desbloquea: Certificación oficial del idioma"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-16", title: "Elegir idioma y método de aprendizaje", completed: false, completedAt: null },
        { id: "st-17", title: "Primera conversación real con nativo", completed: false, completedAt: null },
        { id: "st-18", title: "Nivel conversacional fluido alcanzado", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-07",
      title: "Lanzar un producto o servicio propio",
      act: 3,
      category: "profesional",
      status: "locked",
      difficulty: 4,
      estimatedTime: "3-6 meses",
      xpReward: 400,
      description: "Crea algo tuyo y ponlo en el mercado: app, curso, producto físico, consultoría. El objetivo es que otras personas paguen por algo que construiste.",
      howTo: [
        "Identificar un problema real que puedas resolver",
        "Construir un MVP o versión mínima",
        "Lanzar y conseguir las primeras ventas"
      ],
      prerequisites: ["quest-03", "quest-04"],
      unlocks: ["quest-10"],
      rewards: ["Desbloquea: Escalar el negocio"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-19", title: "Problema identificado y validado", completed: false, completedAt: null },
        { id: "st-20", title: "MVP construido", completed: false, completedAt: null },
        { id: "st-21", title: "Primeras ventas conseguidas", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-08",
      title: "Crear un fondo de emergencia (3-6 meses de gastos)",
      act: 3,
      category: "financiero",
      status: "locked",
      difficulty: 2,
      estimatedTime: "6-18 meses",
      xpReward: 200,
      description: "Ahorra entre 3 y 6 meses de tus gastos mensuales en una cuenta accesible. Es la base de cualquier plan financiero sólido.",
      howTo: [
        "Calcular tus gastos mensuales reales",
        "Automatizar un ahorro mensual fijo",
        "No tocar el fondo salvo emergencia real"
      ],
      prerequisites: ["quest-04"],
      unlocks: ["quest-11"],
      rewards: ["Desbloquea: Inversión y activos"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-22", title: "Gastos mensuales calculados", completed: false, completedAt: null },
        { id: "st-23", title: "Ahorro automático configurado", completed: false, completedAt: null },
        { id: "st-24", title: "Fondo de emergencia completo", completed: false, completedAt: null }
      ]
    },

    // === ACTO 4 — Dominando ===
    {
      id: "quest-09",
      title: "Certificación oficial de idioma",
      act: 4,
      category: "profesional",
      status: "locked",
      difficulty: 3,
      estimatedTime: "2-4 meses prep",
      xpReward: 200,
      description: "Obtén una certificación oficial del idioma que aprendes: Cambridge, DELF, Goethe, JLPT, etc.",
      howTo: [
        "Elegir el examen y fecha",
        "Preparación específica para el formato del examen",
        "Aprobar y obtener el certificado"
      ],
      prerequisites: ["quest-06"],
      unlocks: [],
      rewards: ["Credencial oficial reconocida"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-25", title: "Examen elegido y fecha reservada", completed: false, completedAt: null },
        { id: "st-26", title: "Preparación específica completada", completed: false, completedAt: null },
        { id: "st-27", title: "Certificado obtenido", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-10",
      title: "Escalar el negocio a ingresos recurrentes",
      act: 4,
      category: "profesional",
      status: "locked",
      difficulty: 5,
      estimatedTime: "12-24 meses",
      xpReward: 750,
      description: "Evoluciona tu producto o servicio a un modelo que genere ingresos mes a mes sin que tu tiempo sea el límite.",
      howTo: [
        "Identificar el componente que se puede automatizar o escalar",
        "Conseguir primeros clientes recurrentes",
        "Llegar a ingresos mensuales sostenibles"
      ],
      prerequisites: ["quest-07"],
      unlocks: ["quest-13"],
      rewards: ["Desbloquea: Libertad financiera"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-28", title: "Modelo recurrente definido", completed: false, completedAt: null },
        { id: "st-29", title: "Primeros clientes de pago recurrente", completed: false, completedAt: null },
        { id: "st-30", title: "Ingresos recurrentes mensuales estables", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-11",
      title: "Empezar a invertir de forma automática",
      act: 4,
      category: "financiero",
      status: "locked",
      difficulty: 2,
      estimatedTime: "1 día configuración",
      xpReward: 200,
      description: "Configura aportaciones automáticas periódicas a fondos indexados o ETFs. Que el dinero trabaje mientras tú duermes.",
      howTo: [
        "Abrir cuenta en broker o plataforma de inversión",
        "Configurar aportación automática mensual",
        "No tocar las inversiones salvo revisión anual"
      ],
      prerequisites: ["quest-08"],
      unlocks: ["quest-13"],
      rewards: ["Inversión automática activa"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-31", title: "Cuenta de inversión abierta", completed: false, completedAt: null },
        { id: "st-32", title: "Aportación automática configurada", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-12",
      title: "Completar una certificación profesional reconocida",
      act: 4,
      category: "profesional",
      status: "locked",
      difficulty: 3,
      estimatedTime: "3-6 meses",
      xpReward: 200,
      description: "Obtén una certificación reconocida en tu campo: AWS, Google, PMP, CPA, etc. Credencial que valida tu nivel ante el mercado.",
      howTo: [
        "Elegir la certificación más relevante para tu carrera",
        "Estudiar con materiales oficiales",
        "Aprobar el examen"
      ],
      prerequisites: ["quest-03"],
      unlocks: [],
      rewards: ["Credencial profesional reconocida"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-33", title: "Certificación elegida y plan de estudio", completed: false, completedAt: null },
        { id: "st-34", title: "Materiales de preparación completados", completed: false, completedAt: null },
        { id: "st-35", title: "Examen aprobado", completed: false, completedAt: null }
      ]
    },

    // === ACTO 5 — Sueños ===
    {
      id: "quest-13",
      title: "Alcanzar la libertad financiera",
      act: 5,
      category: "financiero",
      status: "locked",
      difficulty: 5,
      estimatedTime: "5-15 años",
      xpReward: 750,
      description: "Llega al punto en que tus ingresos pasivos cubren tus gastos de vida. Trabaja por elección, no por obligación.",
      howTo: [
        "Calcular tu número de libertad financiera (gastos anuales × 25)",
        "Construir activos que generen ingresos pasivos",
        "Alcanzar el número objetivo"
      ],
      prerequisites: ["quest-10", "quest-11"],
      unlocks: ["quest-14", "quest-15"],
      rewards: ["Desbloquea todos los sueños del Acto V"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-36", title: "Número de libertad financiera calculado", completed: false, completedAt: null },
        { id: "st-37", title: "Ingresos pasivos cubren gastos básicos", completed: false, completedAt: null },
        { id: "st-38", title: "Libertad financiera completa alcanzada", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-14",
      title: "El gran viaje soñado",
      act: 5,
      category: "espiritual",
      status: "locked",
      difficulty: 2,
      estimatedTime: "1-3 meses",
      xpReward: 200,
      description: "Haz ese viaje que siempre postergaste. Puede ser un road trip, un destino lejano, una vuelta al mundo o simplemente el país que siempre quisiste visitar.",
      howTo: [
        "Decidir el destino soñado",
        "Reservar sin excusas",
        "Vivir la experiencia al máximo"
      ],
      prerequisites: ["quest-13"],
      unlocks: [],
      rewards: ["Una experiencia que recordarás siempre"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-39", title: "Destino elegido y reserva hecha", completed: false, completedAt: null },
        { id: "st-40", title: "Viaje completado", completed: false, completedAt: null }
      ]
    },
    {
      id: "quest-15",
      title: "Crear algo que perdure",
      act: 5,
      category: "espiritual",
      status: "locked",
      difficulty: 5,
      estimatedTime: "Toda la vida",
      xpReward: 750,
      description: "Crea algo que exista más allá de ti: un libro, una empresa que empleé a otros, una fundación, una obra artística, un legado.",
      howTo: [
        "Definir qué tipo de legado quieres dejar",
        "Empezar a construirlo con consistencia",
        "Verlo impactar vidas de otras personas"
      ],
      prerequisites: ["quest-13"],
      unlocks: [],
      rewards: ["Un legado que trasciende el tiempo"],
      notes: "",
      completedAt: null,
      subtasks: [
        { id: "st-41", title: "Legado definido y proyecto iniciado", completed: false, completedAt: null },
        { id: "st-42", title: "Primeras personas impactadas", completed: false, completedAt: null },
        { id: "st-43", title: "Legado consolidado y autónomo", completed: false, completedAt: null }
      ]
    }
  ],
  habits: [
    {
      id: "habit-lectura",
      title: "Lectura 20 min",
      category: "profesional",
      xpPerDay: 10,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    },
    {
      id: "habit-ejercicio",
      title: "Ejercicio diario",
      category: "salud",
      xpPerDay: 15,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    },
    {
      id: "habit-aprendizaje",
      title: "Aprender algo nuevo 30 min",
      category: "profesional",
      xpPerDay: 15,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    },
    {
      id: "habit-idioma",
      title: "Práctica de idioma",
      category: "profesional",
      xpPerDay: 10,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    },
    {
      id: "habit-negocio",
      title: "1 acción hacia tu objetivo",
      category: "profesional",
      xpPerDay: 20,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    },
    {
      id: "habit-meditacion",
      title: "Meditación o reflexión 10 min",
      category: "espiritual",
      xpPerDay: 10,
      frequency: "daily",
      streak: 0,
      longestStreak: 0,
      checkHistory: {},
      subtasks: []
    }
  ],
  xpLog: []
};
