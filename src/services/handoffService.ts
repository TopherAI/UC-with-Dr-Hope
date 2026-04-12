import { HandoffState } from '../types/handoff';

/**
 * World-Class Researcher Handoff Protocol
 * Exports the day's intelligence to a .hope context file.
 */
export async function exportHandoff(state: HandoffState) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `Dr-Hope-Shift-Handoff-${state.date}.hope`,
      types: [{
        description: 'Dr. Hope Intelligence Context',
        accept: {'application/json': ['.hope']},
      }],
    });
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(state, null, 2));
    await writable.close();
    return true;
  } catch (err) {
    console.error("Handoff export failed", err);
    return false;
  }
}

/**
 * Imports a previous session to restore multi-model context.
 */
export async function importHandoff(): Promise<HandoffState | null> {
  try {
    const [fileHandle] = await window.showOpenFilePicker({
      types: [{
        description: 'Dr. Hope Intelligence Context',
        accept: {'application/json': ['.hope']},
      }],
    });
    const file = await fileHandle.getFile();
    const content = await file.text();
    return JSON.parse(content) as HandoffState;
  } catch (err) {
    console.warn("Handoff import cancelled or invalid file format.");
    return null;
  }
}
