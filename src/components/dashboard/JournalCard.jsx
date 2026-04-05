function JournalCard({ theme, journalPrompt, journalText, journalStatus, setJournalText, onSaveJournal }) {
  return (
    <section className="dashboard__journal-card" style={{ borderColor: theme.cardBorder }}>
      <div className="dashboard__journal-head">
        <p className="dashboard__mood-label">Journal</p>
        <p className="dashboard__journal-prompt">{journalPrompt}</p>
      </div>

      <label className="dashboard__journal-field" htmlFor="journal-entry">
        <span className="dashboard__journal-label">A few honest words are enough.</span>
        <textarea
          id="journal-entry"
          className="dashboard__journal-input"
          placeholder="Write whatever feels true right now..."
          value={journalText}
          onChange={(evt) => setJournalText(evt.target.value)}
          rows={6}
        />
      </label>

      <div className="dashboard__journal-footer">
        <p className="dashboard__journal-status">{journalStatus}</p>
        <button
          type="button"
          className="dashboard__journal-save"
          onClick={onSaveJournal}
        >
          Save note
        </button>
      </div>
    </section>
  );
}

export default JournalCard;