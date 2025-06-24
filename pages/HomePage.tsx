
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';
import { APP_NAME } from '../constants';
import Card from '../components/Common/Card';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <header className="mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
          Chào mừng đến với <span className="text-blue-600">{APP_NAME}</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Công cụ hỗ trợ thiết kế chiếu sáng tự động, giúp bạn tạo ra các giải pháp chiếu sáng chuyên nghiệp, nhanh chóng và dễ dàng.
        </p>
      </header>

      <div className="mb-12">
        <img 
          src="https://picsum.photos/seed/lightinghero/1200/500" 
          alt="Thiết kế chiếu sáng hiện đại" 
          className="rounded-lg shadow-2xl mx-auto"
        />
      </div>

      <div className="mb-12">
        <Link to="/new-project">
          <Button size="lg" variant="primary" className="px-10 py-4 text-lg">
            <i className="fas fa-rocket mr-2"></i> Bắt đầu thiết kế ngay
          </Button>
        </Link>
      </div>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Tính năng nổi bật</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <Card title="Thiết kế trực quan" titleClassName="bg-blue-50" bodyClassName="min-h-[150px]">
            <div className="flex items-start">
              <i className="fas fa-drafting-compass text-3xl text-blue-500 mr-4 mt-1"></i>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Tải bản vẽ & Thiết kế</h3>
                <p className="text-gray-600 text-sm">Tải lên mặt bằng, xác định không gian và sở thích để nhận gợi ý thiết kế thông minh.</p>
              </div>
            </div>
          </Card>
          <Card title="Đề xuất thông minh" titleClassName="bg-green-50" bodyClassName="min-h-[150px]">
             <div className="flex items-start">
              <i className="fas fa-cogs text-3xl text-green-500 mr-4 mt-1"></i>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Sản phẩm & Tối ưu</h3>
                <p className="text-gray-600 text-sm">Tự động đề xuất sản phẩm phù hợp, tối ưu hóa số lượng và vị trí đèn, tính toán chi phí.</p>
              </div>
            </div>
          </Card>
          <Card title="Trực quan hóa & Báo cáo" titleClassName="bg-purple-50" bodyClassName="min-h-[150px]">
            <div className="flex items-start">
              <i className="fas fa-eye text-3xl text-purple-500 mr-4 mt-1"></i>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Concept & Xuất bản</h3>
                <p className="text-gray-600 text-sm">Xem concept chiếu sáng trên ảnh thực tế, xuất báo cáo chi tiết và chuyên nghiệp.</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-12 bg-gray-50 rounded-lg my-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Dành cho ai?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 text-center">
                <i className="fas fa-user-tie text-4xl text-blue-500 mb-3"></i>
                <h3 className="text-xl font-semibold text-gray-700">Nhà thiết kế</h3>
                <p className="text-gray-600 mt-1">Công cụ mạnh mẽ cho các dự án chuyên nghiệp.</p>
            </div>
            <div className="p-6 text-center">
                <i className="fas fa-headset text-4xl text-green-500 mb-3"></i>
                <h3 className="text-xl font-semibold text-gray-700">Tư vấn viên</h3>
                <p className="text-gray-600 mt-1">Tư vấn nhanh, trực quan hóa giải pháp cho khách hàng.</p>
            </div>
            <div className="p-6 text-center">
                <i className="fas fa-home text-4xl text-purple-500 mb-3"></i>
                <h3 className="text-xl font-semibold text-gray-700">Chủ nhà</h3>
                <p className="text-gray-600 mt-1">Tự khám phá ý tưởng chiếu sáng cho không gian sống.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
