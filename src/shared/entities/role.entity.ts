
export class Role {
    id: number; // Primary key, auto-incremented

    name: string; //

    permissions: Permissions[];

    users: any[]

    constructor(partial: Partial<Role>) {
        Object.assign(this, partial);
    }

}