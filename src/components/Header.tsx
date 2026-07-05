type HeaderProps = {
  onLogout?: () => void;
};

function Header({ onLogout }: HeaderProps) {
  return (
    <header className="header">
      <div>
        <h1>Task Manager</h1>
        <p>Track and manage your daily tasks</p>
      </div>
      {onLogout ? (
        <button type="button" onClick={onLogout}>
          Cerrar sesión
        </button>
      ) : null}
    </header>
  );
}

export default Header;
