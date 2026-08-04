const fs = require('fs');

let code = fs.readFileSync('src/BookFlow.tsx', 'utf8');

// Cover Page
code = code.replace(/topSubtitle: 'SÁCH TÔ MÀU MỘT MÀU'/g, "topSubtitle: 'ONE COLOR COLORING BOOK'");
code = code.replace(/subtitle2: 'Tô Màu Theo Số'/g, "subtitle2: 'Color by Number'");
code = code.replace(/mainTitle: 'ĐƠN SẮC'/g, "mainTitle: 'MONOCHROME'");
code = code.replace(/themeTitle: 'NHỮNG BÍ ẨN KỲ BÍ'/g, "themeTitle: 'SPOOKY MYSTERIES'");

// Copyright Page
code = code.replace(/title: 'BẢN QUYỀN'/g, "title: 'COPYRIGHT PAGE'");
code = code.replace(/rights: 'Mọi quyền được bảo lưu\.'/g, "rights: 'All Rights Reserved.'");
code = code.replace(/description: 'Không phần nào của cuốn sách này được phép sao chép, lưu trữ trong hệ thống truy xuất hoặc truyền tải dưới bất kỳ hình thức hoặc phương tiện nào—điện tử, cơ học, sao chụp, ghi âm hoặc bằng cách khác—nếu không có sự cho phép bằng văn bản trước từ tác giả\.'/g, "description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.'");

// Welcome Page
code = code.replace(/title: 'CHÀO MỪNG BẠN ĐẾN VỚI SÁCH TÔ MÀU ĐƠN SẮC'/g, "title: 'WELCOME TO MONOCHROME COLOR QUEST'");
code = code.replace(/intro: 'Khám phá niềm vui thư giãn khi làm lộ ra tác phẩm nghệ thuật đơn sắc tuyệt đẹp—\\nmỗi lần một nét\.\\nBên trong cuốn sách này, bạn sẽ khám phá 101 hình minh họa ẩn giấu, bao gồm\\nđộng vật hoang dã hùng vĩ, thú cưng đáng yêu, những chú chim đầy màu sắc và nhiều hơn nữa'/g, "intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\\none mark at a time.\\nInside this book you\\'ll uncover 101 hidden illustrations, including\\nmajestic wildlife, adorable pets, colorful birds and more'");
code = code.replace(/howToTitle: 'CÁCH SỬ DỤNG CUỐN SÁCH NÀY'/g, "howToTitle: 'HOW TO USE THIS BOOK'");
code = code.replace(/howToSteps: 'Mỗi ô vuông chứa một con số\.\\n\\nGhép con số đó với ký hiệu\\nđược hiển thị trong phần chú giải bên dưới\\ncâu đố\.\\n\\nSử dụng bút đen, tô kín mọi ô vuông\\nbằng ký hiệu chính xác\.'/g, "howToSteps: 'Each square contains a number.\\n\\nMatch the number with the symbol\\nshown in the legend below the\\npuzzle.\\n\\nUsing a black pen, fill every square\\nwith the correct symbol.'");
code = code.replace(/penTitle: 'GỢI Ý BÚT TÔ'/g, "penTitle: 'PEN RECOMMENDATIONS'");
code = code.replace(/penIntro: 'Để có kết quả tốt nhất, chúng tôi\\ngợi ý:'/g, "penIntro: 'For the best results, we\\nrecommend:'");
code = code.replace(/penList: \['Bút kim \(0\.4–0\.6 mm\)', 'Bút gel đen', 'Bút bi đen'\]/g, "penList: ['Fine liner (0.4–0.6 mm)', 'Black gel pen', 'Black ballpoint pen']");
code = code.replace(/penOutro: 'Tránh sử dụng bút dạ quang hoặc\\nbút dạ gốc cồn, vì chúng\\ncó thể bị thấm qua giấy\.\\n\\nNếu bạn đang sử dụng loại bút nhiều mực,\\nhãy đặt một tờ giấy trắng đằng sau\\ntrang sách để bảo vệ câu đố tiếp theo\.'/g, "penOutro: 'Avoid permanent markers or\\nalcohol-based markers, as they\\nmay bleed through the paper.\\n\\nIf you\\'re using a very wet pen,\\nplace a blank sheet behind the\\npage to protect the next puzzle.'");

// Welcome Page Legend
code = code.replace(/title: 'DẤU CHẤM', desc: 'Chỉ chấm ở giữa'/g, "title: 'DOT', desc: 'Center Dot only'");
code = code.replace(/title: 'GẠCH CHÉO', desc: 'Một gạch chéo \(\/\)'/g, "title: 'SLASH', desc: 'Single slash (/)'");
code = code.replace(/title: 'GẠCH CHÉO NGƯỢC', desc: 'Một gạch chéo ngược \(\\\\\)'/g, "title: 'BACKSLASH', desc: 'Single backslash (\\\\)'");
code = code.replace(/title: 'CHỮ X', desc: 'Dấu chéo \(X\)'/g, "title: 'X', desc: 'Cross mark (X)'");
code = code.replace(/title: 'DẤU SAO', desc: 'Dấu sao \(\*\)'/g, "title: 'ASTERISK', desc: 'Asterisk (*)'");
code = code.replace(/title: 'Ô VUÔNG ĐEN', desc: 'Tô đen toàn bộ ô vuông'/g, "title: 'FILLED SQUARE', desc: 'Solid black square'");

// Warmup Page
code = code.replace(/title: 'LUYỆN TẬP KHỞI ĐỘNG'/g, "title: 'WARM UP PRACTICE'");
code = code.replace(/subtitle: 'Trau dồi nét bút của bạn bằng cách luyện tập từng mã trong các ô dưới đây\\ntrước khi bắt đầu câu đố\.'/g, "subtitle: 'Hone your pen strokes by practicing each code in the cells below\\nbefore starting the puzzle.'");
code = code.replace(/label: 'MỨC 0: DẤU CHẤM', desc: 'Luyện tập vẽ "Chỉ chấm ở giữa" trong các ô này:'/g, "label: 'LEVEL 0: DOT', desc: 'Practice drawing \"Center Dot only\" in these cells:'");
code = code.replace(/label: 'MỨC 1: GẠCH CHÉO', desc: 'Luyện tập vẽ "Một gạch chéo \(\/\)" trong các ô này:'/g, "label: 'LEVEL 1: SLASH', desc: 'Practice drawing \"Single slash (/)\" in these cells:'");
code = code.replace(/label: 'MỨC 2: GẠCH CHÉO NGƯỢC', desc: 'Luyện tập vẽ "Một gạch chéo ngược \(\\\\\)" trong các ô này:'/g, "label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing \"Single backslash (\\\\)\" in these cells:'");
code = code.replace(/label: 'MỨC 3: CHỮ X', desc: 'Luyện tập vẽ "Dấu chéo \(X\)" trong các ô này:'/g, "label: 'LEVEL 3: X', desc: 'Practice drawing \"Cross mark (X)\" in these cells:'");
code = code.replace(/label: 'MỨC 4: DẤU SAO', desc: 'Luyện tập vẽ "Dấu sao \(\*\)" trong các ô này:'/g, "label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing \"Asterisk(*)\" in these cells:'");
code = code.replace(/label: 'MỨC 5: Ô VUÔNG ĐEN', desc: 'Luyện tập vẽ "Tô đen toàn bộ ô vuông" trong các ô này:'/g, "label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing \"Solid black square\" in these cells:'");

// Pentesting Page
code = code.replace(/title: 'TRANG THỬ BÚT'/g, "title: 'PEN TESTING LAB'");
code = code.replace(/subtitle: 'Hãy thử bút kim, bút gel đen hoặc bút bi đen của bạn dưới đây\.\\nSo sánh mức độ thấm mực và độ đậm nhạt\.'/g, "subtitle: 'Try out your fine-liners, black gel, or black ballpoint pen below.\\nCompare ink bleed-through and opacity.'");
code = code.replace(/pens: \['BÚT #1:', 'BÚT #2:', 'BÚT #3:', 'BÚT #4:'\]/g, "pens: ['PEN #1:', 'PEN #2:', 'PEN #3:', 'PEN #4:']");
code = code.replace(/gridsTitle: 'CÁC Ô LUYỆN TẬP NHỎ'/g, "gridsTitle: 'MINI PRACTICE GRIDS'");

// Mystery Page
code = code.replace(/title: 'Bí ẩn #01'/g, "title: 'Mystery #01'");
code = code.replace(/name: 'Dấu chấm'/g, "name: 'Dot'");
code = code.replace(/name: 'Gạch chéo'/g, "name: 'Slash'");
code = code.replace(/name: 'Gạch chéo ngược'/g, "name: 'Backslash'");
code = code.replace(/name: 'Chữ X'/g, "name: 'Cross'");
code = code.replace(/name: 'Dấu sao'/g, "name: 'Asterisk'");
code = code.replace(/name: 'Ô vuông đen'/g, "name: 'Filled Square'");

// Thank You Page
code = code.replace(/title: 'Cảm ơn bạn đã tô màu cùng chúng tôi'/g, "title: 'Thank You for Coloring With Us'");
code = code.replace(/heading1: 'Bạn đã khám phá ra bí ẩn — Thật tuyệt vời!'/g, "heading1: 'You Revealed the Mystery — Well Done!'");
code = code.replace(/body1: 'Bạn đã vượt qua mọi sinh vật ẩn giấu, mọi bí mật mờ ảo, mọi bất ngờ đáng sợ\.\\nĐiều đó đòi hỏi sự kiên nhẫn, sự tập trung và một đôi tay vô cùng vững vàng\.'/g, "body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise.\\nThat takes patience, focus, and a seriously steady hand.'");
code = code.replace(/heading2: 'Có điều gì làm bạn mỉm cười không\? Có làm bạn ngạc nhiên không\? Có làm bạn rùng mình \(theo một cách tuyệt vời nhất\) không\?'/g, "heading2: 'Did something make you smile? Surprise you? Creep you out (in the best way)?'");
code = code.replace(/body2: 'Một đánh giá chân thành trên Amazon, dù chỉ một câu ngắn gọn — cũng giúp những người yêu thích câu đố khác tìm thấy cuốn sách này và giúp bộ truyện này tiếp tục phát triển\.\\nHãy tìm kiếm "101 Spooky Monochrome Color By Number Mysteries Alan Parker" trên Amazon để để lại đánh giá của bạn\.\\nViệc này chỉ mất 60 giây và có ý nghĩa rất lớn đối với một người sáng tạo độc lập\. Xin cảm ơn\.'/g, "body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing.\\nSearch \"101 Spooky Monochrome Color By Number Mysteries Alan Parker\" on Amazon to leave your review.\\nIt takes 60 seconds and means everything to an independent creator. Thank you.'");
code = code.replace(/heading3: 'Yêu thích những câu đố tô màu một bút\? Khám phá toàn bộ series:'/g, "heading3: 'Love One-Pen Puzzles? Explore the Full Series:'");
code = code.replace(/body3: 'Tìm kiếm "Monochrome Color by Number Alan Parker" trên Amazon để tìm thấy tất cả các tập\.'/g, "body3: 'Search \"Monochrome Color by Number Alan Parker\" on Amazon to find all volumes.'");

// Headers
code = code.replace(/<div className="w-24 text-center">Ký hiệu<\/div>/g, '<div className="w-24 text-center">Mark</div>');
code = code.replace(/<div className="w-24 text-center">Mã<\/div>/g, '<div className="w-24 text-center">Code</div>');
code = code.replace(/<div className="flex-1">Tên gọi<\/div>/g, '<div className="flex-1">Name</div>');
code = code.replace(/<div className="w-32 text-right">Mật độ %<\/div>/g, '<div className="w-32 text-right">Density %</div>');
code = code.replace(/<span>Nhà xuất bản:<\/span>/g, '<span>Imprint:</span>');
code = code.replace(/<span>Bản quyền ©<\/span>/g, '<span>Copyright ©</span>');

fs.writeFileSync('src/BookFlow.tsx', code);
console.log("BookFlow translated to English");

let pdfCode = fs.readFileSync('src/PdfExport.tsx', 'utf8');

// Cover Page
pdfCode = pdfCode.replace(/topSubtitle: 'SÁCH TÔ MÀU MỘT MÀU'/g, "topSubtitle: 'ONE COLOR COLORING BOOK'");
pdfCode = pdfCode.replace(/subtitle2: 'Tô Màu Theo Số'/g, "subtitle2: 'Color by Number'");
pdfCode = pdfCode.replace(/mainTitle: 'ĐƠN SẮC'/g, "mainTitle: 'MONOCHROME'");
pdfCode = pdfCode.replace(/themeTitle: 'NHỮNG BÍ ẨN KỲ BÍ'/g, "themeTitle: 'SPOOKY MYSTERIES'");

// Copyright Page
pdfCode = pdfCode.replace(/title: 'BẢN QUYỀN'/g, "title: 'COPYRIGHT PAGE'");
pdfCode = pdfCode.replace(/rights: 'Mọi quyền được bảo lưu\.'/g, "rights: 'All Rights Reserved.'");
pdfCode = pdfCode.replace(/description: 'Không phần nào của cuốn sách này được phép sao chép, lưu trữ trong hệ thống truy xuất hoặc truyền tải dưới bất kỳ hình thức hoặc phương tiện nào—điện tử, cơ học, sao chụp, ghi âm hoặc bằng cách khác—nếu không có sự cho phép bằng văn bản trước từ tác giả\.'/g, "description: 'No part of this book may be reproduced, stored in a retrieval system, or transmitted in any form or by any means—electronic, mechanical, photocopying, recording, or otherwise—without prior written permission from the author.'");

// Welcome Page
pdfCode = pdfCode.replace(/title: 'CHÀO MỪNG BẠN ĐẾN VỚI SÁCH TÔ MÀU ĐƠN SẮC'/g, "title: 'WELCOME TO MONOCHROME COLOR QUEST'");
pdfCode = pdfCode.replace(/intro: 'Khám phá niềm vui thư giãn khi làm lộ ra tác phẩm nghệ thuật đơn sắc tuyệt đẹp—\\nmỗi lần một nét\.\\nBên trong cuốn sách này, bạn sẽ khám phá 101 hình minh họa ẩn giấu, bao gồm\\nđộng vật hoang dã hùng vĩ, thú cưng đáng yêu, những chú chim đầy màu sắc và nhiều hơn nữa'/g, "intro: 'Discover the relaxing joy of revealing beautiful monochrome artwork—\\none mark at a time.\\nInside this book you\\'ll uncover 101 hidden illustrations, including\\nmajestic wildlife, adorable pets, colorful birds and more'");
pdfCode = pdfCode.replace(/howToTitle: 'CÁCH SỬ DỤNG CUỐN SÁCH NÀY'/g, "howToTitle: 'HOW TO USE THIS BOOK'");
pdfCode = pdfCode.replace(/howToSteps: 'Mỗi ô vuông chứa một con số\.\\n\\nGhép con số đó với ký hiệu\\nđược hiển thị trong phần chú giải bên dưới\\ncâu đố\.\\n\\nSử dụng bút đen, tô kín mọi ô vuông\\nbằng ký hiệu chính xác\.'/g, "howToSteps: 'Each square contains a number.\\n\\nMatch the number with the symbol\\nshown in the legend below the\\npuzzle.\\n\\nUsing a black pen, fill every square\\nwith the correct symbol.'");
pdfCode = pdfCode.replace(/penTitle: 'GỢI Ý BÚT TÔ'/g, "penTitle: 'PEN RECOMMENDATIONS'");
pdfCode = pdfCode.replace(/penIntro: 'Để có kết quả tốt nhất, chúng tôi\\ngợi ý:'/g, "penIntro: 'For the best results, we\\nrecommend:'");
pdfCode = pdfCode.replace(/penList: \['Bút kim \(0\.4–0\.6 mm\)', 'Bút gel đen', 'Bút bi đen'\]/g, "penList: ['Fine liner (0.4–0.6 mm)', 'Black gel pen', 'Black ballpoint pen']");
pdfCode = pdfCode.replace(/penOutro: 'Tránh sử dụng bút dạ quang hoặc\\nbút dạ gốc cồn, vì chúng\\ncó thể bị thấm qua giấy\.\\n\\nNếu bạn đang sử dụng loại bút nhiều mực,\\nhãy đặt một tờ giấy trắng đằng sau\\ntrang sách để bảo vệ câu đố tiếp theo\.'/g, "penOutro: 'Avoid permanent markers or\\nalcohol-based markers, as they\\nmay bleed through the paper.\\n\\nIf you\\'re using a very wet pen,\\nplace a blank sheet behind the\\npage to protect the next puzzle.'");

// Welcome Page Legend
pdfCode = pdfCode.replace(/title: 'DẤU CHẤM', desc: 'Chỉ chấm ở giữa'/g, "title: 'DOT', desc: 'Center Dot only'");
pdfCode = pdfCode.replace(/title: 'GẠCH CHÉO', desc: 'Một gạch chéo \(\/\)'/g, "title: 'SLASH', desc: 'Single slash (/)'");
pdfCode = pdfCode.replace(/title: 'GẠCH CHÉO NGƯỢC', desc: 'Một gạch chéo ngược \(\\\\\)'/g, "title: 'BACKSLASH', desc: 'Single backslash (\\\\)'");
pdfCode = pdfCode.replace(/title: 'CHỮ X', desc: 'Dấu chéo \(X\)'/g, "title: 'X', desc: 'Cross mark (X)'");
pdfCode = pdfCode.replace(/title: 'DẤU SAO', desc: 'Dấu sao \(\*\)'/g, "title: 'ASTERISK', desc: 'Asterisk (*)'");
pdfCode = pdfCode.replace(/title: 'Ô VUÔNG ĐEN', desc: 'Tô đen toàn bộ ô vuông'/g, "title: 'FILLED SQUARE', desc: 'Solid black square'");

// Warmup Page
pdfCode = pdfCode.replace(/title: 'LUYỆN TẬP KHỞI ĐỘNG'/g, "title: 'WARM UP PRACTICE'");
pdfCode = pdfCode.replace(/subtitle: 'Trau dồi nét bút của bạn bằng cách luyện tập từng mã trong các ô dưới đây\\ntrước khi bắt đầu câu đố\.'/g, "subtitle: 'Hone your pen strokes by practicing each code in the cells below\\nbefore starting the puzzle.'");
pdfCode = pdfCode.replace(/label: 'MỨC 0: DẤU CHẤM', desc: 'Luyện tập vẽ "Chỉ chấm ở giữa" trong các ô này:'/g, "label: 'LEVEL 0: DOT', desc: 'Practice drawing \"Center Dot only\" in these cells:'");
pdfCode = pdfCode.replace(/label: 'MỨC 1: GẠCH CHÉO', desc: 'Luyện tập vẽ "Một gạch chéo \(\/\)" trong các ô này:'/g, "label: 'LEVEL 1: SLASH', desc: 'Practice drawing \"Single slash (/)\" in these cells:'");
pdfCode = pdfCode.replace(/label: 'MỨC 2: GẠCH CHÉO NGƯỢC', desc: 'Luyện tập vẽ "Một gạch chéo ngược \(\\\\\)" trong các ô này:'/g, "label: 'LEVEL 2: BACKSLASH', desc: 'Practice drawing \"Single backslash (\\\\)\" in these cells:'");
pdfCode = pdfCode.replace(/label: 'MỨC 3: CHỮ X', desc: 'Luyện tập vẽ "Dấu chéo \(X\)" trong các ô này:'/g, "label: 'LEVEL 3: X', desc: 'Practice drawing \"Cross mark (X)\" in these cells:'");
pdfCode = pdfCode.replace(/label: 'MỨC 4: DẤU SAO', desc: 'Luyện tập vẽ "Dấu sao \(\*\)" trong các ô này:'/g, "label: 'LEVEL 4: ASTERISK', desc: 'Practice drawing \"Asterisk(*)\" in these cells:'");
pdfCode = pdfCode.replace(/label: 'MỨC 5: Ô VUÔNG ĐEN', desc: 'Luyện tập vẽ "Tô đen toàn bộ ô vuông" trong các ô này:'/g, "label: 'LEVEL 5: FILLED SQUARE', desc: 'Practice drawing \"Solid black square\" in these cells:'");

// Pentesting Page
pdfCode = pdfCode.replace(/title: 'TRANG THỬ BÚT'/g, "title: 'PEN TESTING LAB'");
pdfCode = pdfCode.replace(/subtitle: 'Hãy thử bút kim, bút gel đen hoặc bút bi đen của bạn dưới đây\.\\nSo sánh mức độ thấm mực và độ đậm nhạt\.'/g, "subtitle: 'Try out your fine-liners, black gel, or black ballpoint pen below.\\nCompare ink bleed-through and opacity.'");
pdfCode = pdfCode.replace(/pens: \['BÚT #1:', 'BÚT #2:', 'BÚT #3:', 'BÚT #4:'\]/g, "pens: ['PEN #1:', 'PEN #2:', 'PEN #3:', 'PEN #4:']");
pdfCode = pdfCode.replace(/gridsTitle: 'CÁC Ô LUYỆN TẬP NHỎ'/g, "gridsTitle: 'MINI PRACTICE GRIDS'");

// Mystery Page
pdfCode = pdfCode.replace(/title: 'Bí ẩn #01'/g, "title: 'Mystery #01'");
pdfCode = pdfCode.replace(/name: 'Dấu chấm'/g, "name: 'Dot'");
pdfCode = pdfCode.replace(/name: 'Gạch chéo'/g, "name: 'Slash'");
pdfCode = pdfCode.replace(/name: 'Gạch chéo ngược'/g, "name: 'Backslash'");
pdfCode = pdfCode.replace(/name: 'Chữ X'/g, "name: 'Cross'");
pdfCode = pdfCode.replace(/name: 'Dấu sao'/g, "name: 'Asterisk'");
pdfCode = pdfCode.replace(/name: 'Ô vuông đen'/g, "name: 'Filled Square'");

// Thank You Page
pdfCode = pdfCode.replace(/title: 'Cảm ơn bạn đã tô màu cùng chúng tôi'/g, "title: 'Thank You for Coloring With Us'");
pdfCode = pdfCode.replace(/heading1: 'Bạn đã khám phá ra bí ẩn — Thật tuyệt vời!'/g, "heading1: 'You Revealed the Mystery — Well Done!'");
pdfCode = pdfCode.replace(/body1: 'Bạn đã vượt qua mọi sinh vật ẩn giấu, mọi bí mật mờ ảo, mọi bất ngờ đáng sợ\.\\nĐiều đó đòi hỏi sự kiên nhẫn, sự tập trung và một đôi tay vô cùng vững vàng\.'/g, "body1: 'You made it through every hidden creature, every shadowy secret, every spooky surprise.\\nThat takes patience, focus, and a seriously steady hand.'");
pdfCode = pdfCode.replace(/heading2: 'Có điều gì làm bạn mỉm cười không\? Có làm bạn ngạc nhiên không\? Có làm bạn rùng mình \(theo một cách tuyệt vời nhất\) không\?'/g, "heading2: 'Did something make you smile? Surprise you? Creep you out (in the best way)?'");
pdfCode = pdfCode.replace(/body2: 'Một đánh giá chân thành trên Amazon, dù chỉ một câu ngắn gọn — cũng giúp những người yêu thích câu đố khác tìm thấy cuốn sách này và giúp bộ truyện này tiếp tục phát triển\.\\nHãy tìm kiếm "101 Spooky Monochrome Color By Number Mysteries Alan Parker" trên Amazon để để lại đánh giá của bạn\.\\nViệc này chỉ mất 60 giây và có ý nghĩa rất lớn đối với một người sáng tạo độc lập\. Xin cảm ơn\.'/g, "body2: 'An honest review on Amazon, even just one sentence — helps other puzzle lovers find this book and keeps this series growing.\\nSearch \"101 Spooky Monochrome Color By Number Mysteries Alan Parker\" on Amazon to leave your review.\\nIt takes 60 seconds and means everything to an independent creator. Thank you.'");
pdfCode = pdfCode.replace(/heading3: 'Yêu thích những câu đố tô màu một bút\? Khám phá toàn bộ series:'/g, "heading3: 'Love One-Pen Puzzles? Explore the Full Series:'");
pdfCode = pdfCode.replace(/body3: 'Tìm kiếm "Monochrome Color by Number Alan Parker" trên Amazon để tìm thấy tất cả các tập\.'/g, "body3: 'Search \"Monochrome Color by Number Alan Parker\" on Amazon to find all volumes.'");

// Headers
pdfCode = pdfCode.replace(/>Ký hiệu<\/Text>/g, '>Mark</Text>');
pdfCode = pdfCode.replace(/>Mã<\/Text>/g, '>Code</Text>');
pdfCode = pdfCode.replace(/>Tên gọi<\/Text>/g, '>Name</Text>');
pdfCode = pdfCode.replace(/>Mật độ %<\/Text>/g, '>Density %</Text>');
pdfCode = pdfCode.replace(/Nhà xuất bản:/g, 'Imprint:');
pdfCode = pdfCode.replace(/Bản quyền ©/g, 'Copyright ©');
pdfCode = pdfCode.replace(/Ô LƯỚI #/g, 'GRID #');

fs.writeFileSync('src/PdfExport.tsx', pdfCode);
console.log("PdfExport translated to English");
