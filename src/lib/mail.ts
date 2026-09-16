import { currentPresentation } from './api-client';
export const mailAvailable = async () => (await currentPresentation()).features.mail;
