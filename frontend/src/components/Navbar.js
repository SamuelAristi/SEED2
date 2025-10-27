import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  background: ${props => props.theme.colors.white};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.theme.spacing.md} 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${props => props.theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: ${props => props.theme.fontSizes['2xl']};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.gray[700]};
  text-decoration: none;
  font-weight: 500;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.gray[100]};
  }

  &.active {
    color: ${props => props.theme.colors.primary};
    background-color: ${props => props.theme.colors.gray[100]};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const UserInfo = styled.span`
  color: ${props => props.theme.colors.gray[600]};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const LogoutButton = styled.button`
  background-color: ${props => props.theme.colors.danger};
  color: ${props => props.theme.colors.white};
  border: none;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.colors.gray[800]};
    transform: translateY(-1px);
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const AuthButton = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &.btn-primary {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};

    &:hover {
      background-color: ${props => props.theme.colors.gray[800]};
      transform: translateY(-1px);
    }
  }

  &.btn-outline {
    background-color: transparent;
    color: ${props => props.theme.colors.primary};
    border: 2px solid ${props => props.theme.colors.primary};

    &:hover {
      background-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};
    }
  }
`;

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">🌱 SEED</Logo>
        
        {isAuthenticated ? (
          <>
            <NavLinks>
              <NavLink 
                to="/dashboard" 
                className={isActive('/dashboard') ? 'active' : ''}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/crops" 
                className={isActive('/crops') ? 'active' : ''}
              >
                Cultivos
              </NavLink>
              <NavLink 
                to="/sensors" 
                className={isActive('/sensors') ? 'active' : ''}
              >
                Sensores
              </NavLink>
              <NavLink 
                to="/locations" 
                className={isActive('/locations') ? 'active' : ''}
              >
                Ubicaciones
              </NavLink>
              <NavLink 
                to="/reports" 
                className={isActive('/reports') ? 'active' : ''}
              >
                Reportes
              </NavLink>
              <NavLink 
                to="/ai-assistant" 
                className={isActive('/ai-assistant') ? 'active' : ''}
              >
                Asistente IA
              </NavLink>
            </NavLinks>
            
            <UserSection>
              <UserInfo>Hola, {user?.name}</UserInfo>
              <LogoutButton onClick={handleLogout}>
                Cerrar Sesión
              </LogoutButton>
            </UserSection>
          </>
        ) : (
          <AuthButtons>
            <AuthButton to="/login" className="btn-outline">
              Iniciar Sesión
            </AuthButton>
            <AuthButton to="/register" className="btn-primary">
              Registrarse
            </AuthButton>
          </AuthButtons>
        )}
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
