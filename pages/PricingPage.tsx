
import React from 'react';
import Button from '../components/Common/Button';
import Card from '../components/Common/Card';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  billingCycle: string;
  description: string;
  features: PlanFeature[];
  isPopular?: boolean;
  ctaText: string;
}

const plans: PricingPlan[] = [
  {
    name: "Miễn phí",
    price: "0đ",
    billingCycle: "mãi mãi",
    description: "Trải nghiệm cơ bản, phù hợp cho khách hàng cuối tham khảo.",
    features: [
      { text: "Tạo tối đa 1 dự án", included: true },
      { text: "Xem thiết kế mẫu", included: true },
      { text: "Gợi ý concept cơ bản", included: true },
      { text: "Tính toán chiếu sáng hạn chế", included: false },
      { text: "Xuất báo cáo cơ bản", included: false },
      { text: "Truy cập catalogue đầy đủ", included: false },
    ],
    ctaText: "Bắt đầu miễn phí"
  },
  {
    name: "Tiêu chuẩn",
    price: "299.000đ",
    billingCycle: "/ tháng",
    description: "Dành cho tư vấn viên và nhà thiết kế cá nhân.",
    isPopular: true,
    features: [
      { text: "Tạo dự án không giới hạn", included: true },
      { text: "Tính toán chiếu sáng đầy đủ", included: true },
      { text: "Truy cập catalogue sản phẩm đầy đủ", included: true },
      { text: "Xuất báo cáo chi tiết", included: true },
      { text: "Lưu trữ dự án", included: true },
      { text: "Hỗ trợ cơ bản", included: true },
    ],
    ctaText: "Chọn gói Tiêu chuẩn"
  },
  {
    name: "Doanh nghiệp",
    price: "Liên hệ",
    billingCycle: "",
    description: "Giải pháp toàn diện cho công ty thiết kế và đội nhóm lớn.",
    features: [
      { text: "Tất cả tính năng gói Tiêu chuẩn", included: true },
      { text: "Quản lý đội nhóm & phân quyền", included: true },
      { text: "Truy cập API (tùy chọn)", included: true },
      { text: "Tính năng tùy chỉnh theo yêu cầu", included: true },
      { text: "Hỗ trợ ưu tiên", included: true },
      { text: "Branding tùy chỉnh", included: true },
    ],
    ctaText: "Liên hệ tư vấn"
  },
];

const PricingPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-6">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Bảng giá dịch vụ</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Chọn gói phù hợp với nhu cầu của bạn và bắt đầu hành trình thiết kế chiếu sáng chuyên nghiệp.</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col ${plan.isPopular ? 'border-2 border-blue-500 shadow-2xl relative' : 'shadow-lg'}`}
              bodyClassName="flex flex-col flex-grow p-8"
            >
              {plan.isPopular && (
                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  PHỔ BIẾN NHẤT
                </div>
              )}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
              <p className="text-gray-500 mb-4 h-16">{plan.description}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                {plan.billingCycle && <span className="text-gray-500 ml-1">{plan.billingCycle}</span>}
              </div>

              <ul className="space-y-3 mb-8 text-sm flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    {feature.included ? (
                      <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    ) : (
                      <i className="fas fa-times-circle text-gray-400 mr-2"></i>
                    )}
                    <span className={feature.included ? 'text-gray-700' : 'text-gray-500 line-through'}>{feature.text}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                variant={plan.isPopular ? 'primary' : 'ghost'} 
                className="w-full mt-auto py-3"
                onClick={() => alert(`Đăng ký ${plan.name}`)}
              >
                {plan.ctaText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Cần giải pháp tùy chỉnh?</h3>
            <p className="text-gray-600 mb-4">Chúng tôi sẵn sàng thảo luận về các yêu cầu đặc biệt của bạn.</p>
            <Button variant="secondary" onClick={() => alert('Liên hệ chúng tôi!')}>
                <i className="fas fa-envelope mr-2"></i> Liên hệ chúng tôi
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
