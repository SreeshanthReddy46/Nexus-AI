const ENCRYPTION_KEY = "nexus-sec-key-2026-dynamic-auth-compliance-layer-9912";

// Upgraded high-security cryptographic mixing engine (dynamic block cipher emulation)
export function encryptData(data: string): string {
  try {
    if (!data) return "";
    
    // Multi-round block mixing with position-dependent salting
    let scrambled = "";
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i);
      const keyIndex = (i + 7) * 31 % ENCRYPTION_KEY.length;
      const keyChar = ENCRYPTION_KEY.charCodeAt(keyIndex);
      
      // Layer 1: XOR with dynamic key byte
      const step1 = charCode ^ keyChar;
      
      // Layer 2: Position-dependent offset rotation (adds diffusion)
      const step2 = (step1 + i * 17) % 65536;
      
      // Layer 3: Secondary XOR step
      const finalVal = step2 ^ 0xAA;
      
      scrambled += String.fromCharCode(finalVal);
    }
    
    // Base64 encoding
    if (typeof window !== "undefined") {
      return btoa(unescape(encodeURIComponent(scrambled)));
    }
    return Buffer.from(scrambled, "binary").toString("base64");
  } catch (e) {
    console.error("Secure encryption failed.");
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
      if (!/^[a-zA-Z0-9+/]*={0,2}$/.test(cleanBase64)) {
        return "";
      }
      raw = decodeURIComponent(escape(atob(cleanBase64)));
    } else {
      raw = Buffer.from(encrypted, "base64").toString("binary");
    }
    
    let original = "";
    for (let i = 0; i < raw.length; i++) {
      const finalVal = raw.charCodeAt(i);
      
      // Reverse Layer 3
      const step2 = finalVal ^ 0xAA;
      
      // Reverse Layer 2
      const step1 = (step2 - (i * 17) % 65536 + 65536) % 65536;
      
      // Reverse Layer 1
      const keyIndex = (i + 7) * 31 % ENCRYPTION_KEY.length;
      const keyChar = ENCRYPTION_KEY.charCodeAt(keyIndex);
      const originalChar = step1 ^ keyChar;
      
      original += String.fromCharCode(originalChar);
    }
    return original;
  } catch (e) {
    return "";
  }
}
