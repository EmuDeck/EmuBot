import { createRequire } from 'node:module';

export interface Note {
    name: string;
    answer: string;
}
export interface Notes {
    notes: {
        [index: string]: Note;
    };
}
const require = createRequire(import.meta.url);
const NotesConfig: Notes = require('../../../config/notes.json');

export { NotesConfig };
