
export class User {
    id: number; // Primary key, auto-incremented

    firstName: string; // User's first name

    lastName: string; // User's last name

    email: string; // Unique email for authentication and identification

    passwordHash: string; // Hashed password for secure authentication

    createdAt: Date; // Timestamp of when the user was created

    twoFA: boolean; // Two-factor authentication enabled/disabled

    roles: any[]; // Many-to-many relation to roles

    constructor(partial: Partial<User>) {
        Object.assign(this, partial);
    }
}
