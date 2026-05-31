import type { CancerType } from "@prisma/client";

/** Shape shared by every model that has a `cancerTypes` list column. */
type CancerTypesWhere =
  | {
      OR: Array<
        | { cancerTypes: { isEmpty: true } }
        | { cancerTypes: { hasSome: CancerType[] } }
      >;
    }
  | Record<string, never>;

/**
 * Personalisation rules based on the user's chosen cancer type(s).
 *
 * Content semantics:
 *  - cancerTypes = []  → "general" content, relevant to everyone.
 *  - cancerTypes = [..] → targeted; relevant only to users who share a type.
 *
 * User semantics:
 *  - userTypes = []  → no preference set; sees everything (no filtering).
 *  - userTypes = [..] → mainly sees matching + general content.
 */

export function isRelevant(
  itemTypes: CancerType[],
  userTypes: CancerType[],
): boolean {
  if (userTypes.length === 0) return true; // user has no preference → see all
  if (itemTypes.length === 0) return true; // general content → everyone
  return itemTypes.some((t) => userTypes.includes(t));
}

/** 2 = direct match, 1 = general, 0 = targeted at other types. */
export function relevanceScore(
  itemTypes: CancerType[],
  userTypes: CancerType[],
): 0 | 1 | 2 {
  if (userTypes.length > 0 && itemTypes.some((t) => userTypes.includes(t))) {
    return 2;
  }
  if (itemTypes.length === 0) return 1;
  return 0;
}

/**
 * Prisma `where` fragment that keeps general + matching content and hides
 * content targeted only at other cancer types. Returns {} when the user has
 * no preference (no filtering needed).
 */
export function relevantWhere(userTypes: CancerType[]): CancerTypesWhere {
  if (userTypes.length === 0) return {};
  return {
    OR: [
      { cancerTypes: { isEmpty: true } },
      { cancerTypes: { hasSome: userTypes } },
    ],
  };
}

/** Sort matched content above general, preserving the incoming order otherwise. */
export function sortByRelevance<T extends { cancerTypes: CancerType[] }>(
  items: T[],
  userTypes: CancerType[],
): T[] {
  if (userTypes.length === 0) return items;
  return [...items].sort(
    (a, b) =>
      relevanceScore(b.cancerTypes, userTypes) -
      relevanceScore(a.cancerTypes, userTypes),
  );
}
