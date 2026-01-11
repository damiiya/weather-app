type Props = {
  message?: string;
};

export default function LoadingView({ message = "불러오는 중..." }: Props) {
  return (
    <div className='py-3 text-center'>
      <div className='mx-auto h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700' />
      <p className='mt-2 text-sm text-gray-500'>{message}</p>
    </div>
  );
}
