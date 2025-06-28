import logo from '../assets/logo-mulher-segura.png';

interface HeaderProps {
    nomeUsuario: string;
  }
  
  const Header: React.FC<HeaderProps> = ({ nomeUsuario }) => {
    return (
      <header className="flex items-center justify-between p-2 bg-blue-500">
        <img src={logo.src} alt="Logo Mulher Segura" className="h-20" />
        <span className="text-white">Olá, {nomeUsuario}</span>
      </header>
    );
  };
  
  export default Header;