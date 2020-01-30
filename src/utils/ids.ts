import uuid from 'uuid';
export const ID_START = 'uuid'; // id or other attr need start with letter not number
export const ROOT_ID = 'root-xxx';
export const generateId = () => ID_START + uuid();
