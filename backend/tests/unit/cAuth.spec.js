const { generateUniqueId, encryptPassword ,validatePassword } = require('../../src/util/cAuth');

describe('Generate Unique ID', () => {
    it('Should generate an unique id', () => {
        const id = generateUniqueId();
        expect(id).toHaveLength(8);
    });
});

describe('Encrypt password', () => {
    it('Should encrypt passord', () => {
       const encryptedPassword = encryptPassword('123456');
       expect(encryptedPassword).toHaveLength(60);
    });
});


describe('Validate password', () => {
    it('Should validate password', () => {
        const verifyPassword = '123456';
        const encryptedPassword = 
            '$2b$10$sobxoWWa7ufLrZ65CqMCeezOE7CjI212t9sg.2YbSVtAJ411kOP5O';
        const valitation = validatePassword(verifyPassword, encryptedPassword);
        expect(valitation).toBe(true);
    });
});


describe('Not validate password', () => {
    it('Should not validate wrong password', () => {
        const verifyPassword = '12345678';
        const encryptedPassword = 
            '$2b$10$sobxoWWa7ufLrZ65CqMCeezOE7CjI212t9sg.2YbSVtAJ411kOP5O';
        const valitation = validatePassword(verifyPassword, encryptedPassword);
        expect(valitation).toBe(false);
    });
});

describe('Encrypt and validate password', () => {
    it('Should encrypt a password and validate it', () => {
        const password = '123456';
        const encryptedPassword = encryptPassword(password);
        const validation = validatePassword(password, encryptedPassword);
        expect(validation).toBe(true);
    });
});
