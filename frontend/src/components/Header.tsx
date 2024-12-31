interface HeaderProps {
    nomeUsuario: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ nomeUsuario }) => {
    return (
      <header className="flex items-center justify-between p-4 bg-blue-500">
        <h1 className="text-xl font-bold text-white">Minha Aplicação</h1>
        <span className="text-white">Olá, {nomeUsuario}</span>
      </header>
    );
  };
  
  export default Header;