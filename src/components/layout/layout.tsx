import type { ReactNode } from 'react';
import '../../styles/layout.css';
interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <nav>
        <ul>
          <li>torneos</li>
          <li>tablon </li>
          <li>Contact</li>
        </ul>
      </nav>
      <main>{children}</main>
      <footer> Diseñado por </footer>
    </>
  );
}
