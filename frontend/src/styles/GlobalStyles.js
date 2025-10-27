import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.fontSizes.base};
    line-height: 1.6;
    color: ${props => props.theme.colors.gray[800]};
    background-color: ${props => props.theme.colors.gray[100]};
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: ${props => props.theme.spacing.md};
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['3xl']};
    color: ${props => props.theme.colors.primary};
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
    color: ${props => props.theme.colors.gray[800]};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
    color: ${props => props.theme.colors.gray[700]};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.md};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.colors.secondary};
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    border-radius: ${props => props.theme.borderRadius.md};
    transition: all 0.2s ease;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, textarea, select {
    font-family: inherit;
    border: 1px solid ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(124, 36, 124, 0.1);
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .card {
    background: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: ${props => props.theme.shadows.md};
    padding: ${props => props.theme.spacing.xl};
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
    font-weight: 500;
    text-decoration: none;
    border-radius: ${props => props.theme.borderRadius.md};
    transition: all 0.2s ease;

    &.btn-primary {
      background-color: ${props => props.theme.colors.primary};
      color: ${props => props.theme.colors.white};

      &:hover {
        background-color: ${props => props.theme.colors.gray[800]};
        transform: translateY(-1px);
        box-shadow: ${props => props.theme.shadows.lg};
      }
    }

    &.btn-secondary {
      background-color: ${props => props.theme.colors.secondary};
      color: ${props => props.theme.colors.white};

      &:hover {
        background-color: ${props => props.theme.colors.gray[700]};
        transform: translateY(-1px);
        box-shadow: ${props => props.theme.shadows.lg};
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
  }

  .grid {
    display: grid;
    gap: ${props => props.theme.spacing.lg};

    &.grid-2 {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    &.grid-3 {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    &.grid-4 {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }
  }

  .flex {
    display: flex;

    &.flex-col {
      flex-direction: column;
    }

    &.items-center {
      align-items: center;
    }

    &.justify-center {
      justify-content: center;
    }

    &.justify-between {
      justify-content: space-between;
    }

    &.gap-sm {
      gap: ${props => props.theme.spacing.sm};
    }

    &.gap-md {
      gap: ${props => props.theme.spacing.md};
    }

    &.gap-lg {
      gap: ${props => props.theme.spacing.lg};
    }
  }

  .text-center {
    text-align: center;
  }

  .text-primary {
    color: ${props => props.theme.colors.primary};
  }

  .text-secondary {
    color: ${props => props.theme.colors.secondary};
  }

  .text-success {
    color: ${props => props.theme.colors.success};
  }

  .text-warning {
    color: ${props => props.theme.colors.warning};
  }

  .text-danger {
    color: ${props => props.theme.colors.danger};
  }

  .mb-0 { margin-bottom: 0; }
  .mb-1 { margin-bottom: ${props => props.theme.spacing.xs}; }
  .mb-2 { margin-bottom: ${props => props.theme.spacing.sm}; }
  .mb-3 { margin-bottom: ${props => props.theme.spacing.md}; }
  .mb-4 { margin-bottom: ${props => props.theme.spacing.lg}; }
  .mb-5 { margin-bottom: ${props => props.theme.spacing.xl}; }

  .mt-0 { margin-top: 0; }
  .mt-1 { margin-top: ${props => props.theme.spacing.xs}; }
  .mt-2 { margin-top: ${props => props.theme.spacing.sm}; }
  .mt-3 { margin-top: ${props => props.theme.spacing.md}; }
  .mt-4 { margin-top: ${props => props.theme.spacing.lg}; }
  .mt-5 { margin-top: ${props => props.theme.spacing.xl}; }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .container {
      padding: 0 ${props => props.theme.spacing.sm};
    }

    .card {
      padding: ${props => props.theme.spacing.lg};
    }

    .grid.grid-2,
    .grid.grid-3,
    .grid.grid-4 {
      grid-template-columns: 1fr;
    }
  }
`;

export default GlobalStyles;
