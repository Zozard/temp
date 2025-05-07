import { Client } from "pg";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();
const GOOGLE_CLIENT_ID = "505484307039-oo2uoi908rphpg284f683hib1ogi3nfl.apps.googleusercontent.com";


export async function initDatabase(): Promise<{client: Client, close: () => Promise<void>}> {
  const client = new Client({
    connectionString: process.env.POSTGRES_URL,
  });
  await client.connect();

  return {client,close:() => client.end()};
}


/**
 * Vérifie un token JWT Google et retourne l'email de l'utilisateur
 * @param token Le token JWT à vérifier
 * @returns L'email de l'utilisateur si le token est valide
 * @throws Error si le token est invalide
 */

export async function verifyGoogleToken(token: string): Promise<string> {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const userEmail = payload?.['email'];

    if (!userEmail) {
      throw new Error('Email non trouvé dans le token');
    }

    return userEmail;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    throw new Error('Token invalide ou expiré');
  }
}
