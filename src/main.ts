import "./style.css";
import { CHECKOUT_URL, PRICE_TEXT, PRODUCT_NAME } from "./config";

type Lead = {
  email: string;
  createdAt: string;
};

const LEADS_KEY = "ntb_leads_v1";

const track = (eventName: string, payload: Record<string, unknown> = {}) => {
  // Placeholder analytics hook
  console.log(`[track] ${eventName}`, payload);
};

const setTextContent = (selector: string, value: string) => {
  document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    el.textContent = value;
  });
};

const setCheckoutLinks = () => {
  document
    .querySelectorAll<HTMLAnchorElement>("[data-checkout]")
    .forEach((anchor) => {
      anchor.href = CHECKOUT_URL;
      anchor.addEventListener("click", () => track("checkout_click"));
    });
};

const loadLeads = (): Lead[] => {
  const raw = localStorage.getItem(LEADS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Lead[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

const saveLeads = (leads: Lead[]) => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

const addLead = (email: string) => {
  const leads = loadLeads();
  leads.push({ email, createdAt: new Date().toISOString() });
  saveLeads(leads);
};

const buildCsv = (leads: Lead[]) => {
  const header = "email,created_at";
  const rows = leads.map((lead) =>
    [lead.email, lead.createdAt]
      .map((value) => `"${value.replaceAll("\"", '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "absolute";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  const success = document.execCommand("copy");
  document.body.removeChild(textArea);
  return success;
};

const initEmailCapture = () => {
  const form = document.querySelector<HTMLFormElement>("[data-email-form]");
  const status = document.querySelector<HTMLElement>("[data-email-status]");
  const copyButton = document.querySelector<HTMLButtonElement>("[data-copy-csv]");
  if (!form || !status || !copyButton) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector<HTMLInputElement>("input[name='email']");
    if (!input || !input.validity.valid) {
      status.textContent = "Please enter a valid email.";
      status.classList.add("is-error");
      return;
    }

    addLead(input.value.trim());
    status.textContent = "Saved! You can export via the Copy CSV button.";
    status.classList.remove("is-error");
    input.value = "";
    track("email_captured");
  });

  copyButton.addEventListener("click", async () => {
    const leads = loadLeads();
    if (!leads.length) {
      status.textContent = "No emails yet. Capture one first.";
      status.classList.add("is-error");
      return;
    }
    const csv = buildCsv(leads);
    try {
      const ok = await copyText(csv);
      if (ok) {
        status.textContent = `Copied ${leads.length} emails to clipboard.`;
        status.classList.remove("is-error");
        track("copy_csv", { count: leads.length });
      } else {
        status.textContent = "Could not copy automatically. Try again.";
        status.classList.add("is-error");
      }
    } catch (error) {
      status.textContent = "Clipboard permission blocked. Try again.";
      status.classList.add("is-error");
      track("copy_csv_failed", { error });
    }
  });
};

const boot = () => {
  setTextContent("[data-product-name]", PRODUCT_NAME);
  setTextContent("[data-price-text]", PRICE_TEXT);
  setCheckoutLinks();
  initEmailCapture();
};

boot();
