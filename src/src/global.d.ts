export {};

declare global {
  interface Window {
    openMediaManagerForQuill?: (quillInstance: any) => void;
  }
}
