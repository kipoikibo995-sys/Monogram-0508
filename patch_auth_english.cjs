const fs = require('fs');
let code = fs.readFileSync('src/components/AuthPage.tsx', 'utf8');

const getErrorMessage = `const getErrorMessage = (err: any) => {
    console.error("Auth Error:", err);
    switch (err.code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please log in or use another email.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      default:
        return err.message || 'An error occurred. Please try again later.';
    }
  };`;

// replace getErrorMessage function block
code = code.replace(/const getErrorMessage = \(err: any\) => \{[\s\S]*?return err\.message \|\| 'Đã có lỗi xảy ra\. Vui lòng thử lại sau\.';\n\s*\}\n\s*\};/, getErrorMessage);


// replace success and generic error texts that were translated to vietnamese
code = code.replace(/'Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực.'/g, "'Sign up successful! Please check your email to verify.'");
code = code.replace(/'Vui lòng xác thực email của bạn trước khi đăng nhập.'/g, "'Please verify your email before logging in.'");
code = code.replace(/'Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.'/g, "'Verification email resent. Please check your inbox.'");
code = code.replace(/'Email đã được xác thực. Bạn có thể đăng nhập.'/g, "'Email is already verified. You can log in.'");
code = code.replace(/'Vui lòng nhập email và mật khẩu để gửi lại xác thực.'/g, "'Please enter your email and password to resend verification.'");
code = code.replace(/'Câu trả lời phép toán không chính xác.'/g, "'Incorrect math answer.'");

fs.writeFileSync('src/components/AuthPage.tsx', code);
console.log("Patched to English");
