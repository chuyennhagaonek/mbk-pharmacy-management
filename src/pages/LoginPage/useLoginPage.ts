import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

export const useLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({
        username: email,
        password: password,
      });

      // Save token to localStorage
      localStorage.setItem('access_token', response.data.access_token);

      toast({
        title: 'Thành công',
        description: 'Đăng nhập thành công!',
      });

      // Redirect to home page
      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Lỗi đăng nhập',
        description:
          error.response?.data?.detail || 'Sai tên đăng nhập hoặc mật khẩu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};
