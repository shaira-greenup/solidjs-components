/**
 * Reads the contents of a File object and returns it as a string.
 * This function is useful for reading files selected through file input elements.
 *
 * This doesn't require `use server` as it reads a browser File object.
 *
 * @param file - The File object to read from (typically from an input[type="file"] element)
 * @returns A Promise that resolves to the file contents as a string
 * @throws Will reject with an Error if the file cannot be read or is not a text file
 *
 * @example
 * ```typescript
 * const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
 * const file = fileInput.files?.[0];
 * if (file) {
 *   const content = await readTextFile(file);
 *   console.log(content);
 * }
 * ```
 */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Fetches and reads the contents of a text file from a given URL or file path.
 * This function uses the Fetch API to retrieve the file and return its contents as a string.
 * Runs on the server to avoid CORS issues and provide secure file access.
 *
 * @param filePath - The URL or path to the text file to read
 * @returns A Promise that resolves to the file contents as a string
 * @throws Will throw an Error if the file cannot be fetched or read
 *
 * @example
 * ```typescript
 * // Reading a local file in the public directory
 * const content = await readTextFileFromPath('/public/data.txt');
 *
 * // Reading from a remote URL
 * const remoteContent = await readTextFileFromPath('https://example.com/file.txt');
 * ```
 */
export async function readTextFileFromUrlPath(filePath: string): Promise<string> {
  "use server";
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Error reading file from path: ${error}`);
  }
}

import { promises as fs } from 'fs';
import * as path from 'path';

/**
 * Reads the contents of a text file from a given file path.
 * This function utilizes Node.js's fs module to read the file and return its contents as a string.
 * Runs on the server.
 *
 * @param filePath - The path to the text file to read
 * @returns A Promise that resolves to the file contents as a string
 * @throws Will throw an Error if the file cannot be read
 *
 * @example
 * ```typescript
 * // Reading a local file
 * const content = await readTextFileFromPath('/path/to/data.txt');
 * ```
 *
 * @example
 * ```tsx
 * // https://docs.solidjs.com/reference/basic-reactivity/create-resource
 * import { createResource, Suspense } from 'solid-js';
 * import { readTextFileFromPath } from './utils/fileReader'; // Adjust the path if necessary
 *
 * // Sample file path
 * const source = './src/routes/(layout)/static_chart.tsx';
 *
 * // Main Component
 * export default function FileContentDisplay() {
 *   // Load file content using `createResource`
 *   const [content] = createResource(source, readTextFileFromPath);
 *
 *   return (
 *     <div class="container mx-auto p-4">
 *       <h1 class="text-xl mb-4">Simple Chart Example</h1>
 *       <Suspense fallback={<p>Loading file...</p>}>
 *         <pre>{content()}</pre>
 *       </Suspense>
 *     </div>
 *   );
 * }
 * ```
 */
export async function readTextFileFromPath(filePath: string): Promise<string> {
  "use server";
  try {
    const absolutePath = path.resolve(filePath);
    const fileContents = await fs.readFile(absolutePath, 'utf-8');
    return fileContents;
  } catch (error) {
    throw new Error(`Error reading file from path: ${error.message}`);
  }
}
