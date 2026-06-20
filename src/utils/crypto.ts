const ENCRYPTION_KEY = "nexus-sec-key-2026";

export function encryptData(data: string): string {
  try {
    let result = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    if (typeof window !== "undefined") {
      return btoa(unescape(encodeURIComponent(result)));
    }
    return Buffer.from(result, "binary").toString("base64");
  } catch (e) {
    console.error("Encryption failed.");
    return data;
  }
}

export function decryptData(encrypted: string): string {
  try {
    if (!encrypted) return "";
    
    // Handle legacy unencrypted JSON strings gracefully
    const trimmed = encrypted.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      return encrypted;
    }

    let raw = "";
    if (typeof window !== "undefined") {
      const cleanBase64 = encrypted.replace(/\s/g, "");
      // Check if it matches valid base64 pattern before executing atob
      if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(cleanBase64)) {
        return "";
      }
      raw = decodeURIComponent(escape(atob(cleanBase64)));
    } else {
      raw = Buffer.from(encrypted, "base64").toString("binary");
    }
    let result = "";
    for (let i = 0; i < raw.length; i++) {
      const charCode = raw.charCodeAt(i);
      const keyChar = ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length);
      result += String.fromCharCode(charCode ^ keyChar);
    }
    return result;
  } catch (e) {
    return "";
  }
}
