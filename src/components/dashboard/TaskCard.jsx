function TaskCard({ theme, tasks, taskInput, setTaskInput, onToggleTask, onDeleteTask, onAddTask }) {
  return (
    <section className="dashboard__tasks-card" style={{ borderColor: theme.cardBorder }}>
      <div className="dashboard__tasks-head">
        <p className="dashboard__mood-label">For Today</p>
        <p className="dashboard__tasks-intro">A small list for whatever you want to get through today.</p>
      </div>

      {tasks.length > 0 ? (
        <div className="dashboard__tasks-list">
          {tasks.map((task) => {
            return (
              <div key={task.id} className={`dashboard__task${task.done ? ' dashboard__task--done' : ''}`}>
                <label className="dashboard__task-main">
                  <input
                    type="checkbox"
                    className="dashboard__task-checkbox"
                    checked={task.done}
                    onChange={() => onToggleTask(task.id)}
                  />
                  <span className="dashboard__task-text">{task.text}</span>
                </label>
                <button
                  type="button"
                  className="dashboard__task-delete"
                  onClick={() => onDeleteTask(task.id)}
                  aria-label={`Delete task: ${task.text}`}
                >
                  remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="dashboard__tasks-empty">Nothing here yet. Add a task when you need one.</p>
      )}

      <div className="dashboard__task-creator">
        <input
          type="text"
          className="dashboard__task-input"
          placeholder="Add a task..."
          value={taskInput}
          onChange={(evt) => setTaskInput(evt.target.value)}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              evt.preventDefault();
              onAddTask();
            }
          }}
        />
        <button
          type="button"
          className="dashboard__task-add"
          onClick={onAddTask}
        >
          Add
        </button>
      </div>
    </section>
  );
}

export default TaskCard;