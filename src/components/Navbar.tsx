// components/Navbar.tsx
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
    <div className="container mx-auto flex justify-center p-4">
      <table className="border-collapse border border-gray-500">
        <tbody>
          <tr>
            <td className="border border-gray-500 p-2">
              <Link href="/">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Home
                </button>
              </Link>
            </td>
            <td className="border border-gray-500 p-2">
              <Link href="/profile">
                <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
                  Profil
                </button>
              </Link>
            </td>
            <td className="border border-gray-500 p-2">
              <Link href="/market">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Market
                </button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    </nav>
  );
};

export default Navbar;