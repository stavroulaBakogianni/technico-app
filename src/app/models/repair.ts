import { Property } from "./property";
import { RepairStatus } from "./repairStatus.enum";
import { RepairType } from "./repairType.enum";

export interface Repair {
    id?: number;
    repairType: RepairType;
    shortDescription?: string; 
    submissionDate?: string;
    description?: string; 
    proposedStartDate?: string; 
    proposedEndDate?: string; 
    proposedCost?:number;
    acceptanceStatus?: boolean; 
    repairStatus?: RepairStatus;
    actualStartDate?: string; 
    actualEndDate?: string; 
    isDeleted?: boolean;
    property: Property; 
}