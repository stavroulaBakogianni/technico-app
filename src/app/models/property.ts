import { PropertyType } from "./propertyType.enum";
import { Repair } from "./repair";
import { User } from "./user";

export interface Property {
    id?: number;
    e9: string; 
    propertyAddress: string;
    constructionYear: number; 
    propertyType: PropertyType;
    isDeleted?: boolean; 
    user: User; 
    repairs: Repair[];
}