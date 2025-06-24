import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../constants';
import Button from '../Common/Button';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
          <i className="fas fa-lightbulb mr-2"></i> {APP_NAME}
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Trang chủ</Link>
          <Link to="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Dự án của tôi</Link>
          <Link to="/new-project" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Tạo dự án mới</Link>
          <Link to="/pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Bảng giá</Link>
          {/* Mock login button for now */}
          <Button size="sm" variant="primary" onClick={() => alert('Chức năng đăng nhập/đăng ký đang được phát triển.')}>
            Đăng nhập
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;