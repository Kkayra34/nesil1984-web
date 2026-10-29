import { describe, expect, it } from "vitest";
import { parseRequestForm } from "./request-form";

function form(values: Record<string, string>) {
  const f = new FormData();
  for (const [k, v] of Object.entries(values)) f.set(k, v);
  return f;
}

const ok = {
  name: "Ayşe Yılmaz",
  phone: "0532 111 22 33",
  productType: "İsim kolyesi",
  details: "14 ayar, 'Defne' yazan kolye istiyorum.",
  consent: "on",
};

describe("parseRequestForm", () => {
  it("geçerli talebi kabul eder ve telefonu düzenler", () => {
    const r = parseRequestForm(form({ ...ok, metal: "K14", email: "A@B.com", referenceUrl: "instagram.com/p/x" }));
    expect(r).toEqual({
      data: {
        name: "Ayşe Yılmaz",
        phone: "05321112233",
        email: "a@b.com",
        productType: "İsim kolyesi",
        metal: "K14",
        details: ok.details,
        referenceUrl: "https://instagram.com/p/x",
      },
    });
  });

  it("e-posta, ayar ve bağlantı isteğe bağlı", () => {
    const r = parseRequestForm(form(ok));
    expect(r).toMatchObject({ data: { email: null, metal: null, referenceUrl: null } });
  });

  it.each([
    ["kısa ad", { name: "Al" }],
    ["bozuk telefon", { phone: "123" }],
    ["bilinmeyen tür", { productType: "Araba" }],
    ["kısa açıklama", { details: "kolye" }],
    ["bozuk e-posta", { email: "abc" }],
    ["bozuk bağlantı", { referenceUrl: "not a url" }],
    ["onay yok", { consent: "" }],
  ])("%s reddedilir", (_, patch) => {
    expect(parseRequestForm(form({ ...ok, ...patch }))).toHaveProperty("error");
  });
});
