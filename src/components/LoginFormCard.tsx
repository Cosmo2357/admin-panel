import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import { z } from 'zod';
import useStore from '../stores/mainStore';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
const loginSchema = z.object({
  mail: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(20, 'Password must be at most 20 characters long'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFormCard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const { login } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      // const response = await axios.post('/api/login', data);
      // if (response.status === 200) {
      setTimeout(() => {
        setLoading(false);
        toast({
          title: 'Login Successful',
          description: (
            <div className="flex items-center">
              <FaCheckCircle className="mr-2 text-green-500" />
              <span>You have successfully logged in.</span>
            </div>
          ),
        });
        login();
      }, 2000);
      // }
    } catch (error) {
      console.error('Login failed', error);
      setLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          This is a validation example. Please fill a random email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mail">Mail</Label>
              <Input
                id="mail"
                placeholder="me@example.com"
                disabled={loading}
                {...register('mail')}
              />
              {errors.mail && (
                <Alert variant="form">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.mail.message}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="password"
                type="password"
                disabled={loading}
                {...register('password')}
              />
              {errors.password && (
                <Alert variant="form">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.password.message}</AlertDescription>
                </Alert>
              )}
            </div>
          </div>
          <CardFooter className=" mt-8 p-0">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? (
                <div
                  className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status"
                />
              ) : (
                'Login'
              )}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginFormCard;
