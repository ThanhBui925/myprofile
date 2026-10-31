require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Company = require('../models/Company');
const Service = require('../models/Service');
const Project = require('../models/Project');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Partner = require('../models/Partner');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([
    Admin.deleteMany({}),
    Company.deleteMany({}),
    Service.deleteMany({}),
    Project.deleteMany({}),
    Product.deleteMany({}),
    Banner.deleteMany({}),
    Partner.deleteMany({}),
  ]);

  // Create admin
  const adminExists = await Admin.findOne({ username: 'admin' });
  if (!adminExists) {
    await Admin.create({
      username: 'admin',
      email: process.env.COMPANY_EMAIL || 'admin@thanhtdh.vn',
      password: await bcrypt.hash('Thanh2001@', 10),
      role: 'superadmin',
    });
    console.log(`✅ Admin created: admin / Thanh2001@`);
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // --- 2. COMPANY ---
  const companyCount = await Company.countDocuments();
  if (companyCount === 0) {
    const appName = process.env.APP_NAME || 'THANHTDH';
    await Company.create({
      aboutVi: `${appName} là công ty hàng đầu trong lĩnh vực tự động hóa công nghiệp tại Việt Nam, chuyên cung cấp các giải pháp tích hợp hệ thống tự động hóa, robot công nghiệp và trí tuệ nhân tạo cho sản xuất.`,
      aboutEn: `${appName} is a leading automation company in Vietnam, specializing in integrated industrial automation solutions, industrial robots, and AI-powered manufacturing systems.`,
      founded: '2015',
      visionVi: 'Trở thành đối tác tự động hóa hàng đầu Đông Nam Á vào năm 2030.',
      visionEn: 'To become the leading automation partner in Southeast Asia by 2030.',
      missionVi: 'Cung cấp giải pháp tự động hóa thông minh, nâng cao năng suất và chất lượng sản xuất.',
      missionEn: 'Delivering intelligent automation solutions that enhance productivity and manufacturing quality.',
      history: [
        { year: '2015', titleVi: 'Thành lập công ty', titleEn: 'Company Founded', descriptionVi: `${process.env.APP_NAME || 'THANHTDH'} được thành lập với 10 kỹ sư đầu tiên tại TP.HCM`, descriptionEn: `${process.env.APP_NAME || 'THANHTDH'} founded with 10 engineers in Ho Chi Minh City` },
        { year: '2017', titleVi: 'Mở rộng ra Hà Nội', titleEn: 'Expansion to Hanoi', descriptionVi: 'Khai trương văn phòng miền Bắc tại Hà Nội', descriptionEn: 'Opened northern branch office in Hanoi' },
        { year: '2019', titleVi: 'Đạt 100 dự án', titleEn: '100 Projects Milestone', descriptionVi: 'Hoàn thành dự án thứ 100 cho ngành điện tử', descriptionEn: 'Completed the 100th project in electronics industry' },
        { year: '2021', titleVi: 'Chứng nhận ISO 9001', titleEn: 'ISO 9001 Certified', descriptionVi: 'Nhận chứng nhận quản lý chất lượng ISO 9001:2015', descriptionEn: 'Received ISO 9001:2015 quality management certification' },
        { year: '2023', titleVi: 'Mở rộng quốc tế', titleEn: 'International Expansion', descriptionVi: 'Ký kết đối tác với các doanh nghiệp tại Singapore và Thái Lan', descriptionEn: 'Partnership agreements with companies in Singapore and Thailand' },
      ],
      address: process.env.COMPANY_ADDRESS || 'Trần Xá, KCN Yên Phong, Bắc Ninh',
      phone: process.env.COMPANY_PHONE || '+84 28 3812 3456',
      email: process.env.COMPANY_EMAIL || 'info@thanhtdh.vn',
    });
    console.log('✅ Company info seeded');
  }

  // Banners
  await Banner.create([
    { titleVi: 'Giải pháp tự động hóa thế hệ mới', titleEn: 'Next-Gen Automation Solutions', subtitleVi: 'Tối ưu quy trình sản xuất với công nghệ tiên tiến nhất', subtitleEn: 'Optimize your manufacturing with cutting-edge technology', imageUrl: '/uploads/images/banner1.jpg', order: 1, isActive: true },
    { titleVi: 'Robot & AI cho sản xuất thông minh', titleEn: 'Robots & AI for Smart Manufacturing', subtitleVi: 'Tích hợp robot công nghiệp và trí tuệ nhân tạo vào dây chuyền của bạn', subtitleEn: 'Integrate industrial robots and AI into your production line', imageUrl: '/uploads/images/banner2.jpg', order: 2, isActive: true },
  ]);
  console.log('✅ Banners seeded');

  // Services
  const services = await Service.create([
    { nameVi: 'Thiết kế máy tự động', nameEn: 'Custom Machine Design', icon: 'Settings', descriptionVi: 'Thiết kế và chế tạo máy tự động theo yêu cầu khách hàng, tối ưu hiệu suất sản xuất.', descriptionEn: 'Custom automated machine design and manufacturing, optimized for peak production performance.', technologies: ['CAD/CAM', 'SolidWorks', 'AutoCAD', 'CNC'], featuresVi: ['Thiết kế 3D chuyên nghiệp', 'Mô phỏng trước khi chế tạo', 'Bảo hành 12 tháng'], featuresEn: ['Professional 3D design', 'Pre-manufacturing simulation', '12-month warranty'], order: 1 },
    { nameVi: 'Machine Vision', nameEn: 'Machine Vision', icon: 'Eye', descriptionVi: 'Hệ thống thị giác máy tính kiểm tra chất lượng, nhận dạng và định vị sản phẩm tự động.', descriptionEn: 'Computer vision systems for quality inspection, recognition and automatic product positioning.', technologies: ['OpenCV', 'Deep Learning', 'Cognex', 'Basler Cameras'], featuresVi: ['Tốc độ kiểm tra cao', 'Độ chính xác 99.9%', 'AI-powered detection'], featuresEn: ['High inspection speed', '99.9% accuracy', 'AI-powered detection'], order: 2 },
    { nameVi: 'Lập trình PLC', nameEn: 'PLC Programming', icon: 'Cpu', descriptionVi: 'Lập trình và tích hợp PLC Siemens, Mitsubishi, Omron cho các hệ thống tự động hóa.', descriptionEn: 'Programming and integrating Siemens, Mitsubishi, Omron PLCs for automation systems.', technologies: ['Siemens S7', 'Mitsubishi FX', 'Omron CP', 'Ladder Logic', 'STL'], order: 3 },
    { nameVi: 'Tích hợp Robot', nameEn: 'Robot Integration', icon: 'Zap', descriptionVi: 'Tích hợp robot Fanuc, KUKA, ABB vào dây chuyền sản xuất, lập trình và tối ưu trajectory.', descriptionEn: 'Integrating Fanuc, KUKA, ABB robots into production lines, programming and optimizing trajectories.', technologies: ['FANUC', 'KUKA', 'ABB', 'Universal Robots', 'ROS'], order: 4 },
    { nameVi: 'AGV / AMR', nameEn: 'AGV / AMR Systems', icon: 'Truck', descriptionVi: 'Thiết kế và triển khai hệ thống xe tự hành AGV/AMR cho nhà máy và kho hàng thông minh.', descriptionEn: 'Design and deploy AGV/AMR autonomous vehicle systems for smart factories and warehouses.', technologies: ['SLAM', 'LiDAR', 'ROS2', 'Fleet Management'], order: 5 },
    { nameVi: 'Hệ thống SCADA', nameEn: 'SCADA Systems', icon: 'Monitor', descriptionVi: 'Xây dựng hệ thống giám sát và điều khiển SCADA, kết nối IoT và hiển thị dữ liệu real-time.', descriptionEn: 'Building SCADA monitoring and control systems, IoT connectivity and real-time data visualization.', technologies: ['WinCC', 'Wonderware', 'InfluxDB', 'Grafana', 'MQTT'], order: 6 },
  ]);
  console.log('✅ Services seeded');

  // Projects
  await Project.create([
    { titleVi: 'Dây chuyền lắp ráp điện tử tự động', titleEn: 'Automated Electronics Assembly Line', client: 'Samsung Vietnam', industryVi: 'Điện tử', industryEn: 'Electronics', technologies: ['PLC', 'Robot Integration', 'Machine Vision', 'SCADA'], descriptionVi: 'Tích hợp toàn bộ dây chuyền lắp ráp bo mạch điện tử với robot FANUC và hệ thống vision kiểm tra lỗi tự động.', descriptionEn: 'Full integration of electronics PCB assembly line with FANUC robots and automatic defect vision inspection system.', isFeatured: true, isNDA: false },
    { titleVi: 'Hệ thống AGV cho kho thông minh', titleEn: 'AGV System for Smart Warehouse', client: 'Vincom Logistics', industryVi: 'Logistics', industryEn: 'Logistics', technologies: ['AGV/AMR', 'SLAM', 'WMS Integration'], descriptionVi: 'Triển khai 20 xe AGV tự hành trong kho hàng 50,000m², tích hợp với hệ thống WMS.', descriptionEn: 'Deploy 20 autonomous AGVs in 50,000m² warehouse, integrated with WMS system.', isFeatured: true, isNDA: false },
    { titleVi: 'Dây chuyền đóng gói thực phẩm', titleEn: 'Food Packaging Automation Line', client: 'Masan Group', industryVi: 'Thực phẩm', industryEn: 'Food & Beverage', technologies: ['PLC Programming', 'Custom Machine Design', 'SCADA'], descriptionVi: 'Tự động hóa toàn bộ quy trình đóng gói với năng suất 5000 sản phẩm/giờ.', descriptionEn: 'Full automation of packaging process with 5000 products/hour capacity.', isFeatured: true, isNDA: false },
  ]);
  console.log('✅ Projects seeded');

  // Products
  await Product.create([
    { nameVi: 'Camera công nghiệp Basler', nameEn: 'Basler Industrial Camera', categoryVi: 'Camera công nghiệp', categoryEn: 'Industrial Camera', descriptionVi: 'Camera công nghiệp độ phân giải cao cho hệ thống Machine Vision.', descriptionEn: 'High-resolution industrial camera for Machine Vision systems.', specifications: [{ labelVi: 'Độ phân giải', labelEn: 'Resolution', value: '5 MP' }, { labelVi: 'Tốc độ khung hình', labelEn: 'Frame Rate', value: '60 fps' }, { labelVi: 'Giao tiếp', labelEn: 'Interface', value: 'GigE / USB3' }], order: 1 },
    { nameVi: 'Robot cánh tay FANUC LR Mate', nameEn: 'FANUC LR Mate Robot Arm', categoryVi: 'Robot công nghiệp', categoryEn: 'Industrial Robot', descriptionVi: 'Robot cánh tay 6 trục nhỏ gọn, lý tưởng cho lắp ráp và xử lý vật liệu.', descriptionEn: 'Compact 6-axis robot arm, ideal for assembly and material handling.', specifications: [{ labelVi: 'Tải trọng', labelEn: 'Payload', value: '7 kg' }, { labelVi: 'Tầm với', labelEn: 'Reach', value: '717 mm' }, { labelVi: 'Số trục', labelEn: 'Axes', value: '6' }], order: 2 },
    { nameVi: 'PLC Siemens S7-1500', nameEn: 'Siemens S7-1500 PLC', categoryVi: 'PLC', categoryEn: 'PLC', descriptionVi: 'Bộ điều khiển logic lập trình hiệu suất cao của Siemens cho ứng dụng công nghiệp.', descriptionEn: 'High-performance Siemens programmable logic controller for industrial applications.', specifications: [{ labelVi: 'CPU', labelEn: 'CPU', value: '1515-2 PN' }, { labelVi: 'Bộ nhớ', labelEn: 'Memory', value: '3 MB' }, { labelVi: 'Giao tiếp', labelEn: 'Interface', value: 'PROFINET' }], order: 3 },
    { nameVi: 'Băng tải công nghiệp', nameEn: 'Industrial Conveyor System', categoryVi: 'Băng tải', categoryEn: 'Conveyor', descriptionVi: 'Hệ thống băng tải điều chỉnh tốc độ biến tần, tải trọng cao.', descriptionEn: 'Variable-speed conveyor system with VFD control, heavy-duty capacity.', specifications: [{ labelVi: 'Tải trọng', labelEn: 'Load Capacity', value: '500 kg/m' }, { labelVi: 'Tốc độ', labelEn: 'Speed', value: '0.1 – 2 m/s' }, { labelVi: 'Chiều rộng', labelEn: 'Width', value: '300 – 1200 mm' }], order: 4 },
    { nameVi: 'Cảm biến tiệm cận Omron', nameEn: 'Omron Proximity Sensor', categoryVi: 'Cảm biến', categoryEn: 'Sensor', descriptionVi: 'Cảm biến tiệm cận điện cảm phát hiện kim loại trong môi trường công nghiệp.', descriptionEn: 'Inductive proximity sensor for metal detection in industrial environments.', specifications: [{ labelVi: 'Khoảng cách phát hiện', labelEn: 'Sensing Distance', value: '8 mm' }, { labelVi: 'Điện áp', labelEn: 'Voltage', value: '12-24 VDC' }, { labelVi: 'IP Rating', labelEn: 'IP Rating', value: 'IP67' }], order: 5 },
  ]);
  console.log('✅ Products seeded');

  // Partners
  await Partner.create([
    { name: 'FANUC', order: 1, isActive: true },
    { name: 'Siemens', order: 2, isActive: true },
    { name: 'KUKA', order: 3, isActive: true },
    { name: 'Basler', order: 4, isActive: true },
    { name: 'Omron', order: 5, isActive: true },
    { name: 'Mitsubishi Electric', order: 6, isActive: true },
  ]);
  console.log('✅ Partners seeded');

  console.log('\n🎉 Seed completed!');
  console.log(`Admin login: admin / Thanh2001@`);
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
