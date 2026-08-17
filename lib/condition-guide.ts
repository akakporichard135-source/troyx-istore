import type { ProductCondition } from "@/types";

export const productionConditions = [
  "Brand New",
  "UK Used",
  "Excellent",
  "Very Good",
  "To Confirm"
] as const;

export function normalizeConditionLabel(condition?: string) {
  if (!condition) return "To Confirm";
  if (condition === "New") return "Brand New";
  if (condition === "Used") return "UK Used";
  return condition;
}

export function getConditionSummary(condition?: ProductCondition | string) {
  const normalized = normalizeConditionLabel(condition);

  const summaries: Record<string, string> = {
    "Brand New":
      "Factory-fresh or sealed stock with catalogue imagery, warranty guidance, and configuration confirmation before purchase.",
    "UK Used":
      "Imported pre-owned devices checked for function, cosmetic grade, storage, and battery health before recommendation.",
    Excellent:
      "Very clean used condition with minimal visible wear and strong expected battery guidance where relevant.",
    "Very Good":
      "Good everyday used condition with clear notes on visible wear, battery expectations, and final inspection.",
    "To Confirm":
      "Enquiry-only availability where final condition, price, stock, or photos are confirmed directly before purchase.",
    Refurbished:
      "Professionally checked stock with service history or replacement parts explained before purchase."
  };

  return summaries[normalized] || summaries["To Confirm"];
}

export function isUsedCondition(condition?: ProductCondition | string) {
  const normalized = normalizeConditionLabel(condition);
  return ["UK Used", "Excellent", "Very Good", "Used"].includes(normalized);
}
