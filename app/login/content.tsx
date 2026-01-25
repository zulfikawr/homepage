import { Button, Input, FormLabel, Skeleton } from '@/components/UI';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import { Card } from '@/components/Card';

export default function LoginContent() {
  const { handleGithubLogin, handlePasswordLogin, loading } = useAuthActions();
  const { user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const onPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await handlePasswordLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  if (loading) {
    return (
      <div className='max-w-md mx-auto mt-20 p-6'>
        <div className='space-y-8'>
          <div className='space-y-4'>
            <Skeleton width={150} height={32} />
            <Skeleton width='100%' height={20} />
          </div>
          <Card isPreview className='p-8 space-y-6'>
            <Skeleton width='100%' height={44} />
            <div className='relative'>
              <Skeleton width='100%' height={1} />
            </div>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Skeleton width={80} height={20} />
                <Skeleton width='100%' height={40} />
              </div>
              <div className='space-y-2'>
                <Skeleton width={80} height={20} />
                <Skeleton width='100%' height={40} />
              </div>
              <Skeleton width='100%' height={44} className='mt-6' />
            </div>
          </Card>
        </div>
      </div>
    );
  }
