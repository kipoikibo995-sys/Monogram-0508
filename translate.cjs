const fs = require('fs');

let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// Copyright Page
code = code.replace(
  /title: 'COPYRIGHT PAGE',/g,
  "title: 'BẢN QUYỀN',"
);
code = code.replace(
  /rights: 'All Rights Reserved\.',/g,
  "rights: 'Mọi quyền được bảo lưu.',"
);
code = code.replace(
  /description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author\.',/g,
  "description: 'Không phần nào của cuốn sách này được phép sao chép, lưu trữ trong hệ thống truy xuất hoặc truyền tải dưới bất kỳ hình thức hoặc phương tiện nào—điện tử, cơ học, sao chụp, ghi âm hoặc bằng cách khác—nếu không có sự cho phép bằng văn bản trước từ tác giả.',"
);

// Welcome Page
code = code.replace(
  /title: 'WELCOME TO MONOCHROME COLOR QUEST',/g,
  "title: 'CHÀO MỪNG BẠN ĐẾN VỚI SÁCH TÔ MÀU ĐƠN SẮC',"
);
code = code.replace(
  /intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\\none mark at a time\.\\nInside this book you\\'ll uncover 101 hidden illustrations, including\\nmajestic wildlife, adorable pets, colorful birds and more',/g,
  "intro: 'Khám phá niềm vui thư giãn khi làm lộ ra tác phẩm nghệ thuật đơn sắc tuyệt đẹp—\\nmỗi lần một nét.\\nBên trong cuốn sách này, bạn sẽ khám phá 101 hình minh họa ẩn giấu, bao gồm\\nđộng vật hoang dã hùng vĩ, thú cưng đáng yêu, những chú chim đầy màu sắc và nhiều hơn nữa',"
);
code = code.replace(
  /howToTitle: 'HOW TO USE THIS BOOK',/g,
  "howToTitle: 'CÁCH SỬ DỤNG CUỐN SÁCH NÀY',"
);
code = code.replace(
  /howToSteps: 'Each square contains a number\.\\n\\nMatch the number with the symbol\\nshown in the legend below the\\npuzzle\.\\n\\nUsing a black pen, fill every square\\nwith the correct symbol\.',/g,
  "howToSteps: 'Mỗi ô vuông chứa một con số.\\n\\nGhép con số đó với ký hiệu\\nđược hiển thị trong phần chú giải bên dưới\\ncâu đố.\\n\\nSử dụng bút đen, tô kín mọi ô vuông\\nbằng ký hiệu chính xác.',"
);
code = code.replace(
  /penTitle: 'PEN RECOMMENDATIONS',/g,
  "penTitle: 'GỢI Ý BÚT TÔ',"
);
code = code.replace(
  /penIntro: 'For the best results, we\\nrecommend:',/g,
  "penIntro: 'Để có kết quả tốt nhất, chúng tôi\\ngợi ý:',"
);
code = code.replace(
  /penList: \['Fine liner \(0\.4–0\.6 mm\)', 'Black gel pen', 'Black ballpoint pen'\],/g,
  "penList: ['Bút kim (0.4–0.6 mm)', 'Bút gel đen', 'Bút bi đen'],"
);
code = code.replace(
  /penOutro: 'Avoid permanent markers or\\nalcohol-based markers, as they\\nmay bleed through the paper\.\\n\\nIf you\\'re using a very wet pen,\\nplace a blank sheet behind the\\npage to protect the next puzzle\.',/g,
  "penOutro: 'Tránh sử dụng bút dạ quang hoặc\\nbút dạ gốc cồn, vì chúng\\ncó thể bị thấm qua giấy.\\n\\nNếu bạn đang sử dụng loại bút nhiều mực,\\nhãy đặt một tờ giấy trắng đằng sau\\ntrang sách để bảo vệ câu đố tiếp theo.',"
);

// Welcome Page Legend
code = code.replace(
  /title: 'DOT', desc: 'Center Dot only'/g,
  "title: 'DẤU CHẤM', desc: 'Chỉ chấm ở giữa'"
);
code = code.replace(
  /title: 'SLASH', desc: 'Single slash \(\/\)'/g,
  "title: 'GẠCH CHÉO', desc: 'Một gạch chéo (/)'"
);
code = code.replace(
  /title: 'BACKSLASH', desc: 'Single backslash \(\\\\\)'/g,
  "title: 'GẠCH CHÉO NGƯỢC', desc: 'Một gạch chéo ngược (\\\\)'"
);
code = code.replace(
  /title: 'X', desc: 'Cross mark \(X\)'/g,
  "title: 'CHỮ X', desc: 'Dấu chéo (X)'"
);
code = code.replace(
  /title: 'ASTERISK', desc: 'Asterisk \(\*\)'/g,
  "title: 'DẤU SAO', desc: 'Dấu sao (*)'"
);
code = code.replace(
  /title: 'FILLED SQUARE', desc: 'Solid black square'/g,
  "title: 'Ô VUÔNG ĐEN', desc: 'Tô đen toàn bộ ô vuông'"
);

// Warmup Page
code = code.replace(
  /title: 'WARM UP PRACTICE',/g,
  "title: 'LUYỆN TẬP KHỞI ĐỘNG',"
);
code = code.replace(
  /subtitle: 'Hone your pen strokes by practicing each code in the cells below\\nbefore starting the puzzle\.',/g,
  "subtitle: 'Trau dồi nét bút của bạn bằng cách luyện tập từng mã trong các ô dưới đây\\ntrước khi bắt đầu câu đố.',"
);
code = code.replace(
  /label: 'LEVEL 0: DOT', desc: 'Practice drawing "Center Dot only" in these cells:'/g,
  "label: 'MỨC 0: DẤU CHẤM', desc: 'Luyện tập vẽ \"Chỉ chấm ở giữa\" trong các ô này:'"
);
code = code.replace(
  /label: 'LEVEL 1: SLASH', desc: 'Practice drawing "Single slash \(\/\)" in these cells:'/g,
  "label: 'MỨC 1: GẠCH CHÉO', desc: 'Luyện tập vẽ \"Một gạch chéo (/)\" trong các ô này:'"
);
code = code.replace(
  /label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing "Single backslash \(\\\\\)" in these cells:'/g,
  "label: 'MỨC 2: GẠCH CHÉO NGƯỢC', desc: 'Luyện tập vẽ \"Một gạch chéo ngược (\\\\)\" trong các ô này:'"
);
code = code.replace(
  /label: 'LEVEL 3: X', desc: 'Practice drawing "Cross mark \(X\)" in these cells:'/g,
  "label: 'MỨC 3: CHỮ X', desc: 'Luyện tập vẽ \"Dấu chéo (X)\" trong các ô này:'"
);
code = code.replace(
  /label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing "Asterisk\(\*\)" in these cells:'/g,
  "label: 'MỨC 4: DẤU SAO', desc: 'Luyện tập vẽ \"Dấu sao (*)\" trong các ô này:'"
);
code = code.replace(
  /label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing "Solid black square" in these cells:'/g,
  "label: 'MỨC 5: Ô VUÔNG ĐEN', desc: 'Luyện tập vẽ \"Tô đen toàn bộ ô vuông\" trong các ô này:'"
);

// Pentesting Page
code = code.replace(
  /title: 'PEN TESTING SHEET',/g,
  "title: 'TRANG THỬ BÚT',"
);
code = code.replace(
  /subtitle: 'Try out your fine-liners, black gel, or black ballpoint pen below\.\\nCompare ink bleed-through and opacity\.',/g,
  "subtitle: 'Hãy thử bút kim, bút gel đen hoặc bút bi đen của bạn dưới đây.\\nSo sánh mức độ thấm mực và độ đậm nhạt.',"
);
code = code.replace(
  /pens: \['PEN #1:', 'PEN #2:', 'PEN #3:', 'PEN #4:'\]/g,
  "pens: ['BÚT #1:', 'BÚT #2:', 'BÚT #3:', 'BÚT #4:']"
);
code = code.replace(
  /gridsTitle: 'MINI PRACTICE GRIDS'/g,
  "gridsTitle: 'CÁC Ô LUYỆN TẬP NHỎ'"
);

// Mystery Page
code = code.replace(
  /title: 'Mystery #01',/g,
  "title: 'Bí ẩn #01',"
);
code = code.replace(
  /name: 'Dot'/g,
  "name: 'Dấu chấm'"
);
code = code.replace(
  /name: 'Slash'/g,
  "name: 'Gạch chéo'"
);
code = code.replace(
  /name: 'Backslash'/g,
  "name: 'Gạch chéo ngược'"
);
code = code.replace(
  /name: 'Cross'/g,
  "name: 'Chữ X'"
);
code = code.replace(
  /name: 'Asterisk'/g,
  "name: 'Dấu sao'"
);
code = code.replace(
  /name: 'Filled Square'/g,
  "name: 'Ô vuông đen'"
);

// Thank You Page
code = code.replace(
  /title: 'Thank You for Coloring With Us',/g,
  "title: 'Cảm ơn bạn đã tô màu cùng chúng tôi',"
);
code = code.replace(
  /heading1: 'You Revealed the Mystery — Well Done!',/g,
  "heading1: 'Bạn đã khám phá ra bí ẩn — Thật tuyệt vời!',"
);
code = code.replace(
  /body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise\.\\nThat takes patience, focus, and a seriously steady hand\.',/g,
  "body1: 'Bạn đã vượt qua mọi sinh vật ẩn giấu, mọi bí mật mờ ảo, mọi bất ngờ đáng sợ.\\nĐiều đó đòi hỏi sự kiên nhẫn, sự tập trung và một đôi tay vô cùng vững vàng.',"
);
code = code.replace(
  /heading2: 'Did something make you smile\? Surprise you\? Creep you out \(in the best way\)\?',/g,
  "heading2: 'Có điều gì làm bạn mỉm cười không? Có làm bạn ngạc nhiên không? Có làm bạn rùng mình (theo một cách tuyệt vời nhất) không?',"
);
code = code.replace(
  /body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing\.\\nSearch "101 Spooky Monochrome Color By Number Mysteries Alan Parker" on Amazon to leave your review\.\\nIt takes 60 seconds and means everything to an independent creator\. Thank you\.',/g,
  "body2: 'Một đánh giá chân thành trên Amazon, dù chỉ một câu ngắn gọn — cũng giúp những người yêu thích câu đố khác tìm thấy cuốn sách này và giúp bộ truyện này tiếp tục phát triển.\\nHãy tìm kiếm \"101 Spooky Monochrome Color By Number Mysteries Alan Parker\" trên Amazon để để lại đánh giá của bạn.\\nViệc này chỉ mất 60 giây và có ý nghĩa rất lớn đối với một người sáng tạo độc lập. Xin cảm ơn.',"
);
code = code.replace(
  /heading3: 'Love One-Pen Puzzles\? Explore the Full Series:',/g,
  "heading3: 'Yêu thích những câu đố tô màu một bút? Khám phá toàn bộ series:',"
);
code = code.replace(
  /body3: 'Search "Monochrome Color by Number Alan Parker" on Amazon to find all volumes\.',/g,
  "body3: 'Tìm kiếm \"Monochrome Color by Number Alan Parker\" trên Amazon để tìm thấy tất cả các tập.',"
);

fs.writeFileSync('src/BookFlow.tsx', code);
console.log("BookFlow content translated.");
