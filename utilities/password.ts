const ITERATIONS = 100000;
const HASH_ALGO = 'SHA-256';

/**
 * Hashes a password using PBKDF2 with a random salt.
 * Returns a string in the format "salt.hash" (base64 encoded).
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits'],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: HASH_ALGO,
    },
    passwordKey,
    256,
  );

  const saltBase64 = btoa(String.fromCharCode(...salt));
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));

  return `${saltBase64}.${hashBase64}`;
}

/**
 * Verifies a password against a stored hash.
 * Handles both the new "salt.hash" format and legacy plain-text comparison.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  // Simple check for legacy plain-text passwords (not containing a dot separator)
  if (!storedHash.includes('.')) {
    return password === storedHash;
  }

  const [saltBase64, hashBase64] = storedHash.split('.');
  if (!saltBase64 || !hashBase64) return false;

  try {
    const salt = Uint8Array.from(atob(saltBase64), (c) => c.charCodeAt(0));
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits'],
    );
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: HASH_ALGO,
      },
      passwordKey,
      256,
    );

    const currentHashBase64 = btoa(
      String.fromCharCode(...new Uint8Array(derivedBits)),
    );
    return currentHashBase64 === hashBase64;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}
