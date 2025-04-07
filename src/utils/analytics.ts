/**
 * Analytics integration for the 2DU Task Management application
 * This provides a centralized way to track user behavior and application usage
 */

// Event types
export enum AnalyticsEventType {
  PAGE_VIEW = 'page_view',
  TASK_CREATED = 'task_created',
  TASK_UPDATED = 'task_updated',
  TASK_DELETED = 'task_deleted',
  TASK_COMPLETED = 'task_completed',
  TASK_REOPENED = 'task_reopened',
  TASK_TAGGED = 'task_tagged',
  TASK_UNTAGGED = 'task_untagged',
  TASK_IMPORTED = 'task_imported',
  TASK_EXPORTED = 'task_exported',
  TASK_FILTERED = 'task_filtered',
  TASK_SORTED = 'task_sorted',
  TASK_SEARCHED = 'task_searched',
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTERED = 'user_registered',
  USER_PREFERENCES_UPDATED = 'user_preferences_updated',
  ERROR_OCCURRED = 'error_occurred',
  FEATURE_USED = 'feature_used',
}

// Analytics interface
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: string;
  userId?: string;
  properties?: Record<string, any>;
}

// Analytics class
class Analytics {
  private events: AnalyticsEvent[] = [];
  private isEnabled: boolean = false;
  private userId?: string;

  constructor() {
    // Enable in production by default
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  /**
   * Enable or disable analytics
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Set the current user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clear the current user ID
   */
  clearUserId(): void {
    this.userId = undefined;
  }

  /**
   * Track an event
   */
  trackEvent(type: AnalyticsEventType, properties?: Record<string, any>): void {
    if (!this.isEnabled) {
      return;
    }

    const event: AnalyticsEvent = {
      type,
      timestamp: new Date().toISOString(),
      userId: this.userId,
      properties,
    };

    this.events.push(event);
    this.saveEvents();

    // In a real implementation, you would send this to your analytics service
    // Example: Google Analytics, Mixpanel, Amplitude, etc.
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', event);
    }
  }

  /**
   * Track a page view
   */
  trackPageView(path: string, title?: string): void {
    this.trackEvent(AnalyticsEventType.PAGE_VIEW, {
      path,
      title: title || document.title,
    });
  }

  /**
   * Track a task creation
   */
  trackTaskCreated(taskId: string, taskTitle: string, tags?: string[]): void {
    this.trackEvent(AnalyticsEventType.TASK_CREATED, {
      taskId,
      taskTitle,
      tags,
    });
  }

  /**
   * Track a task update
   */
  trackTaskUpdated(taskId: string, changes: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.TASK_UPDATED, {
      taskId,
      changes,
    });
  }

  /**
   * Track a task deletion
   */
  trackTaskDeleted(taskId: string, taskTitle: string): void {
    this.trackEvent(AnalyticsEventType.TASK_DELETED, {
      taskId,
      taskTitle,
    });
  }

  /**
   * Track a task completion
   */
  trackTaskCompleted(taskId: string, taskTitle: string): void {
    this.trackEvent(AnalyticsEventType.TASK_COMPLETED, {
      taskId,
      taskTitle,
    });
  }

  /**
   * Track a task reopening
   */
  trackTaskReopened(taskId: string, taskTitle: string): void {
    this.trackEvent(AnalyticsEventType.TASK_REOPENED, {
      taskId,
      taskTitle,
    });
  }

  /**
   * Track a task tagging
   */
  trackTaskTagged(taskId: string, tag: string): void {
    this.trackEvent(AnalyticsEventType.TASK_TAGGED, {
      taskId,
      tag,
    });
  }

  /**
   * Track a task untagging
   */
  trackTaskUntagged(taskId: string, tag: string): void {
    this.trackEvent(AnalyticsEventType.TASK_UNTAGGED, {
      taskId,
      tag,
    });
  }

  /**
   * Track a task import
   */
  trackTaskImported(count: number, source: string): void {
    this.trackEvent(AnalyticsEventType.TASK_IMPORTED, {
      count,
      source,
    });
  }

  /**
   * Track a task export
   */
  trackTaskExported(count: number, format: string): void {
    this.trackEvent(AnalyticsEventType.TASK_EXPORTED, {
      count,
      format,
    });
  }

  /**
   * Track a task filter
   */
  trackTaskFiltered(filterType: string, filterValue: any): void {
    this.trackEvent(AnalyticsEventType.TASK_FILTERED, {
      filterType,
      filterValue,
    });
  }

  /**
   * Track a task sort
   */
  trackTaskSorted(sortField: string, sortDirection: 'asc' | 'desc'): void {
    this.trackEvent(AnalyticsEventType.TASK_SORTED, {
      sortField,
      sortDirection,
    });
  }

  /**
   * Track a task search
   */
  trackTaskSearched(query: string, resultCount: number): void {
    this.trackEvent(AnalyticsEventType.TASK_SEARCHED, {
      query,
      resultCount,
    });
  }

  /**
   * Track a user login
   */
  trackUserLogin(userId: string, method: string): void {
    this.trackEvent(AnalyticsEventType.USER_LOGIN, {
      userId,
      method,
    });
  }

  /**
   * Track a user logout
   */
  trackUserLogout(userId: string): void {
    this.trackEvent(AnalyticsEventType.USER_LOGOUT, {
      userId,
    });
  }

  /**
   * Track a user registration
   */
  trackUserRegistered(userId: string, method: string): void {
    this.trackEvent(AnalyticsEventType.USER_REGISTERED, {
      userId,
      method,
    });
  }

  /**
   * Track a user preferences update
   */
  trackUserPreferencesUpdated(userId: string, changes: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.USER_PREFERENCES_UPDATED, {
      userId,
      changes,
    });
  }

  /**
   * Track an error
   */
  trackError(errorType: string, errorMessage: string, context?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.ERROR_OCCURRED, {
      errorType,
      errorMessage,
      ...context,
    });
  }

  /**
   * Track a feature usage
   */
  trackFeatureUsed(featureName: string, properties?: Record<string, any>): void {
    this.trackEvent(AnalyticsEventType.FEATURE_USED, {
      featureName,
      ...properties,
    });
  }

  /**
   * Get all tracked events
   */
  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  /**
   * Clear all tracked events
   */
  clearEvents(): void {
    this.events = [];
    this.saveEvents();
  }

  /**
   * Save events to localStorage
   */
  private saveEvents(): void {
    try {
      localStorage.setItem('analyticsEvents', JSON.stringify(this.events));
    } catch (e) {
      console.error('Failed to save analytics events:', e);
    }
  }

  /**
   * Load events from localStorage
   */
  private loadEvents(): void {
    try {
      const savedEvents = localStorage.getItem('analyticsEvents');
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }
    } catch (e) {
      console.error('Failed to load analytics events:', e);
    }
  }
}

// Export a singleton instance
export const analytics = new Analytics();

// Google Analytics Integration
import ReactGA from 'react-ga4';

/**
 * Initialize Google Analytics
 * @param trackingId - The Google Analytics tracking ID
 */
export const initGoogleAnalytics = (trackingId: string) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize(trackingId);
  }
};

/**
 * Track page view in Google Analytics
 * @param path - The path of the page
 * @param title - The title of the page
 */
export const trackPageView = (path: string, title?: string) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.send({ hitType: 'pageview', page: path, title });
  }
};

/**
 * Track event in Google Analytics
 * @param category - The category of the event
 * @param action - The action of the event
 * @param label - The label of the event
 * @param value - The value of the event
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

/**
 * Track user timing in Google Analytics
 * @param category - The category of the timing
 * @param variable - The variable of the timing
 * @param value - The value of the timing
 * @param label - The label of the timing
 */
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.timing({
      category,
      variable,
      value,
      label,
    });
  }
}; 