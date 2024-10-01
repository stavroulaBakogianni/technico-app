import { Property } from "./property";
import { Role } from "./role.enum";

export interface User {
    id?: number;
    vat: string;
    name: string;
    surname: string;
    address?: string;
    phoneNumber?: string;
    email: string;
    password: string;
    deleted?: boolean;
    role: Role;
    properties?:Property[];
}