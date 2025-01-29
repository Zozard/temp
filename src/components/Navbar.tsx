// components/Navbar.tsx
import Link from "next/link";

const Navbar = () => {
  return (
    <nav>
      <table>
        <tbody>
          <tr>
            <td>
              <Link href="/">
                <button>Home</button>
              </Link>
            </td>
            <td>
              <Link href="/profile">
                <button>Profil</button>
              </Link>
            </td>
            <td>
              <Link href="/market">
                <button>Market</button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </nav>
  );
};

export default Navbar;
