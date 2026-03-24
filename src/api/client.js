const BASE = import.meta.env.VITE_API_URL || "";

async function fetchJSON(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

async function postJSON(path, data) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json();
}

// === Chapters ===
export const getChapters = () => fetchJSON("/api/chapters");
export const getChapter = (slug) => fetchJSON(`/api/chapters/${slug}`);

// === Glossary ===
export const getGlossary = (upToChapter) =>
  fetchJSON(`/api/glossary${upToChapter ? `?up_to_chapter=${upToChapter}` : ""}`);

// === Progress ===
export const getUserId = () => {
  let id = localStorage.getItem("cc_user_id");
  if (!id) {
    id = "user_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("cc_user_id", id);
  }
  return id;
};

export const getProgress = () => fetchJSON(`/api/progress/${getUserId()}`);

export const saveProgress = (chapterId, data) =>
  postJSON(`/api/progress/${getUserId()}/${chapterId}`, data);
