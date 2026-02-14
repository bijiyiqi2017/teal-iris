import { Injectable } from "@nestjs/common";

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class UsersService {
  private users: User[] = [];

  // Find a user by email
  findByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  // Create a new user
  createUser(email: string, name: string): User {
    const newUser: User = {
      id: (this.users.length + 1).toString(), // simple incremental ID
      email,
      name,
    };
    this.users.push(newUser);
    return newUser;
  }

  // List all users
  findAll(): User[] {
    return this.users;
  }
}
