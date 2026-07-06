import { LogOut } from "lucide-react";
type HeaderProps = {
  onLogout?: () => void;
};

function Header({ onLogout }: HeaderProps) {
  return (
    <header className="header header-row">
      <div>
        <h1>Task Manager</h1>
        <p>Track and manage your daily tasks</p>
      </div>
      {onLogout ? (
        <button className="logout-btn" type="button" onClick={onLogout}>
          <LogOut size={15} />
          Log out
        </button>
      ) : null}
    </header>
  );
}

export default Header;
