const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

const getErrorMessage = `const getErrorMessage = (err: any) => {
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.';
      case 'auth/invalid-email':
        return 'Email không hợp lệ.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email hoặc mật khẩu không chính xác.';
      case 'auth/weak-password':
        return 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu từ 6 ký tự trở lên.';
      case 'auth/too-many-requests':
        return 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau.';
      default:
        return 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    }
  };`;

// replace success and generic error texts
code = code.replace('const generateCaptcha', getErrorMessage + '\n\n  const generateCaptcha');

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched errors 2");
