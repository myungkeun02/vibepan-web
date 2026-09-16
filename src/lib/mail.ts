import { currentPresentation } from './api-client';
export const mailAvailable = () => currentPresentation().features.mail;
