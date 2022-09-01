import { createRequire } from 'node:module';

export interface Category {
    name: string;
    entries: Notes;
}

export interface Note {
    name: string;
    answer: string;
}
export interface Notes {
    categories?: {
        [index: string]: Category;
    };
    notes: {
        [index: string]: Note;
    };
}
const require = createRequire(import.meta.url);
const NotesConfig: Notes = require('../../../config/notes.json');
let NotesCache: {
    [index: string]: Note;
} = {};

export { NotesConfig, NotesCache };
