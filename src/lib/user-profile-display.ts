/** Split mixed expectations array from registration into labeled groups. */
export function splitProfileExpectations(expectations: string[]) {
  const gain: string[] = [];
  const help: string[] = [];
  const general: string[] = [];

  for (const item of expectations) {
    if (item.startsWith("získať: ")) {
      gain.push(item.slice("získať: ".length));
    } else if (item.startsWith("pomoc: ")) {
      help.push(item.slice("pomoc: ".length));
    } else {
      general.push(item);
    }
  }

  return { gain, help, general };
}

export function subscriptionPlanLabel(plan: string): string {
  switch (plan) {
    case "MONTHLY":
      return "Mesačné";
    case "YEARLY":
      return "Ročné";
    default:
      return "Žiadne";
  }
}

export function subscriptionStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Aktívne";
    case "CANCELLED":
      return "Zrušené";
    case "PAST_DUE":
      return "Po splatnosti";
    default:
      return "Neaktívne";
  }
}
