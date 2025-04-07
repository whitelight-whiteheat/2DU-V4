import { format, formatDistance, formatRelative, parseISO } from 'date-fns';
import { enUS, es, fr, de, ja, zhCN } from 'date-fns/locale';

// Define supported languages
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

// Export supported languages with their names
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' },
] as const;

// Define the structure of our translations
export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Default language
export const DEFAULT_LANGUAGE: Language = 'en';

// Map of language codes to date-fns locales
const dateLocales: Record<Language, Locale> = {
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  ja: ja,
  zh: zhCN,
};

// Translations object
const translations: Translations = {
  en: {
    // Common
    'app.name': '2DU Task Management',
    'app.description': 'A simple and efficient task management application',
    'app.loading': 'Loading...',
    'app.error': 'An error occurred',
    'app.retry': 'Retry',
    'app.cancel': 'Cancel',
    'app.save': 'Save',
    'app.delete': 'Delete',
    'app.edit': 'Edit',
    'app.create': 'Create',
    'app.search': 'Search',
    'app.filter': 'Filter',
    'app.sort': 'Sort',
    'app.clear': 'Clear',
    'app.confirm': 'Confirm',
    'app.close': 'Close',
    
    // Settings
    'settings.title': 'Settings',
    'settings.description': 'Configure your application preferences',
    'settings.tabsLabel': 'Settings sections',
    'settings.tabs.accessibility': 'Accessibility',
    'settings.tabs.language': 'Language',
    'settings.language': 'Language',
    'settings.language.select': 'Select Language',
    'settings.language.note': 'Changes will take effect immediately',
    'settings.accessibility': 'Accessibility',
    'settings.accessibility.highContrast': 'High Contrast Mode',
    'settings.accessibility.reducedMotion': 'Reduced Motion',
    'settings.accessibility.fontSize': 'Font Size',
    'settings.accessibility.fontSize.increase': 'Increase Font Size',
    'settings.accessibility.fontSize.decrease': 'Decrease Font Size',
    'settings.accessibility.fontSize.reset': 'Reset Font Size',
    'settings.accessibility.screenReader': 'Screen Reader Mode',
    'settings.accessibility.focusVisible': 'Focus Visibility',
    
    // Sidebar
    'sidebar.today': 'Today',
    'sidebar.upcoming': 'Upcoming',
    'sidebar.calendar': 'Calendar',
    'sidebar.tags': 'Tags',
    'sidebar.completed': 'Completed',
    'sidebar.settings': 'Settings',
    'sidebar.welcome': 'Welcome, {userName}',
    'sidebar.user': 'User',
    
    // Authentication
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.haveAccount': 'Already have an account?',
    'auth.loginError': 'Login failed. Please check your credentials.',
    'auth.signupError': 'Sign up failed. Please try again.',
    'auth.passwordMismatch': 'Passwords do not match.',
    'auth.weakPassword': 'Password is too weak.',
    'auth.emailInUse': 'Email is already in use.',
    'auth.invalidEmail': 'Invalid email address.',
    
    // Tasks
    'task.title': 'Title',
    'task.description': 'Description',
    'task.dueDate': 'Due Date',
    'task.priority': 'Priority',
    'task.status': 'Status',
    'task.tags': 'Tags',
    'task.addTag': 'Add Tag',
    'task.removeTag': 'Remove Tag',
    'task.create': 'Create Task',
    'task.edit': 'Edit Task',
    'task.delete': 'Delete Task',
    'task.complete': 'Complete Task',
    'task.uncomplete': 'Uncomplete Task',
    'task.reorder': 'Reorder Tasks',
    'task.filterByStatus': 'Filter by Status',
    'task.filterByTag': 'Filter by Tag',
    'task.sortByDueDate': 'Sort by Due Date',
    'task.search': 'Search Tasks',
    'task.noTasks': 'No tasks found',
    'task.loading': 'Loading tasks...',
    'task.error': 'Error loading tasks',
    
    // Task Status
    'status.todo': 'To Do',
    'status.inProgress': 'In Progress',
    'status.completed': 'Completed',
    
    // Task Priority
    'priority.low': 'Low',
    'priority.medium': 'Medium',
    'priority.high': 'High',
    
    // Views
    'view.today': 'Today',
    'view.upcoming': 'Upcoming',
    'view.calendar': 'Calendar',
    'view.tags': 'Tags',
    'view.completed': 'Completed',
    
    // Accessibility
    'a11y.menuButton': 'Menu',
    'a11y.addTaskButton': 'Add Task',
    'a11y.taskItem': 'Task Item',
    'a11y.taskComplete': 'Mark task as complete',
    'a11y.taskUncomplete': 'Mark task as uncomplete',
    'a11y.taskEdit': 'Edit task',
    'a11y.taskDelete': 'Delete task',
    'a11y.taskDrag': 'Drag task to reorder',
    'a11y.taskDrop': 'Drop task to reorder',
  },
  es: {
    // Spanish translations (partial example)
    'app.name': '2DU Gestión de Tareas',
    'app.description': 'Una aplicación simple y eficiente para la gestión de tareas',
    'app.loading': 'Cargando...',
    'app.error': 'Se produjo un error',
    'app.retry': 'Reintentar',
    'app.cancel': 'Cancelar',
    'app.save': 'Guardar',
    'app.delete': 'Eliminar',
    'app.edit': 'Editar',
    'app.create': 'Crear',
    'app.search': 'Buscar',
    'app.filter': 'Filtrar',
    'app.sort': 'Ordenar',
    'app.clear': 'Limpiar',
    'app.confirm': 'Confirmar',
    'app.close': 'Cerrar',
    
    // Sidebar
    'sidebar.today': 'Hoy',
    'sidebar.upcoming': 'Próximos',
    'sidebar.calendar': 'Calendario',
    'sidebar.tags': 'Etiquetas',
    'sidebar.completed': 'Completados',
    'sidebar.settings': 'Configuración',
    'sidebar.welcome': 'Bienvenido, {userName}',
    'sidebar.user': 'Usuario',
  },
  // Add more languages as needed
};

// Current language state
let currentLanguage: Language = DEFAULT_LANGUAGE;

// Function to set the current language
export const setLanguage = (language: Language): void => {
  if (translations[language]) {
    currentLanguage = language;
    // Store the language preference in localStorage
    localStorage.setItem('language', language);
  }
};

// Function to get the current language
export const getLanguage = (): Language => {
  return currentLanguage;
};

// Function to initialize the language from localStorage
export const initLanguage = (): void => {
  console.log('Initializing language from localStorage');
  const savedLanguage = localStorage.getItem('language') as Language;
  console.log('Saved language from localStorage:', savedLanguage);
  
  if (savedLanguage && translations[savedLanguage]) {
    console.log(`Setting language to ${savedLanguage}`);
    currentLanguage = savedLanguage;
  } else {
    console.log(`No valid saved language found, using default: ${DEFAULT_LANGUAGE}`);
    currentLanguage = DEFAULT_LANGUAGE;
  }
  
  console.log('Current language after initialization:', currentLanguage);
};

// Function to translate a key
export const t = (key: string, params?: Record<string, string>): string => {
  console.log(`Translating key: ${key}, current language: ${currentLanguage}`);
  
  // Check if the key exists in the current language
  if (translations[currentLanguage]?.[key]) {
    console.log(`Found translation for ${key} in ${currentLanguage}: ${translations[currentLanguage][key]}`);
  } else if (translations[DEFAULT_LANGUAGE]?.[key]) {
    console.log(`Using default language translation for ${key}: ${translations[DEFAULT_LANGUAGE][key]}`);
  } else {
    console.log(`No translation found for ${key}, using key as fallback`);
  }
  
  const translation = translations[currentLanguage]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
  
  if (params) {
    return Object.entries(params).reduce(
      (result, [paramKey, paramValue]) => result.replace(`{${paramKey}}`, paramValue),
      translation
    );
  }
  
  return translation;
};

// Function to format a date
export const formatDate = (date: Date | string, formatStr: string = 'PP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: dateLocales[currentLanguage] });
};

// Function to format a relative date
export const formatRelativeDate = (date: Date | string, baseDate: Date = new Date()): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, baseDate, { locale: dateLocales[currentLanguage] });
};

// Function to format a distance date
export const formatDistanceDate = (date: Date | string, baseDate: Date = new Date()): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, baseDate, { locale: dateLocales[currentLanguage] });
};

// Function to format a number
export const formatNumber = (number: number, options?: Intl.NumberFormatOptions): string => {
  return new Intl.NumberFormat(currentLanguage, options).format(number);
};

// Function to format a currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat(currentLanguage, { style: 'currency', currency }).format(amount);
};

// Initialize language on import
initLanguage(); 