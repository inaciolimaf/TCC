export interface OccurrenceRes {
    id: string;
    isInDanger: boolean;
    reason: "PANIC_BUTTON" | "FALL";
    creationDate: Date;
}
