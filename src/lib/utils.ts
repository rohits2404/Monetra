export { cn } from "cn";

export function convertAmountFromMiliunits(amount: number) {
    return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
    return Math.round(amount * 1000);
}
