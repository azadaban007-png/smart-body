const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export const toFa = (value) =>
  String(value ?? "").replace(/\d/g, (d) => FA_DIGITS[d]).replace(/(\d|[۰-۹])\.(?=[۰-۹])/g, "$1٫");

export const normalizeDigits = (value = "") =>
  value.replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d)).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

export const joinFa = (items) =>
  items.length <= 1 ? items[0] || "" : `${items.slice(0, -1).join("، ")} و ${items[items.length - 1]}`;

export const sportsLabel = (sports = []) => joinFa(sports.map((s) => s.name));

export const formatDateFa = (iso) => new Date(iso).toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
