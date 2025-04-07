/**
 * Firebase Performance Monitoring utility for the 2DU Task Management application
 * This provides a centralized way to track performance metrics
 */

// Performance trace interface
export interface PerformanceTrace {
  name: string;
  startTime: number;
  attributes?: Record<string, string | number | boolean>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface PerformanceData {
  metrics: PerformanceMetric[];
  marks: PerformanceMark[];
  measures: PerformanceMeasure[];
}

// Performance monitoring class
class PerformanceMonitor {
  private traces: Map<string, PerformanceTrace> = new Map();
  private isEnabled: boolean = false;
  private metrics: PerformanceMetric[] = [];
  private marks: PerformanceMark[] = [];
  private measures: PerformanceMeasure[] = [];

  constructor() {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Enable in production by default
      this.isEnabled = process.env.NODE_ENV === 'production';
    }
  }

  /**
   * Enable or disable performance monitoring
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Start a new performance trace
   */
  startTrace(name: string, attributes?: Record<string, string | number | boolean>): void {
    if (!this.isEnabled) return;

    // If a trace with this name already exists, stop it first
    if (this.traces.has(name)) {
      this.stopTrace(name);
    }

    // Create a new trace
    this.traces.set(name, {
      name,
      startTime: performance.now(),
      attributes
    });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance trace started: ${name}`, attributes);
    }
  }

  /**
   * Stop a performance trace and log the duration
   */
  stopTrace(name: string): number | null {
    if (!this.isEnabled) return null;

    const trace = this.traces.get(name);
    if (!trace) {
      console.warn(`Performance trace not found: ${name}`);
      return null;
    }

    // Calculate duration
    const endTime = performance.now();
    const duration = endTime - trace.startTime;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance trace stopped: ${name}`, {
        duration: `${duration.toFixed(2)}ms`,
        attributes: trace.attributes
      });
    }

    // In production, send to Firebase Performance Monitoring
    if (process.env.NODE_ENV === 'production') {
      // Here you would send the trace to Firebase Performance Monitoring
      // For example: firebase.performance().trace(name).stop();
      
      // For now, we'll just log to console
      console.log(
        `[PERF] ${name}: ${duration.toFixed(2)}ms`,
        trace.attributes ? `\nAttributes: ${JSON.stringify(trace.attributes, null, 2)}` : ''
      );
    }

    // Remove the trace
    this.traces.delete(name);

    return duration;
  }

  /**
   * Add an attribute to an existing trace
   */
  addAttribute(name: string, attributeName: string, attributeValue: string | number | boolean): void {
    if (!this.isEnabled) return;

    const trace = this.traces.get(name);
    if (!trace) {
      console.warn(`Performance trace not found: ${name}`);
      return;
    }

    // Initialize attributes if they don't exist
    if (!trace.attributes) {
      trace.attributes = {};
    }

    // Add the attribute
    trace.attributes[attributeName] = attributeValue;

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Added attribute to trace ${name}:`, {
        [attributeName]: attributeValue
      });
    }
  }

  /**
   * Measure the execution time of a function
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ): Promise<T> {
    this.startTrace(name, attributes);
    try {
      return await fn();
    } finally {
      this.stopTrace(name);
    }
  }

  /**
   * Measure the execution time of a synchronous function
   */
  measure<T>(
    name: string,
    fn: () => T,
    attributes?: Record<string, string | number | boolean>
  ): T {
    this.startTrace(name, attributes);
    try {
      return fn();
    } finally {
      this.stopTrace(name);
    }
  }

  /**
   * Records a performance metric
   * @param name Name of the metric
   * @param value Numeric value of the metric
   * @param metadata Additional context about the metric
   */
  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      metadata,
    };

    this.metrics.push(metric);
    this.saveMetrics();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}:`, value, metadata);
    }
  }

  /**
   * Marks a specific point in time
   * @param name Name of the mark
   */
  mark(name: string) {
    const mark: PerformanceMark = {
      name,
      timestamp: new Date().toISOString(),
    };

    this.marks.push(mark);
    this.saveMarks();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Mark - ${name}`);
    }
  }

  /**
   * Measures the time between two marks
   * @param name Name of the measure
   * @param startMark Name of the start mark
   * @param endMark Name of the end mark
   */
  measure(name: string, startMark: string, endMark: string) {
    const start = this.marks.find(m => m.name === startMark);
    const end = this.marks.find(m => m.name === endMark);

    if (!start || !end) {
      console.warn(`Cannot measure ${name}: marks not found`);
      return;
    }

    const startTime = new Date(start.timestamp).getTime();
    const endTime = new Date(end.timestamp).getTime();
    const duration = endTime - startTime;

    const measure: PerformanceMeasure = {
      name,
      duration,
      startMark,
      endMark,
      timestamp: new Date().toISOString(),
    };

    this.measures.push(measure);
    this.saveMeasures();

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Measure - ${name}:`, duration, 'ms');
    }
  }

  /**
   * Gets all performance data
   */
  getPerformanceData(): PerformanceData {
    return {
      metrics: this.metrics,
      marks: this.marks,
      measures: this.measures,
    };
  }

  /**
   * Clears all performance data
   */
  clearPerformanceData() {
    this.metrics = [];
    this.marks = [];
    this.measures = [];
    this.saveMetrics();
    this.saveMarks();
    this.saveMeasures();
  }

  private saveMetrics() {
    try {
      localStorage.setItem('performanceMetrics', JSON.stringify(this.metrics));
    } catch (e) {
      console.error('Failed to save performance metrics:', e);
    }
  }

  private saveMarks() {
    try {
      localStorage.setItem('performanceMarks', JSON.stringify(this.marks));
    } catch (e) {
      console.error('Failed to save performance marks:', e);
    }
  }

  private saveMeasures() {
    try {
      localStorage.setItem('performanceMeasures', JSON.stringify(this.measures));
    } catch (e) {
      console.error('Failed to save performance measures:', e);
    }
  }

  private loadPerformanceData() {
    try {
      const metrics = localStorage.getItem('performanceMetrics');
      const marks = localStorage.getItem('performanceMarks');
      const measures = localStorage.getItem('performanceMeasures');

      if (metrics) this.metrics = JSON.parse(metrics);
      if (marks) this.marks = JSON.parse(marks);
      if (measures) this.measures = JSON.parse(measures);
    } catch (e) {
      console.error('Failed to load performance data:', e);
    }
  }
}

// Export a singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Load saved performance data
performanceMonitor.loadPerformanceData();

// Helper function to measure component render time
export const measureComponentRender = (componentName: string): void => {
  performanceMonitor.startTrace(`render_${componentName}`, {
    component: componentName,
    type: 'render'
  });

  // Return a function to stop the trace when the component unmounts
  return () => {
    performanceMonitor.stopTrace(`render_${componentName}`);
  };
};

// Helper function to measure API call time
export const measureApiCall = async <T>(
  endpoint: string,
  method: string,
  apiCall: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.measureAsync(
    `api_${method.toLowerCase()}_${endpoint.replace(/\//g, '_')}`,
    apiCall,
    {
      endpoint,
      method,
      type: 'api'
    }
  );
};

// Helper function to measure task operation time
export const measureTaskOperation = async <T>(
  operation: string,
  taskId: string | undefined,
  taskOperation: () => Promise<T>
): Promise<T> => {
  return performanceMonitor.measureAsync(
    `task_${operation}`,
    taskOperation,
    {
      operation,
      taskId: taskId || 'new',
      type: 'task'
    }
  );
}; 