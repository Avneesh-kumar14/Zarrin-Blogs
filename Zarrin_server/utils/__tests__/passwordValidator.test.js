const { validatePassword } = require('../passwordValidator');

describe('Password Validator', () => {
  
  test('should accept valid passwords', () => {
    const result = validatePassword('ValidPass123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('should reject password shorter than 8 characters', () => {
    const result = validatePassword('Short1');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long');
  });

  test('should require uppercase letter', () => {
    const result = validatePassword('noupppercase123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain an uppercase letter');
  });

  test('should require lowercase letter', () => {
    const result = validatePassword('NOUPPPERCASE123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a lowercase letter');
  });

  test('should require number', () => {
    const result = validatePassword('NoNumbers');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain a number');
  });

  test('should catch multiple validation errors', () => {
    const result = validatePassword('short');
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });

  test('should accept passwords with special requirements met', () => {
    const validPasswords = [
      'Password123',
      'MySecurePass456',
      'Admin2024New',
      'Welcome123'
    ];

    validPasswords.forEach(password => {
      const result = validatePassword(password);
      expect(result.isValid).toBe(true);
    });
  });
});
