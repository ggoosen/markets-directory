// scripts/auth-manager.js - Fixed Authentication System
import fs from 'fs/promises';
import { existsSync } from 'fs';
import crypto from 'crypto';
import os from 'os';
import path from 'path';
import { createInterface } from 'readline';

class AuthManager {
  constructor() {
    this.configDir = path.join(os.homedir(), '.sa-markets');
    this.tokenFile = path.join(this.configDir, 'auth.json');
    this.encryptionKey = this.getOrCreateEncryptionKey();
  }

  async ensureConfigDir() {
    if (!existsSync(this.configDir)) {
      await fs.mkdir(this.configDir, { recursive: true, mode: 0o700 });
    }
  }

  getOrCreateEncryptionKey() {
    // Use a combination of machine-specific data for encryption
    const machineId = os.hostname() + os.platform() + os.arch();
    return crypto.createHash('sha256').update(machineId).digest();
  }

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedData) {
    try {
      const [ivHex, encrypted] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      throw new Error('Failed to decrypt stored credentials');
    }
  }

  async saveCredentials(email, password, token) {
    try {
      await this.ensureConfigDir();
      
      const credentials = {
        email: this.encrypt(email),
        password: this.encrypt(password),
        token: this.encrypt(token),
        timestamp: Date.now(),
        expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      };

      await fs.writeFile(this.tokenFile, JSON.stringify(credentials, null, 2), { mode: 0o600 });
      console.log('🔐 Credentials saved securely');
    } catch (error) {
      console.error('❌ Error saving credentials:', error.message);
    }
  }

  async loadCredentials() {
    try {
      if (!existsSync(this.tokenFile)) {
        return null;
      }

      const credentialsData = await fs.readFile(this.tokenFile, 'utf8');
      const credentials = JSON.parse(credentialsData);

      // Check if credentials are expired
      if (Date.now() > credentials.expiresAt) {
        await this.clearCredentials();
        return null;
      }

      return {
        email: this.decrypt(credentials.email),
        password: this.decrypt(credentials.password),
        token: this.decrypt(credentials.token),
        timestamp: credentials.timestamp,
        expiresAt: credentials.expiresAt
      };
    } catch (error) {
      console.error('❌ Error loading credentials:', error.message);
      await this.clearCredentials(); // Clear corrupted credentials
      return null;
    }
  }

  async clearCredentials() {
    try {
      if (existsSync(this.tokenFile)) {
        await fs.unlink(this.tokenFile);
        console.log('🗑️  Stored credentials cleared');
      }
    } catch (error) {
      console.error('❌ Error clearing credentials:', error.message);
    }
  }
}

// Fixed password input with better cross-platform support
class PasswordInput {
  static async getPassword(prompt = 'Password: ') {
    return new Promise((resolve) => {
      const rl = createInterface({
        input: process.stdin,
        output: process.stdout
      });

      process.stdout.write(prompt);
      
      let password = '';
      let stdin = process.stdin;
      
      // Hide input
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding('utf8');

      const onData = (char) => {
        switch (char) {
          case '\n':
          case '\r':
          case '\u0004': // Ctrl+D
            stdin.setRawMode(false);
            stdin.pause();
            stdin.removeListener('data', onData);
            rl.close();
            process.stdout.write('\n');
            resolve(password);
            break;
          case '\u0003': // Ctrl+C
            console.log('\n^C');
            process.exit(1);
            break;
          case '\u007f': // Backspace
          case '\b': // Backspace on Windows
            if (password.length > 0) {
              password = password.slice(0, -1);
              process.stdout.write('\b \b');
            }
            break;
          default:
            // Only accept printable characters
            if (char.charCodeAt(0) >= 32 && char.charCodeAt(0) < 127) {
              password += char;
              process.stdout.write('*');
            }
            break;
        }
      };

      stdin.on('data', onData);
    });
  }

  static async getInput(prompt) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      const answer = await new Promise((resolve) => {
        rl.question(prompt, (answer) => {
          resolve(answer);
        });
      });
      return answer.trim();
    } finally {
      rl.close();
    }
  }
}

export { AuthManager, PasswordInput };