import React from "react";

const STORAGE_KEY = "nextstack.workspace.note";

export function DashboardHome() {
  const [note, setNote] = React.useState("");
  const [savedNote, setSavedNote] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      setSavedNote(existing);
      setNote(existing);
    }
  }, []);

  function handleSave(event: React.FormEvent) {
    event.preventDefault();

    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, note);
    setSavedNote(note);
  }

  return (
    <section>
      <h2>Workspace note</h2>
      <form onSubmit={handleSave}>
        <label htmlFor="workspace-note">Note</label>
        <textarea
          id="workspace-note"
          data-testid="workspace-note-input"
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <button type="submit" data-testid="workspace-note-save">
          Save note
        </button>
      </form>
      {savedNote && (
        <p data-testid="workspace-note-display">{savedNote}</p>
      )}
    </section>
  );
}

