import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-sm text-gray-600">
      <p>© {new Date().getFullYear()} DevJournal. All rights reserved.</p>
      <p className="mt-1">Built with ❤️ using React & Firebase</p>
    </footer>
  );
}

export default Footer;
