/**
 * Service to manage in-browser WebAssembly Python execution via Pyodide.
 * Runs 100% in client WebAssembly sandbox — safe and fast without server code execution.
 */

const PYODIDE_CDN_SCRIPT = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js';
const PYODIDE_INDEX_URL = 'https://cdn.jsdelivr.net/pyodide/v0.27.2/full/';

export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTimeMs: number;
}

export type PyodideStatus = 'unloaded' | 'loading' | 'ready' | 'error';

let pyodideInstance: any = null;
let initPromise: Promise<any> | null = null;
let currentStatus: PyodideStatus = 'unloaded';
let statusListeners: Array<(status: PyodideStatus, message?: string) => void> = [];

export function subscribePyodideStatus(listener: (status: PyodideStatus, message?: string) => void) {
  statusListeners.push(listener);
  listener(currentStatus);
  return () => {
    statusListeners = statusListeners.filter((l) => l !== listener);
  };
}

function updateStatus(status: PyodideStatus, message?: string) {
  currentStatus = status;
  statusListeners.forEach((l) => l(status, message));
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return reject(new Error('Window not available'));
    }

    if ((window as any).loadPyodide) {
      return resolve();
    }

    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).loadPyodide) {
        return resolve();
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', (e) => reject(new Error('Failed to load Pyodide script: ' + e)), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to download Pyodide WebAssembly script from CDN. Please check your network connection.'));
    document.head.appendChild(script);
  });
}

/**
 * Initializes or returns the cached Pyodide WebAssembly instance.
 */
export async function getPyodideInstance(
  onProgress?: (msg: string) => void
): Promise<any> {
  if (pyodideInstance) {
    return pyodideInstance;
  }
  if (initPromise) {
    return initPromise;
  }

  updateStatus('loading', 'Loading Pyodide runtime script...');
  if (onProgress) onProgress('Loading Pyodide WebAssembly script from CDN...');

  initPromise = (async () => {
    try {
      await loadScript(PYODIDE_CDN_SCRIPT);

      if (typeof (window as any).loadPyodide !== 'function') {
        throw new Error('Pyodide script loaded, but window.loadPyodide is not defined.');
      }

      updateStatus('loading', 'Initializing WebAssembly Python 3.12...');
      if (onProgress) onProgress('Bootstrapping Python 3.12 WebAssembly environment...');

      const pyodide = await (window as any).loadPyodide({
        indexURL: PYODIDE_INDEX_URL,
      });

      pyodideInstance = pyodide;
      updateStatus('ready', 'Python 3.12 environment ready');
      if (onProgress) onProgress('Python environment ready.');
      return pyodide;
    } catch (err: any) {
      initPromise = null;
      pyodideInstance = null;
      const msg = err?.message || String(err);
      updateStatus('error', msg);
      throw err;
    }
  })();

  return initPromise;
}

/**
 * Executes Python code using Pyodide WebAssembly with stdout/stderr capture and timeout protection.
 */
export async function executePythonCode(
  code: string,
  onProgress?: (status: string) => void
): Promise<ExecutionResult> {
  const startTime = performance.now();

  try {
    const pyodide = await getPyodideInstance(onProgress);

    // Auto-detect and dynamically load required packages like pandas, numpy, etc.
    const needsPandas = code.includes('pandas') || code.includes('pd.');
    const needsNumpy = code.includes('numpy') || code.includes('np.');

    if (needsPandas || needsNumpy) {
      if (onProgress) onProgress('Checking & loading data packages (pandas/numpy)...');
      try {
        if (pyodide.loadPackagesFromImports) {
          await pyodide.loadPackagesFromImports(code);
        } else if (pyodide.loadPackage) {
          const pkgs: string[] = [];
          if (needsPandas) pkgs.push('pandas');
          if (needsNumpy) pkgs.push('numpy');
          await pyodide.loadPackage(pkgs);
        }
      } catch (pkgErr: any) {
        console.warn('Notice: Package autoloading note:', pkgErr?.message || pkgErr);
      }
    }

    if (onProgress) onProgress('Running script in Pyodide WebAssembly...');

    const stdoutList: string[] = [];
    const stderrList: string[] = [];

    pyodide.setStdout({
      batched: (msg: string) => {
        stdoutList.push(msg);
      },
    });

    pyodide.setStderr({
      batched: (msg: string) => {
        stderrList.push(msg);
      },
    });

    // 10-second timeout guard against infinite loops like while True
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Execution timed out (10s limit exceeded). Check for infinite while/for loops.'));
      }, 10000);
    });

    const executionPromise = pyodide.runPythonAsync(code);
    const result = await Promise.race([executionPromise, timeoutPromise]);

    const stdoutStr = stdoutList.join('\n').trim();
    const stderrStr = stderrList.join('\n').trim();

    let output = stdoutStr;
    if (stderrStr) {
      output = output ? `${output}\n\n[Stderr / Warning]:\n${stderrStr}` : stderrStr;
    }

    // If no stdout was produced, but the script evaluated to a non-undefined result (e.g., last expression `2 + 3`)
    if (!output && result !== undefined && result !== null) {
      try {
        output = String(result);
      } catch {
        // ignore
      }
    }

    if (!output) {
      output = '(Process finished with exit code 0. Use print() to display output on the console)';
    }

    const elapsed = Math.round(performance.now() - startTime);

    return {
      success: true,
      output,
      executionTimeMs: elapsed,
    };
  } catch (err: any) {
    const elapsed = Math.round(performance.now() - startTime);
    const errMsg = err?.message || String(err);

    return {
      success: false,
      output: errMsg,
      executionTimeMs: elapsed,
    };
  }
}
