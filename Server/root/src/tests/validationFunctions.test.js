// Additional test cases for validation functions
const { isEmailValid, isStrongPassword, isUsernameValid } = require('../validators/validationFunctions');
describe('Validation Functions', () => {


    // Test cases for isEmailValid function
  describe('isEmailValid', () => {
    it('should return true for a valid email', () => {
      const validEmail = 'test@example.com';
      expect(isEmailValid(validEmail)).toBe(true);
    });

    it('should return false for an invalid email', () => {
      const invalidEmail = 'invalidemail.com';
      expect(isEmailValid(invalidEmail)).toBe(false);
    });
  });

  // Test cases for isStrongPassword function
  describe('isStrongPassword', () => {
    it('should return true for a strong password', () => {
      const strongPassword = 'Abc123!@#';
      expect(isStrongPassword(strongPassword)).toBe(true);
    });

    it('should return false for a weak password', () => {
      const weakPassword = 'password';
      expect(isStrongPassword(weakPassword)).toBe(false);
    });
  });

  // Test cases for isUsernameValid function
  describe('isUsernameValid', () => {
    it('should return true for a valid username', () => {
      const validUsername = 'user123';
      expect(isUsernameValid(validUsername)).toBe(true);
    });

    it('should return false for an invalid username', () => {
      const invalidUsername = 'user!@#';
      expect(isUsernameValid(invalidUsername)).toBe(false);
    });
  });
  
    // Test cases for isEmailValid function
    describe('isEmailValid', () => {
      it('should return false for an empty email', () => {
        const emptyEmail = '';
        expect(isEmailValid(emptyEmail)).toBe(false);
      });
  
      it('should return false for an email with missing "@" symbol', () => {
        const emailWithoutAtSymbol = 'testexample.com';
        expect(isEmailValid(emailWithoutAtSymbol)).toBe(false);
      });
  
      it('should return false for an email with invalid domain', () => {
        const invalidDomainEmail = 'test@example';
        expect(isEmailValid(invalidDomainEmail)).toBe(false);
      });
  
    });
  
    // Test cases for isStrongPassword function
    describe('isStrongPassword', () => {
      it('should return false for a password with less than 8 characters', () => {
        const shortPassword = 'Abc123!';
        expect(isStrongPassword(shortPassword)).toBe(false);
      });
  
      it('should return false for a password without uppercase letters', () => {
        const passwordWithoutUpperCase = 'abc123!@#';
        expect(isStrongPassword(passwordWithoutUpperCase)).toBe(false);
      });
  
      it('should return false for a password without special characters', () => {
        const passwordWithoutSpecialChars = 'Abc12345';
        expect(isStrongPassword(passwordWithoutSpecialChars)).toBe(false);
      });
  
    });
  
    // Test cases for isUsernameValid function
    describe('isUsernameValid', () => {
      it('should return false for a username with less than 4 characters', () => {
        const shortUsername = 'us';
        expect(isUsernameValid(shortUsername)).toBe(false);
      });
  
      it('should return false for a username with special characters', () => {
        const usernameWithSpecialChars = 'user!@#';
        expect(isUsernameValid(usernameWithSpecialChars)).toBe(false);
      });
  
      it('should return true for a valid alphanumeric username', () => {
        const alphanumericUsername = 'user123';
        expect(isUsernameValid(alphanumericUsername)).toBe(true);
      });
  
    });
  });
  