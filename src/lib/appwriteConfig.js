import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Export the specific services we need
export const account = new Account(client);
export const databases = new Databases(client);

// We will add your Database ID and Collection IDs here later when we build Watchlists!