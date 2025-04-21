export interface OccurrenceReq {
    isInDanger: boolean;
    reason: "PANIC_BUTTON" | "FALL";
}
