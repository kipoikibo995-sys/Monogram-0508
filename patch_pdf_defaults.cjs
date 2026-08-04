const fs = require('fs');

let code = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Replace the fallback defaults with the new Vietnamese ones
code = code.replace(
  /const copyright = getParsed\('copyrightPage', \{[\s\S]*?\}\);/,
  `const copyright = getParsed('copyrightPage', {
    title: 'BẢN QUYỀN',
    year: '2026',
    author: 'Alan Parker',
    rights: 'Mọi quyền được bảo lưu.',
    description: 'Không phần nào của cuốn sách này được phép sao chép, lưu trữ trong hệ thống truy xuất hoặc truyền tải dưới bất kỳ hình thức hoặc phương tiện nào—điện tử, cơ học, sao chụp, ghi âm hoặc bằng cách khác—nếu không có sự cho phép bằng văn bản trước từ tác giả.',
    isbn: '9798188106522',
    imprint: 'Independently published'
  });`
);

code = code.replace(
  /const welcome = getParsed\('welcomePage', \{[\s\S]*?\}\);/,
  `const welcome = getParsed('welcomePage', {
    title: 'CHÀO MỪNG BẠN ĐẾN VỚI SÁCH TÔ MÀU ĐƠN SẮC',
    intro: 'Khám phá niềm vui thư giãn khi làm lộ ra tác phẩm nghệ thuật đơn sắc tuyệt đẹp—\\nmỗi lần một nét.\\nBên trong cuốn sách này, bạn sẽ khám phá 101 hình minh họa ẩn giấu, bao gồm\\nđộng vật hoang dã hùng vĩ, thú cưng đáng yêu, những chú chim đầy màu sắc và nhiều hơn nữa',
    howToTitle: 'CÁCH SỬ DỤNG CUỐN SÁCH NÀY',
    howToSteps: 'Mỗi ô vuông chứa một con số.\\n\\nGhép con số đó với ký hiệu\\nđược hiển thị trong phần chú giải bên dưới\\ncâu đố.\\n\\nSử dụng bút đen, tô kín mọi ô vuông\\nbằng ký hiệu chính xác.',
    penTitle: 'GỢI Ý BÚT TÔ',
    penIntro: 'Để có kết quả tốt nhất, chúng tôi\\ngợi ý:',
    penList: ['Bút kim (0.4–0.6 mm)', 'Bút gel đen', 'Bút bi đen'],
    penOutro: 'Tránh sử dụng bút dạ quang hoặc\\nbút dạ gốc cồn, vì chúng\\ncó thể bị thấm qua giấy.\\n\\nNếu bạn đang sử dụng loại bút nhiều mực,\\nhãy đặt một tờ giấy trắng đằng sau\\ntrang sách để bảo vệ câu đố tiếp theo.',
    legend: [
      { num: '0', title: 'DẤU CHẤM', desc: 'Chỉ chấm ở giữa', symbol: '•' },
      { num: '1', title: 'GẠCH CHÉO', desc: 'Một gạch chéo (/)', symbol: '/' },
      { num: '2', title: 'GẠCH CHÉO NGƯỢC', desc: 'Một gạch chéo ngược (\\\\)', symbol: '\\\\' },
      { num: '3', title: 'CHỮ X', desc: 'Dấu chéo (X)', symbol: '✕' },
      { num: '4', title: 'DẤU SAO', desc: 'Dấu sao (*)', symbol: '✱' },
      { num: '5', title: 'Ô VUÔNG ĐEN', desc: 'Tô đen toàn bộ ô vuông', symbol: '■' }
    ],
    illustrationImage: ''
  });`
);

code = code.replace(
  /const mystery = getParsed\('mystery', \{[\s\S]*?\}\);/,
  `const mystery = getParsed('mystery', {
    title: 'Bí ẩn #01',
    marks: [
      { mark: '•', code: '.', name: 'Dấu chấm', density: '75.4%' },
      { mark: '/', code: '1', name: 'Gạch chéo', density: '6.7%' },
      { mark: '\\\\', code: '2', name: 'Gạch chéo ngược', density: '2.3%' },
      { mark: '✕', code: '3', name: 'Chữ X', density: '1.3%' },
      { mark: '✱', code: '4', name: 'Dấu sao', density: '8.5%' },
      { mark: '■', code: '5', name: 'Ô vuông đen', density: '5.9%' }
    ]
  });`
);

code = code.replace(
  /const warmup = getParsed\('warmUpPractice', \{[\s\S]*?\}\);/,
  `const warmup = getParsed('warmUpPractice', {
    title: 'LUYỆN TẬP KHỞI ĐỘNG',
    subtitle: 'Trau dồi nét bút của bạn bằng cách luyện tập từng mã trong các ô dưới đây\\ntrước khi bắt đầu câu đố.',
    levels: [
        { label: 'MỨC 0: DẤU CHẤM', desc: 'Luyện tập vẽ "Chỉ chấm ở giữa" trong các ô này:', hint: '•' },
        { label: 'MỨC 1: GẠCH CHÉO', desc: 'Luyện tập vẽ "Một gạch chéo (/)" trong các ô này:', hint: '1' },
        { label: 'MỨC 2: GẠCH CHÉO NGƯỢC', desc: 'Luyện tập vẽ "Một gạch chéo ngược (\\\\)" trong các ô này:', hint: '2' },
        { label: 'MỨC 3: CHỮ X', desc: 'Luyện tập vẽ "Dấu chéo (X)" trong các ô này:', hint: '3' },
        { label: 'MỨC 4: DẤU SAO', desc: 'Luyện tập vẽ "Dấu sao (*)" trong các ô này:', hint: '4' },
        { label: 'MỨC 5: Ô VUÔNG ĐEN', desc: 'Luyện tập vẽ "Tô đen toàn bộ ô vuông" trong các ô này:', hint: '5' }
    ]
  });`
);

code = code.replace(
  /const pentesting = getParsed\('penTestingLab', \{[\s\S]*?\}\);/,
  `const pentesting = getParsed('penTestingLab', {
    title: 'TRANG THỬ BÚT',
    subtitle: 'Hãy thử bút kim, bút gel đen hoặc bút bi đen của bạn dưới đây.\\nSo sánh mức độ thấm mực và độ đậm nhạt.',
    pens: ['BÚT #1:', 'BÚT #2:', 'BÚT #3:', 'BÚT #4:'],
    gridsTitle: 'CÁC Ô LUYỆN TẬP NHỎ'
  });`
);

code = code.replace(
  /const thankyou = getParsed\('thankyou', \{[\s\S]*?\}\);/,
  `const thankyou = getParsed('thankyou', {
    title: 'Cảm ơn bạn đã tô màu cùng chúng tôi',
    heading1: 'Bạn đã khám phá ra bí ẩn — Thật tuyệt vời!',
    body1: 'Bạn đã vượt qua mọi sinh vật ẩn giấu, mọi bí mật mờ ảo, mọi bất ngờ đáng sợ.\\nĐiều đó đòi hỏi sự kiên nhẫn, sự tập trung và một đôi tay vô cùng vững vàng.',
    heading2: 'Có điều gì làm bạn mỉm cười không? Có làm bạn ngạc nhiên không? Có làm bạn rùng mình (theo một cách tuyệt vời nhất) không?',
    body2: 'Một đánh giá chân thành trên Amazon, dù chỉ một câu ngắn gọn — cũng giúp những người yêu thích câu đố khác tìm thấy cuốn sách này và giúp bộ truyện này tiếp tục phát triển.\\nHãy tìm kiếm "101 Spooky Monochrome Color By Number Mysteries Alan Parker" trên Amazon để để lại đánh giá của bạn.\\nViệc này chỉ mất 60 giây và có ý nghĩa rất lớn đối với một người sáng tạo độc lập. Xin cảm ơn.',
    heading3: 'Yêu thích những câu đố tô màu một bút? Khám phá toàn bộ series:',
    body3: 'Tìm kiếm "Monochrome Color by Number Alan Parker" trên Amazon để tìm thấy tất cả các tập.'
  });`
);

fs.writeFileSync('src/PdfExport.tsx', code);
console.log("PdfExport defaults patched.");
